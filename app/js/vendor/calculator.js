// init finance table
function initFinanceTable(items) {
	let $items = $(items);
	if (!$items[0]) return false;

	const responsive = [
		{
			breakpoint: 0,
			settings: {
				columns: 1,
			}
		},
		{
			breakpoint: 480,
			settings: {
				columns: 2,
			}
		},
		{
			breakpoint: 768,
			settings: {
				columns: 3,
			}
		},
	];
}


// help functions finance calculator
function getNumber(value) {
	value = String(value).split('').filter(function(number) {
		return !!number.match(/^\d+$/);
	}).join('');
	return value;
}

function getFloat(value) {
	value = String(value).replace(/[^.\d]+/g,"");
	return value;
}

function getValueInt(value, simbol) {
	if (value === '') return '';

	let number = +value;
	let arr = number.toFixed(0).split('');
	let length = arr.length;
	let newArr = [];
	simbol = simbol || '';

	for (let i = length - 4; i >= 0; i=(i-3)) {
		newArr.push(i);
	}

	number = arr.map(function(item, index, array) {
		if (newArr.includes(index)) {
			item = item + ' ';
		}
		if (index === length - 1) {
			item = item + '' + simbol;
		}
		return item;
	}).join('');

	return number;
}

function postfixYear(val) {
	var postfix = ' лет';
	if (val === '1') {
		postfix = ' год';
	} else if (val === '2' || val === '3' || val === '4') {
		postfix = ' года';
	}
	return postfix;
}

function postfixMounth(val) {
	var postfix = ' месяцев';
	if (val === '1') {
		postfix = ' месяц';
	} else if (val === '2' || val === '3' || val === '4') {
		postfix = ' месяца';
	}
	return postfix;
}

function priceRuble(val, isDecode) {
	if (isDecode) {
		if (val.indexOf('млн.') > -1) {
			val = val.replace(/\D+/g,"") * 1000000;
		} else if (val.indexOf('тыс.') > -1) {
			val = val.replace(/\D+/g,"") * 1000;
		}
	} else {
		if (+val >= 1000000) {
			val = Math.round(+val / 1000000) + ' млн.'
		} else if (+val >= 1000) {
			val = Math.round(+val / 1000) + ' тыс.'
		}
	}
	return val;
}

function inputFocus(item) {
	item.on('focus', function(){
		const arrValue = $(this).val().split('/');
		const value = +getFloat(arrValue[1] || arrValue[0]);
		$(this).val(value);
	});
}

function inputBlur(item, slider) {
	item.on('blur', function(){
		const arrValue = $(this).val().split('/');
		const value = +getFloat(arrValue[1] || arrValue[0]);
		slider.noUiSlider.set(value);
	});
}

function inputChange(item, slider) {
	item.on('change', function(){
		const arrValue = $(this).val().split('/');
		const value = +getFloat(arrValue[1] || arrValue[0]);
		slider.noUiSlider.set(value);
	});
}

function rangeClick(item, slider) {
	item.on('click', '.noUi-value-large', function(){
		slider.noUiSlider.set(getNumber(priceRuble($(this).text(), true)));
	});
}

function checkInstallment(value) {
	if (+value === 1) {
		$('input[name="installment"]').prop('disabled', false);
	} else {
		$('input[name="installment"]').prop('disabled', true).prop('checked', false);
	}
}

