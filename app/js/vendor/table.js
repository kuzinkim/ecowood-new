//! JQuery plugin "Compare Table"

;(function ($) {
	"use strict";

	// Options
	function CompareTable(options) {
		this.inited = options.inited || false;                      // �������������
		this.columns = options.columns || 1;                        // ����������� ������� ������� �������
		this.lines = options.lines || 10;                           // ����������� ������� �����
		this.folding = options.folding || false;                    // ������������ ��������
		this.pagination = options.pagination || false;              // ����������� ���������
		this.showArrows = options.showArrows || true;               // ����������� �������
		this.prev = options.prev || '<';                            // ������� �����
		this.next = options.next || '>';                            // ������� ������
		this.duplicate = options.duplicate || false;                // ����������� ������������� �������
		this.headerFixed = options.headerFixed || false;            // ������������� ����� �������
		this.responsive = options.responsive || false;              // ������������
	}

	// Initialization
	CompareTable.prototype.init = function(table) {
		if (this.inited) return false;
		this.inited = true;
		this.table = table;

		this.currentColumn = 0;
		this.currentPage = 1;

		this.folded = false;
		this.qtyLines = this.lines;

		this.widthPage = window.innerWidth;
		this.scrollPage = $(window).scrollTop();
		this.changeWidthPage = false;
		this.changedScrollPage = false;
		this.currentBreakpoint = false;

		// Add controls
		let htmlBtnPrev = '<a href="#" class="tbtn tbtn_prev tbtn_inactive">' + this.prev + '</a>';
		let htmlBtnNext = '<a href="#" class="tbtn tbtn_next">' + this.next + '</a>';
		this.showArrows && this.table.find('.tctrl').prepend(htmlBtnPrev).append(htmlBtnNext);

		// Add fixing header
		this.headerFixed && table.addClass('compareTable_headFix');

		// Add pagination
		this.pagination && this.addPagination();

		// Add folding
		this.folding && this.addFolding();

		this.update()
				.events();
	}



	// Updating
	CompareTable.prototype.update = function() {
		return this.updateBreakpoint()
							 .updateColumns()
							 .updateSizeColumns()
							 .updatePositionColumns()
							 .updateVisibleArrows()
	}



	// Updating breakpoints
	CompareTable.prototype.updateBreakpoint = function() {
		let currentBreakpoint = false;
		let newSettings = {};

		if (this.responsive) {
			for (let i = 0; i < this.responsive.length; i++) {
				let element = this.responsive[i];

				if (window.innerWidth >= element.breakpoint) {
					currentBreakpoint = element.breakpoint;
					newSettings = element.settings;
				}
			}
		}

		if (currentBreakpoint !== this.currentBreakpoint) {
			$.extend(this, newSettings);
		}

		return this;
	}



	// Updating columns
	CompareTable.prototype.updateColumns = function() {
		let child = (this.duplicate === 'out') ? '*:not(.dupIn)' : '';

		if (this.duplicate === 'in') {
			this.table.find('.dupIn').removeClass('hide');
			this.table.find('.dupOut').addClass('hide');
		} else if (this.duplicate === 'out') {
			this.table.find('.dupOut').removeClass('hide');
			this.table.find('.dupIn').addClass('hide');
		}

		this.allColumns = this.table.find('.tr').eq(0).children(child).length;
		this.workColumns = (this.allColumns < this.columns) ? this.allColumns : this.columns;

		this.table.find('.tw').css({'-webkit-box-flex': this.workColumns * 2, 'flex': (this.workColumns * 2) + ' 0 0'});

		return this;
	}

	CompareTable.prototype.updateSizeColumns = function() {
		if (this.workColumns < this.allColumns) {
			this.table.find('.tr').children().css('width', (100 / this.workColumns) + '%');
			this.table.find('.tr').css('width', this.allColumns * (100 / this.workColumns) + '%');
		} else {
			this.table.find('.tr').children().css('width', (100 / this.allColumns) + '%');
			this.table.find('.tr').css('width', 100 + '%');
		}

		return this;
	}

	CompareTable.prototype.updatePositionColumns = function(way) {
		let left;

		if (way === 'prev' && this.currentColumn > 0) {
			this.currentColumn--;
		} else if (way === 'next' && this.currentColumn < (this.allColumns - this.workColumns)) {
			this.currentColumn++;
		}

		if (this.currentColumn > (this.allColumns - this.workColumns)) {
			this.currentColumn = (this.allColumns - this.workColumns);
		}

		if (this.workColumns < this.allColumns) {
			left = -(100 / this.workColumns) * this.currentColumn;
		} else {
			this.currentColumn = 0;
			left = 0;
		}

		this.table.find('.tr').css('left', left + '%');
		this.table.find('.tbtn_prev').removeClass('tbtn_inactive');
		this.table.find('.tbtn_next').removeClass('tbtn_inactive');

		if (this.currentColumn === 0) {
			this.table.find('.tbtn_prev').addClass('tbtn_inactive');
		} else if (this.currentColumn === (this.allColumns - this.workColumns)) {
			this.table.find('.tbtn_next').addClass('tbtn_inactive');
		}

		return this;
	}



	// Updating arrows
	CompareTable.prototype.updateVisibleArrows = function() {
		if (this.workColumns >= this.allColumns || !this.showArrows) {
			this.table.find('.tbtn_prev').fadeOut(200);
			this.table.find('.tbtn_next').fadeOut(200);
		} else if (this.showArrows) {
			this.table.find('.tbtn_prev').fadeIn(200);
			this.table.find('.tbtn_next').fadeIn(200);
		}

		return this;
	}



	// Updating header
	CompareTable.prototype.updatePositionHeader = function() {
		let heightHeader = window.innerWidth < 992 ? $('.header_bottom').innerHeight() : 0;
		let scrollPage = $(window).scrollTop() + heightHeader;
		let heightPage = window.innerHeight;
		let heightTable = this.table.innerHeight();
		let topTable = this.table.offset().top;
		let heightHead = this.table.find('.thead').innerHeight();
		let topHead = scrollPage - topTable - 10;
		let maxTopHead = heightTable - heightHead - heightPage * 0.3;

		if (topHead > maxTopHead && maxTopHead > 0) {
			this.table.find('.thead').css('top', maxTopHead);
		} else if (topHead > 0) {
			this.table.find('.thead').css('top', topHead);
		} else if (topHead <= 0) {
			this.table.find('.thead').css('top', 0);
		}

		return this;
	}



	// Paginaton
	CompareTable.prototype.addPagination = function() {
		let qtyPages = Math.ceil(this.table.find('.tline').length / this.lines);
		let pagination = this.table.find('.tpaging');
		let htmlPagination = '';
		let htmlPages = '';

		if (qtyPages < 2) {
			pagination.remove();
			this.currentPage = 1;
			this.qtyLines = this.lines;
		} else {
			for (let i = 1; i <= qtyPages; i++) {
				htmlPages += '<button class="tpaging__page button button_page" data-value="'+i+'"><span>'+i+'</span></button>';

				if (qtyPages > 6 && (i === 1 || i === (qtyPages - 1))) {
					htmlPages += '<span class="tpaging__dots">...</span>';
				}
			}

			if (pagination[0]) {
				this.table.find('.tpaging__pages').html(htmlPages);
			} else {
				htmlPagination += '<div class="tpaging"><button class="tpaging__more button button_more" data-value="more"><span>�������� ���</span><svg width="20" height="20"><use xlink:href="/upload/images/sprite.svg#arrow"></use></svg></button><div class="tpaging__pages">' + htmlPages + '</div></div>';
				this.table.append(htmlPagination);
			}
		}

		this.applyPagination()
				.updatePagination();

		return this;
	}

	CompareTable.prototype.changePagination = function(link) {
		let $link = $(link);
		let linkValue = $link.attr('data-value');

		if ($link.hasClass('active')) return this;

		if (linkValue === 'more') {
			this.qtyLines = this.qtyLines + this.lines;
			this.currentPage++;
		} else if (linkValue === 'next') {
			this.qtyLines = this.lines;
			this.currentPage++;
		} else if (linkValue === 'prev') {
			this.qtyLines = this.lines;
			this.currentPage--;
		} else {
			this.qtyLines = this.lines;
			this.currentPage = +linkValue;
		}

		this.applyPagination()
				.updatePagination();

		return this;
	}

	CompareTable.prototype.applyPagination = function() {
		let lines = this.table.find('.tline');
		let lastLine = this.currentPage * this.lines;
		let firstLine = lastLine - this.lines;

		if (this.qtyLines !== this.lines) {
			firstLine = lastLine - this.qtyLines;
		}

		for (let i = 0; i < lines.length; i++) {
			const line = $(lines[i]);

			if (i >= firstLine && i < lastLine) {
				line.removeClass('hide');
			} else {
				line.addClass('hide');
			}
		}

		return this;
	}

	CompareTable.prototype.updatePagination = function() {
		let qtyPages = Math.ceil(this.table.find('.tline').length / this.lines);
		let wrapPages = this.table.find('.tpaging__pages');
		let btnMore = this.table.find('.tpaging__more');
		let pages = this.table.find('.tpaging__page');
		let dots = this.table.find('.tpaging__dots');
		let page = this.currentPage;

		wrapPages.find('button.active').removeClass('active');
		wrapPages.find('button[data-value="'+page+'"]').addClass('active');

		if (qtyPages === page) {
			btnMore.addClass('hide');
		} else {
			btnMore.removeClass('hide');
		}

		if (page > 3) {
			dots.eq(0).removeClass('hide');
		} else {
			dots.eq(0).addClass('hide');
		}

		if (page < qtyPages - 2) {
			dots.eq(1).removeClass('hide');
		} else {
			dots.eq(1).addClass('hide');
		}

		if (qtyPages > 6) {
			for (let i = 1; i < qtyPages-1; i++) {
				if (i > page || i < (page - 2)) {
					pages.eq(i).addClass('hide');
				} else {
					pages.eq(i).removeClass('hide');
				}
			}
		}

		return this;
	}



	// Folding
	CompareTable.prototype.addFolding = function() {
		let allLines = this.table.find('.thead, .tline').length;
		let pagination = this.table.find('.tpaging');
		let htmlControlFolding = '<div class="tpaging tpaging_fold"><button class="tpaging__fold folded" data-value="more"><span>����������</span><span>��������</span><svg width="20" height="20"><use xlink:href="/upload/images/sprite.svg#arrow"></use></svg></button></div>';

		if (allLines <= this.lines) {
			pagination.remove();
			this.folded = false;
			this.table.removeClass('foldable folded');
		} else if (!pagination[0]) {
			this.folded = true;
			this.table.addClass('foldable folded').append(htmlControlFolding);
		}

		this.updateFolding();

		return this;
	}

	CompareTable.prototype.changeFold = function(btn) {
		if (this.folded) {
			this.folded = false;
			this.table.removeClass('folded');
			$(btn).removeClass('folded');
		} else {
			this.folded = true;
			this.table.addClass('folded');
			$(btn).addClass('folded');
		}

		this.updateFolding(true);

		return this;
	}

	CompareTable.prototype.updateFolding = function(animate) {
		let lines = this.table.find('.thead, .tline');
		let time = animate ? 200 : 0;

		for (let i = 0; i < lines.length; i++) {
			const line = lines.eq(i);

			if (i >= this.lines && this.folded) {
				line.addClass('folded').slideUp(time);
			} else {
				line.removeClass('folded').slideDown(time);
			}
		}

		return this;
	}

	// Adding lines
	CompareTable.prototype.addLine = function(element) {
		if (this.pagination && this.table.find('.tpaging')[0]) {
			this.table.find('.tpaging').before($(element));
		} else {
			this.table.append($(element));
		}

		this.pagination && this.addPagination();
		this.folding && this.addFolding();

		return this;
	}



	// Updating page
	CompareTable.prototype.checkWidthPage = function() {
		if (!this.changeWidthPage) {
			this.changeWidthPage = true;
			let self = this;

			setTimeout(function run() {
				if (window.innerWidth === self.widthPage) {
					self.changeWidthPage = false;
					self.update();
				} else {
					setTimeout(run);
				}
				self.widthPage = window.innerWidth;
			});
		}
	}



	// Events
	CompareTable.prototype.events = function() {
		let self = this;

		self.showArrows && self.table.on('click', '.tbtn_prev', function(e) {
			e.preventDefault();
			self.updatePositionColumns('prev');
		});

		self.showArrows && self.table.on('click', '.tbtn_next', function(e) {
			e.preventDefault();
			self.updatePositionColumns('next');
		});

		self.pagination && self.table.on('click', '.tpaging button', function(e) {
			e.preventDefault();
			self.changePagination(this);
		});

		self.folding && self.table.on('click', '.tpaging button', function(e) {
			e.preventDefault();
			self.changeFold(this);
		});

		self.responsive && $(window).on('resize', function() {
			self.checkWidthPage();
		});

		self.headerFixed && $(window).on('scroll', function() {
			self.updatePositionHeader();
		});
	}



	$.fn.compareTable = function(options) {
		if (!$(this)[0]) {
			console.warn('No elements for create "Compare Table"');
			return this;
		} else if ($(this).length > 1) {
			console.warn('Use one element for create "Compare Table"');
		}

		const compareTable = new CompareTable(options);
		compareTable.init($(this).eq(0));
		return compareTable;
	}

}(jQuery));