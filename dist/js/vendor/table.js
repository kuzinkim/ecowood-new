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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ2ZW5kb3IvdGFibGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8hIEpRdWVyeSBwbHVnaW4gXCJDb21wYXJlIFRhYmxlXCJcclxuXHJcbjsoZnVuY3Rpb24gKCQpIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0Ly8gT3B0aW9uc1xyXG5cdGZ1bmN0aW9uIENvbXBhcmVUYWJsZShvcHRpb25zKSB7XHJcblx0XHR0aGlzLmluaXRlZCA9IG9wdGlvbnMuaW5pdGVkIHx8IGZhbHNlOyAgICAgICAgICAgICAgICAgICAgICAvLyDvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv71cclxuXHRcdHRoaXMuY29sdW1ucyA9IG9wdGlvbnMuY29sdW1ucyB8fCAxOyAgICAgICAgICAgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv73vv70g77+977+977+977+977+977+977+9IO+/ve+/ve+/ve+/ve+/ve+/ve+/vVxyXG5cdFx0dGhpcy5saW5lcyA9IG9wdGlvbnMubGluZXMgfHwgMTA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g77+977+977+977+977+977+977+977+977+977+977+9IO+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv71cclxuXHRcdHRoaXMuZm9sZGluZyA9IG9wdGlvbnMuZm9sZGluZyB8fCBmYWxzZTsgICAgICAgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv73vv73vv71cclxuXHRcdHRoaXMucGFnaW5hdGlvbiA9IG9wdGlvbnMucGFnaW5hdGlvbiB8fCBmYWxzZTsgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv73vv73vv73vv71cclxuXHRcdHRoaXMuc2hvd0Fycm93cyA9IG9wdGlvbnMuc2hvd0Fycm93cyB8fCB0cnVlOyAgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv73vv71cclxuXHRcdHRoaXMucHJldiA9IG9wdGlvbnMucHJldiB8fCAnPCc7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv71cclxuXHRcdHRoaXMubmV4dCA9IG9wdGlvbnMubmV4dCB8fCAnPic7ICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv71cclxuXHRcdHRoaXMuZHVwbGljYXRlID0gb3B0aW9ucy5kdXBsaWNhdGUgfHwgZmFsc2U7ICAgICAgICAgICAgICAgIC8vIO+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vSDvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv70g77+977+977+977+977+977+977+9XHJcblx0XHR0aGlzLmhlYWRlckZpeGVkID0gb3B0aW9ucy5oZWFkZXJGaXhlZCB8fCBmYWxzZTsgICAgICAgICAgICAvLyDvv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv73vv70g77+977+977+977+977+9IO+/ve+/ve+/ve+/ve+/ve+/ve+/vVxyXG5cdFx0dGhpcy5yZXNwb25zaXZlID0gb3B0aW9ucy5yZXNwb25zaXZlIHx8IGZhbHNlOyAgICAgICAgICAgICAgLy8g77+977+977+977+977+977+977+977+977+977+977+977+9XHJcblx0fVxyXG5cclxuXHQvLyBJbml0aWFsaXphdGlvblxyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKHRhYmxlKSB7XHJcblx0XHRpZiAodGhpcy5pbml0ZWQpIHJldHVybiBmYWxzZTtcclxuXHRcdHRoaXMuaW5pdGVkID0gdHJ1ZTtcclxuXHRcdHRoaXMudGFibGUgPSB0YWJsZTtcclxuXHJcblx0XHR0aGlzLmN1cnJlbnRDb2x1bW4gPSAwO1xyXG5cdFx0dGhpcy5jdXJyZW50UGFnZSA9IDE7XHJcblxyXG5cdFx0dGhpcy5mb2xkZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMucXR5TGluZXMgPSB0aGlzLmxpbmVzO1xyXG5cclxuXHRcdHRoaXMud2lkdGhQYWdlID0gd2luZG93LmlubmVyV2lkdGg7XHJcblx0XHR0aGlzLnNjcm9sbFBhZ2UgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblx0XHR0aGlzLmNoYW5nZVdpZHRoUGFnZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5jaGFuZ2VkU2Nyb2xsUGFnZSA9IGZhbHNlO1xyXG5cdFx0dGhpcy5jdXJyZW50QnJlYWtwb2ludCA9IGZhbHNlO1xyXG5cclxuXHRcdC8vIEFkZCBjb250cm9sc1xyXG5cdFx0bGV0IGh0bWxCdG5QcmV2ID0gJzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJ0YnRuIHRidG5fcHJldiB0YnRuX2luYWN0aXZlXCI+JyArIHRoaXMucHJldiArICc8L2E+JztcclxuXHRcdGxldCBodG1sQnRuTmV4dCA9ICc8YSBocmVmPVwiI1wiIGNsYXNzPVwidGJ0biB0YnRuX25leHRcIj4nICsgdGhpcy5uZXh0ICsgJzwvYT4nO1xyXG5cdFx0dGhpcy5zaG93QXJyb3dzICYmIHRoaXMudGFibGUuZmluZCgnLnRjdHJsJykucHJlcGVuZChodG1sQnRuUHJldikuYXBwZW5kKGh0bWxCdG5OZXh0KTtcclxuXHJcblx0XHQvLyBBZGQgZml4aW5nIGhlYWRlclxyXG5cdFx0dGhpcy5oZWFkZXJGaXhlZCAmJiB0YWJsZS5hZGRDbGFzcygnY29tcGFyZVRhYmxlX2hlYWRGaXgnKTtcclxuXHJcblx0XHQvLyBBZGQgcGFnaW5hdGlvblxyXG5cdFx0dGhpcy5wYWdpbmF0aW9uICYmIHRoaXMuYWRkUGFnaW5hdGlvbigpO1xyXG5cclxuXHRcdC8vIEFkZCBmb2xkaW5nXHJcblx0XHR0aGlzLmZvbGRpbmcgJiYgdGhpcy5hZGRGb2xkaW5nKCk7XHJcblxyXG5cdFx0dGhpcy51cGRhdGUoKVxyXG5cdFx0XHRcdC5ldmVudHMoKTtcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gVXBkYXRpbmdcclxuXHRDb21wYXJlVGFibGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMudXBkYXRlQnJlYWtwb2ludCgpXHJcblx0XHRcdFx0XHRcdFx0IC51cGRhdGVDb2x1bW5zKClcclxuXHRcdFx0XHRcdFx0XHQgLnVwZGF0ZVNpemVDb2x1bW5zKClcclxuXHRcdFx0XHRcdFx0XHQgLnVwZGF0ZVBvc2l0aW9uQ29sdW1ucygpXHJcblx0XHRcdFx0XHRcdFx0IC51cGRhdGVWaXNpYmxlQXJyb3dzKClcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gVXBkYXRpbmcgYnJlYWtwb2ludHNcclxuXHRDb21wYXJlVGFibGUucHJvdG90eXBlLnVwZGF0ZUJyZWFrcG9pbnQgPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCBjdXJyZW50QnJlYWtwb2ludCA9IGZhbHNlO1xyXG5cdFx0bGV0IG5ld1NldHRpbmdzID0ge307XHJcblxyXG5cdFx0aWYgKHRoaXMucmVzcG9uc2l2ZSkge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVzcG9uc2l2ZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdGxldCBlbGVtZW50ID0gdGhpcy5yZXNwb25zaXZlW2ldO1xyXG5cclxuXHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gZWxlbWVudC5icmVha3BvaW50KSB7XHJcblx0XHRcdFx0XHRjdXJyZW50QnJlYWtwb2ludCA9IGVsZW1lbnQuYnJlYWtwb2ludDtcclxuXHRcdFx0XHRcdG5ld1NldHRpbmdzID0gZWxlbWVudC5zZXR0aW5ncztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoY3VycmVudEJyZWFrcG9pbnQgIT09IHRoaXMuY3VycmVudEJyZWFrcG9pbnQpIHtcclxuXHRcdFx0JC5leHRlbmQodGhpcywgbmV3U2V0dGluZ3MpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyBVcGRhdGluZyBjb2x1bW5zXHJcblx0Q29tcGFyZVRhYmxlLnByb3RvdHlwZS51cGRhdGVDb2x1bW5zID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgY2hpbGQgPSAodGhpcy5kdXBsaWNhdGUgPT09ICdvdXQnKSA/ICcqOm5vdCguZHVwSW4pJyA6ICcnO1xyXG5cclxuXHRcdGlmICh0aGlzLmR1cGxpY2F0ZSA9PT0gJ2luJykge1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy5kdXBJbicpLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLmR1cE91dCcpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZHVwbGljYXRlID09PSAnb3V0Jykge1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy5kdXBPdXQnKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy5kdXBJbicpLmFkZENsYXNzKCdoaWRlJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGhpcy5hbGxDb2x1bW5zID0gdGhpcy50YWJsZS5maW5kKCcudHInKS5lcSgwKS5jaGlsZHJlbihjaGlsZCkubGVuZ3RoO1xyXG5cdFx0dGhpcy53b3JrQ29sdW1ucyA9ICh0aGlzLmFsbENvbHVtbnMgPCB0aGlzLmNvbHVtbnMpID8gdGhpcy5hbGxDb2x1bW5zIDogdGhpcy5jb2x1bW5zO1xyXG5cclxuXHRcdHRoaXMudGFibGUuZmluZCgnLnR3JykuY3NzKHsnLXdlYmtpdC1ib3gtZmxleCc6IHRoaXMud29ya0NvbHVtbnMgKiAyLCAnZmxleCc6ICh0aGlzLndvcmtDb2x1bW5zICogMikgKyAnIDAgMCd9KTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUudXBkYXRlU2l6ZUNvbHVtbnMgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLndvcmtDb2x1bW5zIDwgdGhpcy5hbGxDb2x1bW5zKSB7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRyJykuY2hpbGRyZW4oKS5jc3MoJ3dpZHRoJywgKDEwMCAvIHRoaXMud29ya0NvbHVtbnMpICsgJyUnKTtcclxuXHRcdFx0dGhpcy50YWJsZS5maW5kKCcudHInKS5jc3MoJ3dpZHRoJywgdGhpcy5hbGxDb2x1bW5zICogKDEwMCAvIHRoaXMud29ya0NvbHVtbnMpICsgJyUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRyJykuY2hpbGRyZW4oKS5jc3MoJ3dpZHRoJywgKDEwMCAvIHRoaXMuYWxsQ29sdW1ucykgKyAnJScpO1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy50cicpLmNzcygnd2lkdGgnLCAxMDAgKyAnJScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Q29tcGFyZVRhYmxlLnByb3RvdHlwZS51cGRhdGVQb3NpdGlvbkNvbHVtbnMgPSBmdW5jdGlvbih3YXkpIHtcclxuXHRcdGxldCBsZWZ0O1xyXG5cclxuXHRcdGlmICh3YXkgPT09ICdwcmV2JyAmJiB0aGlzLmN1cnJlbnRDb2x1bW4gPiAwKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudENvbHVtbi0tO1xyXG5cdFx0fSBlbHNlIGlmICh3YXkgPT09ICduZXh0JyAmJiB0aGlzLmN1cnJlbnRDb2x1bW4gPCAodGhpcy5hbGxDb2x1bW5zIC0gdGhpcy53b3JrQ29sdW1ucykpIHtcclxuXHRcdFx0dGhpcy5jdXJyZW50Q29sdW1uKys7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuY3VycmVudENvbHVtbiA+ICh0aGlzLmFsbENvbHVtbnMgLSB0aGlzLndvcmtDb2x1bW5zKSkge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRDb2x1bW4gPSAodGhpcy5hbGxDb2x1bW5zIC0gdGhpcy53b3JrQ29sdW1ucyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMud29ya0NvbHVtbnMgPCB0aGlzLmFsbENvbHVtbnMpIHtcclxuXHRcdFx0bGVmdCA9IC0oMTAwIC8gdGhpcy53b3JrQ29sdW1ucykgKiB0aGlzLmN1cnJlbnRDb2x1bW47XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRDb2x1bW4gPSAwO1xyXG5cdFx0XHRsZWZ0ID0gMDtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnRhYmxlLmZpbmQoJy50cicpLmNzcygnbGVmdCcsIGxlZnQgKyAnJScpO1xyXG5cdFx0dGhpcy50YWJsZS5maW5kKCcudGJ0bl9wcmV2JykucmVtb3ZlQ2xhc3MoJ3RidG5faW5hY3RpdmUnKTtcclxuXHRcdHRoaXMudGFibGUuZmluZCgnLnRidG5fbmV4dCcpLnJlbW92ZUNsYXNzKCd0YnRuX2luYWN0aXZlJyk7XHJcblxyXG5cdFx0aWYgKHRoaXMuY3VycmVudENvbHVtbiA9PT0gMCkge1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy50YnRuX3ByZXYnKS5hZGRDbGFzcygndGJ0bl9pbmFjdGl2ZScpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmN1cnJlbnRDb2x1bW4gPT09ICh0aGlzLmFsbENvbHVtbnMgLSB0aGlzLndvcmtDb2x1bW5zKSkge1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy50YnRuX25leHQnKS5hZGRDbGFzcygndGJ0bl9pbmFjdGl2ZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyBVcGRhdGluZyBhcnJvd3NcclxuXHRDb21wYXJlVGFibGUucHJvdG90eXBlLnVwZGF0ZVZpc2libGVBcnJvd3MgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLndvcmtDb2x1bW5zID49IHRoaXMuYWxsQ29sdW1ucyB8fCAhdGhpcy5zaG93QXJyb3dzKSB7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRidG5fcHJldicpLmZhZGVPdXQoMjAwKTtcclxuXHRcdFx0dGhpcy50YWJsZS5maW5kKCcudGJ0bl9uZXh0JykuZmFkZU91dCgyMDApO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLnNob3dBcnJvd3MpIHtcclxuXHRcdFx0dGhpcy50YWJsZS5maW5kKCcudGJ0bl9wcmV2JykuZmFkZUluKDIwMCk7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRidG5fbmV4dCcpLmZhZGVJbigyMDApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyBVcGRhdGluZyBoZWFkZXJcclxuXHRDb21wYXJlVGFibGUucHJvdG90eXBlLnVwZGF0ZVBvc2l0aW9uSGVhZGVyID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgaGVpZ2h0SGVhZGVyID0gd2luZG93LmlubmVyV2lkdGggPCA5OTIgPyAkKCcuaGVhZGVyX2JvdHRvbScpLmlubmVySGVpZ2h0KCkgOiAwO1xyXG5cdFx0bGV0IHNjcm9sbFBhZ2UgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgKyBoZWlnaHRIZWFkZXI7XHJcblx0XHRsZXQgaGVpZ2h0UGFnZSA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuXHRcdGxldCBoZWlnaHRUYWJsZSA9IHRoaXMudGFibGUuaW5uZXJIZWlnaHQoKTtcclxuXHRcdGxldCB0b3BUYWJsZSA9IHRoaXMudGFibGUub2Zmc2V0KCkudG9wO1xyXG5cdFx0bGV0IGhlaWdodEhlYWQgPSB0aGlzLnRhYmxlLmZpbmQoJy50aGVhZCcpLmlubmVySGVpZ2h0KCk7XHJcblx0XHRsZXQgdG9wSGVhZCA9IHNjcm9sbFBhZ2UgLSB0b3BUYWJsZSAtIDEwO1xyXG5cdFx0bGV0IG1heFRvcEhlYWQgPSBoZWlnaHRUYWJsZSAtIGhlaWdodEhlYWQgLSBoZWlnaHRQYWdlICogMC4zO1xyXG5cclxuXHRcdGlmICh0b3BIZWFkID4gbWF4VG9wSGVhZCAmJiBtYXhUb3BIZWFkID4gMCkge1xyXG5cdFx0XHR0aGlzLnRhYmxlLmZpbmQoJy50aGVhZCcpLmNzcygndG9wJywgbWF4VG9wSGVhZCk7XHJcblx0XHR9IGVsc2UgaWYgKHRvcEhlYWQgPiAwKSB7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRoZWFkJykuY3NzKCd0b3AnLCB0b3BIZWFkKTtcclxuXHRcdH0gZWxzZSBpZiAodG9wSGVhZCA8PSAwKSB7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRoZWFkJykuY3NzKCd0b3AnLCAwKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cclxuXHJcblx0Ly8gUGFnaW5hdG9uXHJcblx0Q29tcGFyZVRhYmxlLnByb3RvdHlwZS5hZGRQYWdpbmF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgcXR5UGFnZXMgPSBNYXRoLmNlaWwodGhpcy50YWJsZS5maW5kKCcudGxpbmUnKS5sZW5ndGggLyB0aGlzLmxpbmVzKTtcclxuXHRcdGxldCBwYWdpbmF0aW9uID0gdGhpcy50YWJsZS5maW5kKCcudHBhZ2luZycpO1xyXG5cdFx0bGV0IGh0bWxQYWdpbmF0aW9uID0gJyc7XHJcblx0XHRsZXQgaHRtbFBhZ2VzID0gJyc7XHJcblxyXG5cdFx0aWYgKHF0eVBhZ2VzIDwgMikge1xyXG5cdFx0XHRwYWdpbmF0aW9uLnJlbW92ZSgpO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWdlID0gMTtcclxuXHRcdFx0dGhpcy5xdHlMaW5lcyA9IHRoaXMubGluZXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMTsgaSA8PSBxdHlQYWdlczsgaSsrKSB7XHJcblx0XHRcdFx0aHRtbFBhZ2VzICs9ICc8YnV0dG9uIGNsYXNzPVwidHBhZ2luZ19fcGFnZSBidXR0b24gYnV0dG9uX3BhZ2VcIiBkYXRhLXZhbHVlPVwiJytpKydcIj48c3Bhbj4nK2krJzwvc3Bhbj48L2J1dHRvbj4nO1xyXG5cclxuXHRcdFx0XHRpZiAocXR5UGFnZXMgPiA2ICYmIChpID09PSAxIHx8IGkgPT09IChxdHlQYWdlcyAtIDEpKSkge1xyXG5cdFx0XHRcdFx0aHRtbFBhZ2VzICs9ICc8c3BhbiBjbGFzcz1cInRwYWdpbmdfX2RvdHNcIj4uLi48L3NwYW4+JztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChwYWdpbmF0aW9uWzBdKSB7XHJcblx0XHRcdFx0dGhpcy50YWJsZS5maW5kKCcudHBhZ2luZ19fcGFnZXMnKS5odG1sKGh0bWxQYWdlcyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aHRtbFBhZ2luYXRpb24gKz0gJzxkaXYgY2xhc3M9XCJ0cGFnaW5nXCI+PGJ1dHRvbiBjbGFzcz1cInRwYWdpbmdfX21vcmUgYnV0dG9uIGJ1dHRvbl9tb3JlXCIgZGF0YS12YWx1ZT1cIm1vcmVcIj48c3Bhbj7vv73vv73vv73vv73vv73vv73vv73vv70g77+977+977+9PC9zcGFuPjxzdmcgd2lkdGg9XCIyMFwiIGhlaWdodD1cIjIwXCI+PHVzZSB4bGluazpocmVmPVwiL3VwbG9hZC9pbWFnZXMvc3ByaXRlLnN2ZyNhcnJvd1wiPjwvdXNlPjwvc3ZnPjwvYnV0dG9uPjxkaXYgY2xhc3M9XCJ0cGFnaW5nX19wYWdlc1wiPicgKyBodG1sUGFnZXMgKyAnPC9kaXY+PC9kaXY+JztcclxuXHRcdFx0XHR0aGlzLnRhYmxlLmFwcGVuZChodG1sUGFnaW5hdGlvbik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmFwcGx5UGFnaW5hdGlvbigpXHJcblx0XHRcdFx0LnVwZGF0ZVBhZ2luYXRpb24oKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUuY2hhbmdlUGFnaW5hdGlvbiA9IGZ1bmN0aW9uKGxpbmspIHtcclxuXHRcdGxldCAkbGluayA9ICQobGluayk7XHJcblx0XHRsZXQgbGlua1ZhbHVlID0gJGxpbmsuYXR0cignZGF0YS12YWx1ZScpO1xyXG5cclxuXHRcdGlmICgkbGluay5oYXNDbGFzcygnYWN0aXZlJykpIHJldHVybiB0aGlzO1xyXG5cclxuXHRcdGlmIChsaW5rVmFsdWUgPT09ICdtb3JlJykge1xyXG5cdFx0XHR0aGlzLnF0eUxpbmVzID0gdGhpcy5xdHlMaW5lcyArIHRoaXMubGluZXM7XHJcblx0XHRcdHRoaXMuY3VycmVudFBhZ2UrKztcclxuXHRcdH0gZWxzZSBpZiAobGlua1ZhbHVlID09PSAnbmV4dCcpIHtcclxuXHRcdFx0dGhpcy5xdHlMaW5lcyA9IHRoaXMubGluZXM7XHJcblx0XHRcdHRoaXMuY3VycmVudFBhZ2UrKztcclxuXHRcdH0gZWxzZSBpZiAobGlua1ZhbHVlID09PSAncHJldicpIHtcclxuXHRcdFx0dGhpcy5xdHlMaW5lcyA9IHRoaXMubGluZXM7XHJcblx0XHRcdHRoaXMuY3VycmVudFBhZ2UtLTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMucXR5TGluZXMgPSB0aGlzLmxpbmVzO1xyXG5cdFx0XHR0aGlzLmN1cnJlbnRQYWdlID0gK2xpbmtWYWx1ZTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLmFwcGx5UGFnaW5hdGlvbigpXHJcblx0XHRcdFx0LnVwZGF0ZVBhZ2luYXRpb24oKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUuYXBwbHlQYWdpbmF0aW9uID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgbGluZXMgPSB0aGlzLnRhYmxlLmZpbmQoJy50bGluZScpO1xyXG5cdFx0bGV0IGxhc3RMaW5lID0gdGhpcy5jdXJyZW50UGFnZSAqIHRoaXMubGluZXM7XHJcblx0XHRsZXQgZmlyc3RMaW5lID0gbGFzdExpbmUgLSB0aGlzLmxpbmVzO1xyXG5cclxuXHRcdGlmICh0aGlzLnF0eUxpbmVzICE9PSB0aGlzLmxpbmVzKSB7XHJcblx0XHRcdGZpcnN0TGluZSA9IGxhc3RMaW5lIC0gdGhpcy5xdHlMaW5lcztcclxuXHRcdH1cclxuXHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGxpbmUgPSAkKGxpbmVzW2ldKTtcclxuXHJcblx0XHRcdGlmIChpID49IGZpcnN0TGluZSAmJiBpIDwgbGFzdExpbmUpIHtcclxuXHRcdFx0XHRsaW5lLnJlbW92ZUNsYXNzKCdoaWRlJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0bGluZS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRDb21wYXJlVGFibGUucHJvdG90eXBlLnVwZGF0ZVBhZ2luYXRpb24gPSBmdW5jdGlvbigpIHtcclxuXHRcdGxldCBxdHlQYWdlcyA9IE1hdGguY2VpbCh0aGlzLnRhYmxlLmZpbmQoJy50bGluZScpLmxlbmd0aCAvIHRoaXMubGluZXMpO1xyXG5cdFx0bGV0IHdyYXBQYWdlcyA9IHRoaXMudGFibGUuZmluZCgnLnRwYWdpbmdfX3BhZ2VzJyk7XHJcblx0XHRsZXQgYnRuTW9yZSA9IHRoaXMudGFibGUuZmluZCgnLnRwYWdpbmdfX21vcmUnKTtcclxuXHRcdGxldCBwYWdlcyA9IHRoaXMudGFibGUuZmluZCgnLnRwYWdpbmdfX3BhZ2UnKTtcclxuXHRcdGxldCBkb3RzID0gdGhpcy50YWJsZS5maW5kKCcudHBhZ2luZ19fZG90cycpO1xyXG5cdFx0bGV0IHBhZ2UgPSB0aGlzLmN1cnJlbnRQYWdlO1xyXG5cclxuXHRcdHdyYXBQYWdlcy5maW5kKCdidXR0b24uYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0d3JhcFBhZ2VzLmZpbmQoJ2J1dHRvbltkYXRhLXZhbHVlPVwiJytwYWdlKydcIl0nKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0aWYgKHF0eVBhZ2VzID09PSBwYWdlKSB7XHJcblx0XHRcdGJ0bk1vcmUuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGJ0bk1vcmUucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocGFnZSA+IDMpIHtcclxuXHRcdFx0ZG90cy5lcSgwKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZG90cy5lcSgwKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChwYWdlIDwgcXR5UGFnZXMgLSAyKSB7XHJcblx0XHRcdGRvdHMuZXEoMSkucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvdHMuZXEoMSkuYWRkQ2xhc3MoJ2hpZGUnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAocXR5UGFnZXMgPiA2KSB7XHJcblx0XHRcdGZvciAobGV0IGkgPSAxOyBpIDwgcXR5UGFnZXMtMTsgaSsrKSB7XHJcblx0XHRcdFx0aWYgKGkgPiBwYWdlIHx8IGkgPCAocGFnZSAtIDIpKSB7XHJcblx0XHRcdFx0XHRwYWdlcy5lcShpKS5hZGRDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRwYWdlcy5lcShpKS5yZW1vdmVDbGFzcygnaGlkZScpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblxyXG5cclxuXHQvLyBGb2xkaW5nXHJcblx0Q29tcGFyZVRhYmxlLnByb3RvdHlwZS5hZGRGb2xkaW5nID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgYWxsTGluZXMgPSB0aGlzLnRhYmxlLmZpbmQoJy50aGVhZCwgLnRsaW5lJykubGVuZ3RoO1xyXG5cdFx0bGV0IHBhZ2luYXRpb24gPSB0aGlzLnRhYmxlLmZpbmQoJy50cGFnaW5nJyk7XHJcblx0XHRsZXQgaHRtbENvbnRyb2xGb2xkaW5nID0gJzxkaXYgY2xhc3M9XCJ0cGFnaW5nIHRwYWdpbmdfZm9sZFwiPjxidXR0b24gY2xhc3M9XCJ0cGFnaW5nX19mb2xkIGZvbGRlZFwiIGRhdGEtdmFsdWU9XCJtb3JlXCI+PHNwYW4+77+977+977+977+977+977+977+977+977+977+9PC9zcGFuPjxzcGFuPu+/ve+/ve+/ve+/ve+/ve+/ve+/ve+/vTwvc3Bhbj48c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiPjx1c2UgeGxpbms6aHJlZj1cIi91cGxvYWQvaW1hZ2VzL3Nwcml0ZS5zdmcjYXJyb3dcIj48L3VzZT48L3N2Zz48L2J1dHRvbj48L2Rpdj4nO1xyXG5cclxuXHRcdGlmIChhbGxMaW5lcyA8PSB0aGlzLmxpbmVzKSB7XHJcblx0XHRcdHBhZ2luYXRpb24ucmVtb3ZlKCk7XHJcblx0XHRcdHRoaXMuZm9sZGVkID0gZmFsc2U7XHJcblx0XHRcdHRoaXMudGFibGUucmVtb3ZlQ2xhc3MoJ2ZvbGRhYmxlIGZvbGRlZCcpO1xyXG5cdFx0fSBlbHNlIGlmICghcGFnaW5hdGlvblswXSkge1xyXG5cdFx0XHR0aGlzLmZvbGRlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMudGFibGUuYWRkQ2xhc3MoJ2ZvbGRhYmxlIGZvbGRlZCcpLmFwcGVuZChodG1sQ29udHJvbEZvbGRpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlRm9sZGluZygpO1xyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0Q29tcGFyZVRhYmxlLnByb3RvdHlwZS5jaGFuZ2VGb2xkID0gZnVuY3Rpb24oYnRuKSB7XHJcblx0XHRpZiAodGhpcy5mb2xkZWQpIHtcclxuXHRcdFx0dGhpcy5mb2xkZWQgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy50YWJsZS5yZW1vdmVDbGFzcygnZm9sZGVkJyk7XHJcblx0XHRcdCQoYnRuKS5yZW1vdmVDbGFzcygnZm9sZGVkJyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmZvbGRlZCA9IHRydWU7XHJcblx0XHRcdHRoaXMudGFibGUuYWRkQ2xhc3MoJ2ZvbGRlZCcpO1xyXG5cdFx0XHQkKGJ0bikuYWRkQ2xhc3MoJ2ZvbGRlZCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMudXBkYXRlRm9sZGluZyh0cnVlKTtcclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUudXBkYXRlRm9sZGluZyA9IGZ1bmN0aW9uKGFuaW1hdGUpIHtcclxuXHRcdGxldCBsaW5lcyA9IHRoaXMudGFibGUuZmluZCgnLnRoZWFkLCAudGxpbmUnKTtcclxuXHRcdGxldCB0aW1lID0gYW5pbWF0ZSA/IDIwMCA6IDA7XHJcblxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRjb25zdCBsaW5lID0gbGluZXMuZXEoaSk7XHJcblxyXG5cdFx0XHRpZiAoaSA+PSB0aGlzLmxpbmVzICYmIHRoaXMuZm9sZGVkKSB7XHJcblx0XHRcdFx0bGluZS5hZGRDbGFzcygnZm9sZGVkJykuc2xpZGVVcCh0aW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRsaW5lLnJlbW92ZUNsYXNzKCdmb2xkZWQnKS5zbGlkZURvd24odGltZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9XHJcblxyXG5cdC8vIEFkZGluZyBsaW5lc1xyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUuYWRkTGluZSA9IGZ1bmN0aW9uKGVsZW1lbnQpIHtcclxuXHRcdGlmICh0aGlzLnBhZ2luYXRpb24gJiYgdGhpcy50YWJsZS5maW5kKCcudHBhZ2luZycpWzBdKSB7XHJcblx0XHRcdHRoaXMudGFibGUuZmluZCgnLnRwYWdpbmcnKS5iZWZvcmUoJChlbGVtZW50KSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnRhYmxlLmFwcGVuZCgkKGVsZW1lbnQpKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLnBhZ2luYXRpb24gJiYgdGhpcy5hZGRQYWdpbmF0aW9uKCk7XHJcblx0XHR0aGlzLmZvbGRpbmcgJiYgdGhpcy5hZGRGb2xkaW5nKCk7XHJcblxyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vIFVwZGF0aW5nIHBhZ2VcclxuXHRDb21wYXJlVGFibGUucHJvdG90eXBlLmNoZWNrV2lkdGhQYWdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoIXRoaXMuY2hhbmdlV2lkdGhQYWdlKSB7XHJcblx0XHRcdHRoaXMuY2hhbmdlV2lkdGhQYWdlID0gdHJ1ZTtcclxuXHRcdFx0bGV0IHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbiBydW4oKSB7XHJcblx0XHRcdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID09PSBzZWxmLndpZHRoUGFnZSkge1xyXG5cdFx0XHRcdFx0c2VsZi5jaGFuZ2VXaWR0aFBhZ2UgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHNlbGYudXBkYXRlKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNldFRpbWVvdXQocnVuKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2VsZi53aWR0aFBhZ2UgPSB3aW5kb3cuaW5uZXJXaWR0aDtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdC8vIEV2ZW50c1xyXG5cdENvbXBhcmVUYWJsZS5wcm90b3R5cGUuZXZlbnRzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRsZXQgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5zaG93QXJyb3dzICYmIHNlbGYudGFibGUub24oJ2NsaWNrJywgJy50YnRuX3ByZXYnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0c2VsZi51cGRhdGVQb3NpdGlvbkNvbHVtbnMoJ3ByZXYnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuc2hvd0Fycm93cyAmJiBzZWxmLnRhYmxlLm9uKCdjbGljaycsICcudGJ0bl9uZXh0JywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHNlbGYudXBkYXRlUG9zaXRpb25Db2x1bW5zKCduZXh0Jyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRzZWxmLnBhZ2luYXRpb24gJiYgc2VsZi50YWJsZS5vbignY2xpY2snLCAnLnRwYWdpbmcgYnV0dG9uJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdHNlbGYuY2hhbmdlUGFnaW5hdGlvbih0aGlzKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuZm9sZGluZyAmJiBzZWxmLnRhYmxlLm9uKCdjbGljaycsICcudHBhZ2luZyBidXR0b24nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0c2VsZi5jaGFuZ2VGb2xkKHRoaXMpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0c2VsZi5yZXNwb25zaXZlICYmICQod2luZG93KS5vbigncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdHNlbGYuY2hlY2tXaWR0aFBhZ2UoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNlbGYuaGVhZGVyRml4ZWQgJiYgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VsZi51cGRhdGVQb3NpdGlvbkhlYWRlcigpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblxyXG5cdCQuZm4uY29tcGFyZVRhYmxlID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0aWYgKCEkKHRoaXMpWzBdKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybignTm8gZWxlbWVudHMgZm9yIGNyZWF0ZSBcIkNvbXBhcmUgVGFibGVcIicpO1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0gZWxzZSBpZiAoJCh0aGlzKS5sZW5ndGggPiAxKSB7XHJcblx0XHRcdGNvbnNvbGUud2FybignVXNlIG9uZSBlbGVtZW50IGZvciBjcmVhdGUgXCJDb21wYXJlIFRhYmxlXCInKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zdCBjb21wYXJlVGFibGUgPSBuZXcgQ29tcGFyZVRhYmxlKG9wdGlvbnMpO1xyXG5cdFx0Y29tcGFyZVRhYmxlLmluaXQoJCh0aGlzKS5lcSgwKSk7XHJcblx0XHRyZXR1cm4gY29tcGFyZVRhYmxlO1xyXG5cdH1cclxuXHJcbn0oalF1ZXJ5KSk7Il0sImZpbGUiOiJ2ZW5kb3IvdGFibGUuanMifQ==