// init finance calculator
function initFinanceCalculator() {
	if (!$('.js-finance-calculator')[0]) return false;

	let rangeSum = $('.js-range-values[data-leasing-select="sum"]');
	let rangeTime = $('.js-range-values[data-leasing-select="time-finance"]');
	let rangePrepayment = $('.js-range-values[data-leasing-select="prepayment"]');

	let inputSum = rangeSum.find('input');
	let inputTime = rangeTime.find('input');
	let inputPrepayment = rangePrepayment.find('input');

	let sliderSum = rangeSum.find('.js-range-values-selection')[0];
	let sliderTime = rangeTime.find('.js-range-values-selection')[0];
	let sliderPrepayment = rangePrepayment.find('.js-range-values-selection')[0];

	const prepaymentFormat = wNumb({
		decimals: 2,
		postfix: ' %'
	});

	noUiSlider.create(sliderSum, {
		start: getNumber(inputSum.val()),
		step: 1000,
		connect: [true, false],
		range: {
			'min': 270000,
			'max': 30000000
		},
		pips: {
			mode: 'values',
			values: [270000,30000000],
			format: {
				to: function (value) {
					return getValueInt(value, ' Р');
				}
			}
		},
		format: wNumb({
			decimals: 0,
			thousand: ' ',
			postfix: ' Р'
		})
	});

	noUiSlider.create(sliderTime, {
		start: 1,
		step: 1,
		connect: [true, false],
		range: {
			'min': 12,
			'max': 60
		},
		pips: {
			mode: 'values',
			values: [12,60],
			format: {
				to: function (value) {
					return value + postfixMounth(value);
				}
			}
		},
		format: wNumb({
			decimals: 0
		})
	});

	noUiSlider.create(sliderPrepayment, {
		start: 0,
		step: 0.5,
		connect: [true, false],
		range: {
			'min': 0,
			'max': 49
		},
		pips: {
			mode: 'values',
			values: [0,49],
			format: wNumb({
				postfix: ' %'
			})
		},
		format: {
			to: function (value) {
				return prepaymentFormat.to(value);
			},
			from: function (value) {
				return prepaymentFormat.from(value);
			}
		}
	});

	sliderSum.noUiSlider.on('update', function( values, handle ) {
		inputSum.val(values[handle]);
		inputPrepayment.trigger('change');
	});

	sliderTime.noUiSlider.on('update', function( values, handle ) {
		inputTime.val(values[handle] + postfixMounth(values[handle]));
		checkInstallment(values[handle]);
	});

	sliderPrepayment.noUiSlider.on('update', function( values, handle ) {
		const arrValue = values[handle].split('/');
		const value = +getFloat(arrValue[1] || arrValue[0]);
		const sum = +getNumber($('.js-finance-calculator input[name="finance-calc-sum"]').val()) * +getFloat(value) / 100;
		const result = getValueInt(sum, ' Р') + ' / ' + prepaymentFormat.to(value);
		inputPrepayment.val(result);
	});

	inputFocus(inputSum);
	inputFocus(inputTime);
	inputFocus(inputPrepayment);

	inputBlur(inputSum, sliderSum);
	inputBlur(inputTime, sliderTime);
	inputBlur(inputPrepayment, sliderPrepayment);

	inputChange(inputSum, sliderSum);
	inputChange(inputTime, sliderTime);
	inputChange(inputPrepayment, sliderPrepayment);

	rangeClick(rangeSum, sliderSum);
	rangeClick(rangeTime, sliderTime);
	rangeClick(rangePrepayment, sliderPrepayment);
}



// count functions
function countLinearDepreciation(sum, time) {
	let percentLD = 120 / 12;
	let valueLD = sum * percentLD / 100 / 12 / 1.2;

	return valueLD.toFixed(1) * time;
}

function countPMT(ratePerPeriod, numberOfPayments, presentValue, futureValue, type) {
	futureValue = typeof futureValue !== 'undefined' ? futureValue : 0;
	type = typeof type !== 'undefined' ? type : 0;
	if (ratePerPeriod != 0.0) {
		var q = Math.pow(1 + ratePerPeriod, numberOfPayments);
		return -(ratePerPeriod * (futureValue + (q * presentValue))) / ((-1 + q) * (1 + ratePerPeriod * (type)));
	} else if (numberOfPayments != 0.0) {
		return -(futureValue + presentValue) / numberOfPayments;
	}
	return 0;
}

function countPaymentLeasing(sum, prepaid, time, percent) {
	let percentMonth = percent / 100 / 12;
	return (sum - prepaid) * (percentMonth + percentMonth / (Math.pow(1 + percentMonth, time) - 1));
}

function countPaymentCredit(sum, prepaid, time, percent) {
	let ratePercent = percent / 12 / 100;
	let loan = sum - prepaid;

	return -countPMT(ratePercent, time, loan);
}

// calculation and getting tax
function getTaxRefund(value, tax) {
	if (tax === 20) {
		// return -1 * (value * 20 / 120);
		return value * 20 / 120;
	} else {
		return 0;
	}
}

function getTaxCutsLeasing(overpaymentCredit, expenses, time, tax) {
	if (tax === 20) {
		// return -1 * (expenses / 1.2) * 0.2;
		return (expenses / 1.2) * 0.2;
	} else if (tax === 15) {
		// return -1 * ((expenses / 1.2) + overpaymentCredit) * 0.15;
		return ((expenses / 1.2) + overpaymentCredit) * 0.15;
	} else {
		return 0;
	}
}

function getTaxCutsCredit(sum, expenses, time, tax) {
	let ld = countLinearDepreciation(sum, time);
	let overpayment = expenses - sum;

	if (tax === 20) {
		// return -1 * (overpayment + ld) * 0.2;
		return (overpayment + ld) * 0.2;
	} else if (tax === 15) {
		// return -1 * (overpayment + ld) * 0.15;
		return (overpayment + ld) * 0.15;
	} else {
		return 0;
	}
}

function getTaxCutsMoney(sum, expenses, time, tax) {
	let ld = countLinearDepreciation(sum, time);

	if (tax === 20) {
		// return -1 * ld * 0.2;
		return ld * 0.2;
	} else if (tax === 15) {
		// return -1 * ld * 0.15;
		return ld * 0.15;
	} else {
		return 0;
	}
}

// getting mount list for graph payments
function getMonthList(qtyMounth) {
	let arrMounth = [];
	let mounths = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
	let today = new Date();
	let currentMounth = today.getMonth();
	let currentYear = today.getFullYear();

	for (let i = 0; i < qtyMounth; i++) {
		if (currentMounth === 0 && i > 0) {
			currentYear++;
		}

		let data = mounths[currentMounth] + ' ' + currentYear;

		arrMounth.push(data);

		currentMounth++;
		currentMounth = currentMounth === 12 ? 0 : currentMounth;
	}

	return arrMounth;
}

// view percent
function viewPercent(val, fix) {
	fix = fix || 0;
	return new String(val.toFixed(fix)).replace(".",",") + ' %';
}

// creat line for graph payments
function createLineGrapf(number, name, value, isResult) {
	value = $.trim(value) === '' ? value : value.toFixed(0);
	value = getValueInt(value);

	let info = '<div class="financeCalculator__infoPopup infoPopup infoPopup_product js-info-popup initialized"><button class="infoPopup__link infoPopup__link_product js-info-popup-link"><svg width="18" height="18"><use xlink:href="/lizing/sprite.svg#info"></use></svg></button><div class="infoPopup__inside infoPopup__inside_prod js-info-popup-inside initialized"><button class="infoPopup__close js-info-popup-close"><svg width="16" height="16"><use xlink:href="/lizing/sprite.svg#cross"></use></svg></button><div class="infoPopup__results infoPopup__results_course"><div class="infoPopup__lineResult">Общая сумма платежей, в т.ч. аванс и переплата.</div></div></div></div>';

	if (isResult) value = value + ' ' + info;

	number = number ? '<div class="tcell">'+number+'</div>' : '';

	return '<div class="tline">' +
						'<div class="td td_empty"></div>' +
						'<div class="td td_small">'+number+'</div>' +
						'<div class="td">' +
							'<div class="tcell">'+name+'</div>' +
						'</div>' +
						'<div class="td">' +
							'<div class="tcell">'+value+'</div>' +
						'</div>' +
						'<div class="td td_empty"></div>' +
					'</div>';
}



// standart calculation
function standartCount(sum, time, prepaidPercent, taxRegime, calculatorType) {
	const percentRate = {
		leasing: 16,
		credit: calculatorType === 'individual' ? 24 : 13.5
	}

	let countPrepaid = {
		leasing: sum / 100 * prepaidPercent,
		credit: sum / 100 * prepaidPercent,
		money: sum,
	};

	let countPayment = {
		leasing: countPaymentLeasing(sum, countPrepaid.leasing, time, percentRate.leasing),
		credit: countPaymentCredit(sum, countPrepaid.credit, time, percentRate.credit),
	};

	let countResultExpenses = {
		leasing: countPrepaid.leasing + (countPayment.leasing * time),
		credit: countPrepaid.credit + (countPayment.credit * time),
		money: countPrepaid.money
	};

	let countOverpayment = {
		leasing: countResultExpenses.leasing - sum,
		credit: countResultExpenses.credit - sum,
	}

	let taxRefund = {
		leasing: getTaxRefund(countResultExpenses.leasing, taxRegime),
		credit: getTaxRefund(sum, taxRegime),
		money: getTaxRefund(sum, taxRegime)
	};

	let taxCuts = {
		leasing: getTaxCutsLeasing(countResultExpenses.credit - sum, countResultExpenses.leasing, time, taxRegime),
		credit: getTaxCutsCredit(sum, countResultExpenses.credit, time, taxRegime),
		money: getTaxCutsMoney(sum, countResultExpenses.money, time, taxRegime)
	};

	let resultTax = {
		leasing: taxRefund.leasing + taxCuts.leasing,
		credit: taxRefund.credit + taxCuts.credit,
		money: taxRefund.money + taxCuts.money
	};

	let financeResult = {
		leasing: countResultExpenses.leasing - resultTax.leasing,
		credit: countResultExpenses.credit - resultTax.credit,
		money: countResultExpenses.money - resultTax.money
	};

	let saving = {
		leasing: countResultExpenses.leasing - financeResult.leasing,
		credit: countResultExpenses.credit - financeResult.credit,
		money: countResultExpenses.money - financeResult.money
	};

	let savingPercent = {
		leasing: viewPercent((1 - 1 / (countResultExpenses.leasing / financeResult.leasing)) * 100),
		credit: viewPercent((1 - 1 / (countResultExpenses.credit / financeResult.credit)) * 100),
		money: viewPercent((1 - 1 / (countResultExpenses.money / financeResult.money)) * 100)
	};

	let rate = {
		leasing: viewPercent((countResultExpenses.leasing - sum) / sum / (time / 12) * 100, 1),
		credit: viewPercent(percentRate.credit, 1),
		money: viewPercent(0, 1)
	}

	// results for graph
	let payments = [];
	let prepaid = sum / 100 * prepaidPercent;
	let total = '-';

	if (calculatorType === 'individual') {
		total = prepaid + countPayment.credit * time;
	} else {
		total = prepaid + countPayment.leasing * time;
	}

	for (let i = 1; i <= time; i++) {
		if (calculatorType === 'individual') {
			payments.push(countPayment.credit);
		} else {
			payments.push(countPayment.leasing);
		}
	}

	return {
		payment: countPayment,
		rate: rate,

		// tax data
		taxRefund: taxRefund,
		taxCuts: taxCuts,
		resultTax: resultTax,

		// expenses and overpayment data
		resultExpenses: countResultExpenses,
		overpayment: countOverpayment,

		// total data
		financeResult: financeResult,
		saving: saving,
		savingPercent: savingPercent,

		// results for graph
		time: time,
		prepaid: prepaid,
		payments: payments,
		total: total
	};
}

// calculation finance programs
function seasonalBusinessCount(sum, time, prepaidPercent) {
	const percentRateLeasing = 16;

	let payments = [];
	let prepaid = sum / 100 * prepaidPercent;
	let payment = countPaymentLeasing(sum, prepaid, time, percentRateLeasing);
	let minPayment = payment * 0.5;
	let maxPayment = payment * 1.5;
	let total = prepaid + (minPayment + maxPayment) * time / 2;

	for (let i = 1; i <= time; i++) {
		if (i % 6 > 0 && i % 6 < 4) {
			payments.push(minPayment);
		} else {
			payments.push(maxPayment);
		}
	}

	return {
		time: time,
		prepaid: prepaid,
		payments: payments,
		total: total
	};
}

function installmentCount(sum, time, prepaidPercent) {
	const percentRate = 28;
	const installmentMounth = 6;
	const lastPayments = 1800;
	const qtyMounth = 12;

	let payments = [];
	let prepaid = sum / 100 * prepaidPercent;
	let firstPayments = countPaymentLeasing(sum, prepaid, installmentMounth, percentRate);
	let total = prepaid + firstPayments * installmentMounth + lastPayments * (qtyMounth - installmentMounth);

	for (let i = 1; i <= qtyMounth; i++) {
		if (i <= installmentMounth) {
			payments.push(firstPayments);
		} else {
			payments.push(lastPayments);
		}
	}

	return {
		time: qtyMounth,
		prepaid: prepaid,
		payments: payments,
		total: total
	};
}

function leasingHolidaysCount(sum, time, prepaidPercent, timeHolidays) {
	const percentRateLeasing = 16;

	let payments = [];
	let prepaid = sum / 100 * prepaidPercent;
	let oldPayment = countPaymentLeasing(sum, prepaid, time, percentRateLeasing);
	let payment = oldPayment * time / (time - timeHolidays);
	let total = prepaid + payment * (time - timeHolidays);

	for (let i = 1; i <= time; i++) {
		if (i <= timeHolidays) {
			payments.push(0);
		} else {
			payments.push(payment);
		}
	}

	return {
		time: time,
		prepaid: prepaid,
		payments: payments,
		total: total
	};
}

function viewFinanceTable(calculator, data, isInit) {
	let wrapTable = calculator.find('.js-finance-table-result');
	let table = wrapTable.find('[data-finance-elem="table"]');

	function inputDataCell(name, value, percent) {
		value = percent || $.trim(value) === '' ? value : value.toFixed(0);

		if (percent) {
			table.find('[data-table-cell="'+name+'"]').html(value);
		} else {
			table.find('[data-table-cell="'+name+'"]').html(getValueInt(value));
		}
	}

	inputDataCell('leasing-payment', data.payment.leasing);

	inputDataCell('leasing-rate', data.rate.leasing, true);

	// tax data
	inputDataCell('leasing-tax-refund', data.taxRefund.leasing);

	inputDataCell('leasing-tax-cuts', data.taxCuts.leasing);

	inputDataCell('leasing-result-tax', data.resultTax.leasing);

	// expenses and overpayment data
	inputDataCell('leasing-result-expenses', data.resultExpenses.leasing);

	inputDataCell('leasing-result-overpayment', data.overpayment.leasing);

	// total data
	inputDataCell('leasing-result', data.financeResult.leasing);

	inputDataCell('leasing-saving', data.saving.leasing);

	inputDataCell('leasing-saving-percent', data.savingPercent.leasing, true);

	!isInit && wrapTable.addClass('open');

	getFinanceConditions();


}

function getFinanceConditions($wrapTable){
	let $conditionTable = $('.js-finance-condition');
	let $financeForm = $('.js-finance-form');
	let regexp = /(\s+)/g;
	let financeConditions = '';

	let $valuesForm = $('.leasingFormData__value', $financeForm);
	if($valuesForm.length){
		$valuesForm.each(function(){
			let $th = $(this);
			financeConditions += $th.find(".leasingFormData__name").text().trim().replace(regexp, ' ')+ ': ' +
				$th.find(".leasingFormData__input").val().trim().replace(regexp, ' ') +
				'\r\n';
		});
	}

	let $tline = $conditionTable.find('.tline');
	if($tline.length){
		let sectChecks = $('.financeCalculator__selection_checkboxes', $conditionTable);
		if(sectChecks.length){
			financeConditions += 'Налоговый режим: ';
			financeConditions += $('input:checked', sectChecks).parent().text().trim().replace(regexp, ' ')+ '\r\n';
		}
		financeConditions += '\r\n';
		$tline.each(function(){
			financeConditions += $(this).text().trim().replace(regexp, ' ') + '\r\n';
		});
	}

	$('.js-popup-show', $conditionTable).data('autoload-detail',financeConditions);
}

// calculation finance
function calculationFinance(calculator, isInit) {
	const calculatorType = calculator.parents('.js-discont-section').attr('data-discont-section-name').trim() || 'entity';

	let sum = +getNumber(calculator.find('input[name="finance-calc-sum"]').val()); // Сумма
	let time = +getNumber(calculator.find('input[name="finance-calc-time"]').val()); // Срок
	let prepaid = calculator.find('input[name="finance-calc-prepaid"]').val().split('/'); // Аванс
	let taxRegime = +getNumber(calculator.find('input[name="finance-calc-tax-regime"]:checked').val()); // Налоговый режим

	prepaid = +getFloat(prepaid[1] || prepaid[0]);

	let resultStandartCount = standartCount(sum, time, prepaid, taxRegime, calculatorType);

	viewFinanceTable(calculator, resultStandartCount, isInit);
}

// init event finance calculation
function initEventsFinanceCalculation() {
	if (!$('.js-finance-calculator')[0]) return false;

	let sliderRanges = $('.js-finance-calculator').find('.js-range-values-selection');
	let countUpdateRanges = 0;

	$('.js-count-finance-calculator').on('click', function(e) {
		e.preventDefault();
		calculationFinance($(this).parents('.js-finance-calculator'));
	});

	$('.js-finance-calculator input[type="radio"]').on('change', function() {
		calculationFinance($(this).parents('.js-finance-calculator'));
	});

	for (let i = 0; i < sliderRanges.length; i++) {
		const slider = sliderRanges[i];

		slider.noUiSlider.on('update', function() {
			countUpdateRanges++;

			if (countUpdateRanges > sliderRanges.length) {
				calculationFinance($(slider).parents('.js-finance-calculator'));
			}
		});
	}

	calculationFinance($('.js-finance-calculator'), true);
}

$(document).ready(function() {
	// init finance table
	initFinanceTable('.js-finance-table');

	// init finance calculator
	initFinanceCalculator();

	// init event finance calculation
	initEventsFinanceCalculation();
});

// control popups info - управление попапами с информацией о лизинге
function positionInfoPopup(link, insideClone) {
    // let popup = $(link).find('.js-info-popup-inside');
    let widthPage = $(document).outerWidth();
    let widthLink = $(link).outerWidth();
    let heightLink = $(link).outerHeight();
    // let widthPopup = widthPage >= 480 ? 380 : 320;
    let top = $(link).offset().top + heightLink + 5;
    let left = $(link).offset().left;

    insideClone.css({"top":0, "left":0}).appendTo('body');

    let widthPopup = insideClone.outerWidth();
    let maxRight = left + widthPopup;
    let maxLeft = left + widthLink - widthPopup;
    /*console.log(link);
    console.log('widthLink:'+widthLink);
    console.log('left:'+left);
    console.log('widthPopup:'+widthPopup);
    console.log('maxRight:'+maxRight);
    console.log('widthPage:'+widthPage);
    console.log('maxLeft:' + maxLeft);*/
    if (maxRight > widthPage && maxLeft < 0) {
        insideClone.removeClass('infoPopup__inside_left').addClass('infoPopup__inside_center');
        left = '50%';
    } else if (maxRight > widthPage) {
        insideClone.removeClass('infoPopup__inside_center').addClass('infoPopup__inside_left');
        left = left + widthLink;
    } else {
        insideClone.removeClass('infoPopup__inside_center').removeClass('infoPopup__inside_left');
    }

    insideClone.css({"top":top, "left":left});

    // return insideClone;
}

function toggleAdvInfo(btn, close) {
    let block = btn.parents('.js-info-popup');
    let inside = block.find('.js-info-popup-inside');
    let insideClone = inside.clone();

    if (!block.hasClass('open') && !close) {
        $('.js-info-popup.open').removeClass('open');
        $('.js-info-popup-inside.open').removeClass('open').slideUp(200, function() {
            $(this).remove();
        });
        positionInfoPopup(block, insideClone);
        block.addClass('open');
        insideClone.addClass('open').slideDown(200);
    } else {
        $('.js-info-popup.open').removeClass('open');
        $('.js-info-popup-inside.open').removeClass('open').slideUp(200, function() {
            $(this).remove();
        });
    }
}

function toggleAdvInfoMobile(btn) {
    if (btn.hasClass('open')) {
        btn.removeClass('open').siblings('.js-info-popup').slideUp(200);
    } else {
        $('.js-info-control.open').removeClass('open').siblings('.js-info-popup').slideUp(200);
        btn.addClass('open').siblings('.js-info-popup').slideDown(200);
    }
}

$(document).ready(function() {
    // events info popup
    $('.js-info-popup').addClass('initialized');
    $('.js-info-popup-inside').addClass('initialized');

    $(document).on('click', '.js-info-popup-link', function(e) {
        e.preventDefault();
        toggleAdvInfo($(this));
    });

    $(document).on('click', '.js-info-popup-close', function(e) {
        e.preventDefault();
        toggleAdvInfo($(this), true);
    });

    $(document).on('click', '.js-info-control', function(e) {
        e.preventDefault();
        toggleAdvInfoMobile($(this));
    });

    // event click outside element
    $(document).on('click', function(e) {
        if (
            $('.js-info-popup-inside.open')[0] &&
            !$(e.target).hasClass('js-info-popup-inside') &&
            !$(e.target).parents('.js-info-popup-inside')[0] &&
            !$(e.target).hasClass('js-info-popup') &&
            !$(e.target).parents('.js-info-popup')[0]
        ) {
            let infoPopups = $('.js-info-popup.open');
            for (let i = 0; i < infoPopups.length; i++) {
                const item = $(infoPopups[i]).find('.js-info-popup-link');
                toggleAdvInfo(item, true);
            }
        }
    });
});