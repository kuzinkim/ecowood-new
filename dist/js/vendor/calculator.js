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

	$('.js-leasing-btn', $conditionTable).attr('data-autoload-detail',financeConditions);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ2ZW5kb3IvY2FsY3VsYXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbml0IGZpbmFuY2UgdGFibGVcclxuZnVuY3Rpb24gaW5pdEZpbmFuY2VUYWJsZShpdGVtcykge1xyXG5cdGxldCAkaXRlbXMgPSAkKGl0ZW1zKTtcclxuXHRpZiAoISRpdGVtc1swXSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRjb25zdCByZXNwb25zaXZlID0gW1xyXG5cdFx0e1xyXG5cdFx0XHRicmVha3BvaW50OiAwLFxyXG5cdFx0XHRzZXR0aW5nczoge1xyXG5cdFx0XHRcdGNvbHVtbnM6IDEsXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdGJyZWFrcG9pbnQ6IDQ4MCxcclxuXHRcdFx0c2V0dGluZ3M6IHtcclxuXHRcdFx0XHRjb2x1bW5zOiAyLFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRicmVha3BvaW50OiA3NjgsXHJcblx0XHRcdHNldHRpbmdzOiB7XHJcblx0XHRcdFx0Y29sdW1uczogMyxcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRdO1xyXG59XHJcblxyXG5cclxuLy8gaGVscCBmdW5jdGlvbnMgZmluYW5jZSBjYWxjdWxhdG9yXHJcbmZ1bmN0aW9uIGdldE51bWJlcih2YWx1ZSkge1xyXG5cdHZhbHVlID0gU3RyaW5nKHZhbHVlKS5zcGxpdCgnJykuZmlsdGVyKGZ1bmN0aW9uKG51bWJlcikge1xyXG5cdFx0cmV0dXJuICEhbnVtYmVyLm1hdGNoKC9eXFxkKyQvKTtcclxuXHR9KS5qb2luKCcnKTtcclxuXHRyZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZsb2F0KHZhbHVlKSB7XHJcblx0dmFsdWUgPSBTdHJpbmcodmFsdWUpLnJlcGxhY2UoL1teLlxcZF0rL2csXCJcIik7XHJcblx0cmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRWYWx1ZUludCh2YWx1ZSwgc2ltYm9sKSB7XHJcblx0aWYgKHZhbHVlID09PSAnJykgcmV0dXJuICcnO1xyXG5cclxuXHRsZXQgbnVtYmVyID0gK3ZhbHVlO1xyXG5cdGxldCBhcnIgPSBudW1iZXIudG9GaXhlZCgwKS5zcGxpdCgnJyk7XHJcblx0bGV0IGxlbmd0aCA9IGFyci5sZW5ndGg7XHJcblx0bGV0IG5ld0FyciA9IFtdO1xyXG5cdHNpbWJvbCA9IHNpbWJvbCB8fCAnJztcclxuXHJcblx0Zm9yIChsZXQgaSA9IGxlbmd0aCAtIDQ7IGkgPj0gMDsgaT0oaS0zKSkge1xyXG5cdFx0bmV3QXJyLnB1c2goaSk7XHJcblx0fVxyXG5cclxuXHRudW1iZXIgPSBhcnIubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4LCBhcnJheSkge1xyXG5cdFx0aWYgKG5ld0Fyci5pbmNsdWRlcyhpbmRleCkpIHtcclxuXHRcdFx0aXRlbSA9IGl0ZW0gKyAnICc7XHJcblx0XHR9XHJcblx0XHRpZiAoaW5kZXggPT09IGxlbmd0aCAtIDEpIHtcclxuXHRcdFx0aXRlbSA9IGl0ZW0gKyAnJyArIHNpbWJvbDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBpdGVtO1xyXG5cdH0pLmpvaW4oJycpO1xyXG5cclxuXHRyZXR1cm4gbnVtYmVyO1xyXG59XHJcblxyXG5mdW5jdGlvbiBwb3N0Zml4WWVhcih2YWwpIHtcclxuXHR2YXIgcG9zdGZpeCA9ICcg0LvQtdGCJztcclxuXHRpZiAodmFsID09PSAnMScpIHtcclxuXHRcdHBvc3RmaXggPSAnINCz0L7QtCc7XHJcblx0fSBlbHNlIGlmICh2YWwgPT09ICcyJyB8fCB2YWwgPT09ICczJyB8fCB2YWwgPT09ICc0Jykge1xyXG5cdFx0cG9zdGZpeCA9ICcg0LPQvtC00LAnO1xyXG5cdH1cclxuXHRyZXR1cm4gcG9zdGZpeDtcclxufVxyXG5cclxuZnVuY3Rpb24gcG9zdGZpeE1vdW50aCh2YWwpIHtcclxuXHR2YXIgcG9zdGZpeCA9ICcg0LzQtdGB0Y/RhtC10LInO1xyXG5cdGlmICh2YWwgPT09ICcxJykge1xyXG5cdFx0cG9zdGZpeCA9ICcg0LzQtdGB0Y/Rhic7XHJcblx0fSBlbHNlIGlmICh2YWwgPT09ICcyJyB8fCB2YWwgPT09ICczJyB8fCB2YWwgPT09ICc0Jykge1xyXG5cdFx0cG9zdGZpeCA9ICcg0LzQtdGB0Y/RhtCwJztcclxuXHR9XHJcblx0cmV0dXJuIHBvc3RmaXg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHByaWNlUnVibGUodmFsLCBpc0RlY29kZSkge1xyXG5cdGlmIChpc0RlY29kZSkge1xyXG5cdFx0aWYgKHZhbC5pbmRleE9mKCfQvNC70L0uJykgPiAtMSkge1xyXG5cdFx0XHR2YWwgPSB2YWwucmVwbGFjZSgvXFxEKy9nLFwiXCIpICogMTAwMDAwMDtcclxuXHRcdH0gZWxzZSBpZiAodmFsLmluZGV4T2YoJ9GC0YvRgS4nKSA+IC0xKSB7XHJcblx0XHRcdHZhbCA9IHZhbC5yZXBsYWNlKC9cXEQrL2csXCJcIikgKiAxMDAwO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRpZiAoK3ZhbCA+PSAxMDAwMDAwKSB7XHJcblx0XHRcdHZhbCA9IE1hdGgucm91bmQoK3ZhbCAvIDEwMDAwMDApICsgJyDQvNC70L0uJ1xyXG5cdFx0fSBlbHNlIGlmICgrdmFsID49IDEwMDApIHtcclxuXHRcdFx0dmFsID0gTWF0aC5yb3VuZCgrdmFsIC8gMTAwMCkgKyAnINGC0YvRgS4nXHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB2YWw7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlucHV0Rm9jdXMoaXRlbSkge1xyXG5cdGl0ZW0ub24oJ2ZvY3VzJywgZnVuY3Rpb24oKXtcclxuXHRcdGNvbnN0IGFyclZhbHVlID0gJCh0aGlzKS52YWwoKS5zcGxpdCgnLycpO1xyXG5cdFx0Y29uc3QgdmFsdWUgPSArZ2V0RmxvYXQoYXJyVmFsdWVbMV0gfHwgYXJyVmFsdWVbMF0pO1xyXG5cdFx0JCh0aGlzKS52YWwodmFsdWUpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnB1dEJsdXIoaXRlbSwgc2xpZGVyKSB7XHJcblx0aXRlbS5vbignYmx1cicsIGZ1bmN0aW9uKCl7XHJcblx0XHRjb25zdCBhcnJWYWx1ZSA9ICQodGhpcykudmFsKCkuc3BsaXQoJy8nKTtcclxuXHRcdGNvbnN0IHZhbHVlID0gK2dldEZsb2F0KGFyclZhbHVlWzFdIHx8IGFyclZhbHVlWzBdKTtcclxuXHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCh2YWx1ZSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlucHV0Q2hhbmdlKGl0ZW0sIHNsaWRlcikge1xyXG5cdGl0ZW0ub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XHJcblx0XHRjb25zdCBhcnJWYWx1ZSA9ICQodGhpcykudmFsKCkuc3BsaXQoJy8nKTtcclxuXHRcdGNvbnN0IHZhbHVlID0gK2dldEZsb2F0KGFyclZhbHVlWzFdIHx8IGFyclZhbHVlWzBdKTtcclxuXHRcdHNsaWRlci5ub1VpU2xpZGVyLnNldCh2YWx1ZSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJhbmdlQ2xpY2soaXRlbSwgc2xpZGVyKSB7XHJcblx0aXRlbS5vbignY2xpY2snLCAnLm5vVWktdmFsdWUtbGFyZ2UnLCBmdW5jdGlvbigpe1xyXG5cdFx0c2xpZGVyLm5vVWlTbGlkZXIuc2V0KGdldE51bWJlcihwcmljZVJ1YmxlKCQodGhpcykudGV4dCgpLCB0cnVlKSkpO1xyXG5cdH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGVja0luc3RhbGxtZW50KHZhbHVlKSB7XHJcblx0aWYgKCt2YWx1ZSA9PT0gMSkge1xyXG5cdFx0JCgnaW5wdXRbbmFtZT1cImluc3RhbGxtZW50XCJdJykucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdCQoJ2lucHV0W25hbWU9XCJpbnN0YWxsbWVudFwiXScpLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSkucHJvcCgnY2hlY2tlZCcsIGZhbHNlKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGluaXQgZmluYW5jZSBjYWxjdWxhdG9yXHJcbmZ1bmN0aW9uIGluaXRGaW5hbmNlQ2FsY3VsYXRvcigpIHtcclxuXHRpZiAoISQoJy5qcy1maW5hbmNlLWNhbGN1bGF0b3InKVswXSkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRsZXQgcmFuZ2VTdW0gPSAkKCcuanMtcmFuZ2UtdmFsdWVzW2RhdGEtbGVhc2luZy1zZWxlY3Q9XCJzdW1cIl0nKTtcclxuXHRsZXQgcmFuZ2VUaW1lID0gJCgnLmpzLXJhbmdlLXZhbHVlc1tkYXRhLWxlYXNpbmctc2VsZWN0PVwidGltZS1maW5hbmNlXCJdJyk7XHJcblx0bGV0IHJhbmdlUHJlcGF5bWVudCA9ICQoJy5qcy1yYW5nZS12YWx1ZXNbZGF0YS1sZWFzaW5nLXNlbGVjdD1cInByZXBheW1lbnRcIl0nKTtcclxuXHJcblx0bGV0IGlucHV0U3VtID0gcmFuZ2VTdW0uZmluZCgnaW5wdXQnKTtcclxuXHRsZXQgaW5wdXRUaW1lID0gcmFuZ2VUaW1lLmZpbmQoJ2lucHV0Jyk7XHJcblx0bGV0IGlucHV0UHJlcGF5bWVudCA9IHJhbmdlUHJlcGF5bWVudC5maW5kKCdpbnB1dCcpO1xyXG5cclxuXHRsZXQgc2xpZGVyU3VtID0gcmFuZ2VTdW0uZmluZCgnLmpzLXJhbmdlLXZhbHVlcy1zZWxlY3Rpb24nKVswXTtcclxuXHRsZXQgc2xpZGVyVGltZSA9IHJhbmdlVGltZS5maW5kKCcuanMtcmFuZ2UtdmFsdWVzLXNlbGVjdGlvbicpWzBdO1xyXG5cdGxldCBzbGlkZXJQcmVwYXltZW50ID0gcmFuZ2VQcmVwYXltZW50LmZpbmQoJy5qcy1yYW5nZS12YWx1ZXMtc2VsZWN0aW9uJylbMF07XHJcblxyXG5cdGNvbnN0IHByZXBheW1lbnRGb3JtYXQgPSB3TnVtYih7XHJcblx0XHRkZWNpbWFsczogMixcclxuXHRcdHBvc3RmaXg6ICcgJSdcclxuXHR9KTtcclxuXHJcblx0bm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyU3VtLCB7XHJcblx0XHRzdGFydDogZ2V0TnVtYmVyKGlucHV0U3VtLnZhbCgpKSxcclxuXHRcdHN0ZXA6IDEwMDAsXHJcblx0XHRjb25uZWN0OiBbdHJ1ZSwgZmFsc2VdLFxyXG5cdFx0cmFuZ2U6IHtcclxuXHRcdFx0J21pbic6IDI3MDAwMCxcclxuXHRcdFx0J21heCc6IDMwMDAwMDAwXHJcblx0XHR9LFxyXG5cdFx0cGlwczoge1xyXG5cdFx0XHRtb2RlOiAndmFsdWVzJyxcclxuXHRcdFx0dmFsdWVzOiBbMjcwMDAwLDMwMDAwMDAwXSxcclxuXHRcdFx0Zm9ybWF0OiB7XHJcblx0XHRcdFx0dG86IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGdldFZhbHVlSW50KHZhbHVlLCAnINCgJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0Zm9ybWF0OiB3TnVtYih7XHJcblx0XHRcdGRlY2ltYWxzOiAwLFxyXG5cdFx0XHR0aG91c2FuZDogJyAnLFxyXG5cdFx0XHRwb3N0Zml4OiAnINCgJ1xyXG5cdFx0fSlcclxuXHR9KTtcclxuXHJcblx0bm9VaVNsaWRlci5jcmVhdGUoc2xpZGVyVGltZSwge1xyXG5cdFx0c3RhcnQ6IDEsXHJcblx0XHRzdGVwOiAxLFxyXG5cdFx0Y29ubmVjdDogW3RydWUsIGZhbHNlXSxcclxuXHRcdHJhbmdlOiB7XHJcblx0XHRcdCdtaW4nOiAxMixcclxuXHRcdFx0J21heCc6IDYwXHJcblx0XHR9LFxyXG5cdFx0cGlwczoge1xyXG5cdFx0XHRtb2RlOiAndmFsdWVzJyxcclxuXHRcdFx0dmFsdWVzOiBbMTIsNjBdLFxyXG5cdFx0XHRmb3JtYXQ6IHtcclxuXHRcdFx0XHR0bzogZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWUgKyBwb3N0Zml4TW91bnRoKHZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHRmb3JtYXQ6IHdOdW1iKHtcclxuXHRcdFx0ZGVjaW1hbHM6IDBcclxuXHRcdH0pXHJcblx0fSk7XHJcblxyXG5cdG5vVWlTbGlkZXIuY3JlYXRlKHNsaWRlclByZXBheW1lbnQsIHtcclxuXHRcdHN0YXJ0OiAwLFxyXG5cdFx0c3RlcDogMC41LFxyXG5cdFx0Y29ubmVjdDogW3RydWUsIGZhbHNlXSxcclxuXHRcdHJhbmdlOiB7XHJcblx0XHRcdCdtaW4nOiAwLFxyXG5cdFx0XHQnbWF4JzogNDlcclxuXHRcdH0sXHJcblx0XHRwaXBzOiB7XHJcblx0XHRcdG1vZGU6ICd2YWx1ZXMnLFxyXG5cdFx0XHR2YWx1ZXM6IFswLDQ5XSxcclxuXHRcdFx0Zm9ybWF0OiB3TnVtYih7XHJcblx0XHRcdFx0cG9zdGZpeDogJyAlJ1xyXG5cdFx0XHR9KVxyXG5cdFx0fSxcclxuXHRcdGZvcm1hdDoge1xyXG5cdFx0XHR0bzogZnVuY3Rpb24gKHZhbHVlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHByZXBheW1lbnRGb3JtYXQudG8odmFsdWUpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRmcm9tOiBmdW5jdGlvbiAodmFsdWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gcHJlcGF5bWVudEZvcm1hdC5mcm9tKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRzbGlkZXJTdW0ubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcywgaGFuZGxlICkge1xyXG5cdFx0aW5wdXRTdW0udmFsKHZhbHVlc1toYW5kbGVdKTtcclxuXHRcdGlucHV0UHJlcGF5bWVudC50cmlnZ2VyKCdjaGFuZ2UnKTtcclxuXHR9KTtcclxuXHJcblx0c2xpZGVyVGltZS5ub1VpU2xpZGVyLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiggdmFsdWVzLCBoYW5kbGUgKSB7XHJcblx0XHRpbnB1dFRpbWUudmFsKHZhbHVlc1toYW5kbGVdICsgcG9zdGZpeE1vdW50aCh2YWx1ZXNbaGFuZGxlXSkpO1xyXG5cdFx0Y2hlY2tJbnN0YWxsbWVudCh2YWx1ZXNbaGFuZGxlXSk7XHJcblx0fSk7XHJcblxyXG5cdHNsaWRlclByZXBheW1lbnQubm9VaVNsaWRlci5vbigndXBkYXRlJywgZnVuY3Rpb24oIHZhbHVlcywgaGFuZGxlICkge1xyXG5cdFx0Y29uc3QgYXJyVmFsdWUgPSB2YWx1ZXNbaGFuZGxlXS5zcGxpdCgnLycpO1xyXG5cdFx0Y29uc3QgdmFsdWUgPSArZ2V0RmxvYXQoYXJyVmFsdWVbMV0gfHwgYXJyVmFsdWVbMF0pO1xyXG5cdFx0Y29uc3Qgc3VtID0gK2dldE51bWJlcigkKCcuanMtZmluYW5jZS1jYWxjdWxhdG9yIGlucHV0W25hbWU9XCJmaW5hbmNlLWNhbGMtc3VtXCJdJykudmFsKCkpICogK2dldEZsb2F0KHZhbHVlKSAvIDEwMDtcclxuXHRcdGNvbnN0IHJlc3VsdCA9IGdldFZhbHVlSW50KHN1bSwgJyDQoCcpICsgJyAvICcgKyBwcmVwYXltZW50Rm9ybWF0LnRvKHZhbHVlKTtcclxuXHRcdGlucHV0UHJlcGF5bWVudC52YWwocmVzdWx0KTtcclxuXHR9KTtcclxuXHJcblx0aW5wdXRGb2N1cyhpbnB1dFN1bSk7XHJcblx0aW5wdXRGb2N1cyhpbnB1dFRpbWUpO1xyXG5cdGlucHV0Rm9jdXMoaW5wdXRQcmVwYXltZW50KTtcclxuXHJcblx0aW5wdXRCbHVyKGlucHV0U3VtLCBzbGlkZXJTdW0pO1xyXG5cdGlucHV0Qmx1cihpbnB1dFRpbWUsIHNsaWRlclRpbWUpO1xyXG5cdGlucHV0Qmx1cihpbnB1dFByZXBheW1lbnQsIHNsaWRlclByZXBheW1lbnQpO1xyXG5cclxuXHRpbnB1dENoYW5nZShpbnB1dFN1bSwgc2xpZGVyU3VtKTtcclxuXHRpbnB1dENoYW5nZShpbnB1dFRpbWUsIHNsaWRlclRpbWUpO1xyXG5cdGlucHV0Q2hhbmdlKGlucHV0UHJlcGF5bWVudCwgc2xpZGVyUHJlcGF5bWVudCk7XHJcblxyXG5cdHJhbmdlQ2xpY2socmFuZ2VTdW0sIHNsaWRlclN1bSk7XHJcblx0cmFuZ2VDbGljayhyYW5nZVRpbWUsIHNsaWRlclRpbWUpO1xyXG5cdHJhbmdlQ2xpY2socmFuZ2VQcmVwYXltZW50LCBzbGlkZXJQcmVwYXltZW50KTtcclxufVxyXG5cclxuXHJcblxyXG4vLyBjb3VudCBmdW5jdGlvbnNcclxuZnVuY3Rpb24gY291bnRMaW5lYXJEZXByZWNpYXRpb24oc3VtLCB0aW1lKSB7XHJcblx0bGV0IHBlcmNlbnRMRCA9IDEyMCAvIDEyO1xyXG5cdGxldCB2YWx1ZUxEID0gc3VtICogcGVyY2VudExEIC8gMTAwIC8gMTIgLyAxLjI7XHJcblxyXG5cdHJldHVybiB2YWx1ZUxELnRvRml4ZWQoMSkgKiB0aW1lO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb3VudFBNVChyYXRlUGVyUGVyaW9kLCBudW1iZXJPZlBheW1lbnRzLCBwcmVzZW50VmFsdWUsIGZ1dHVyZVZhbHVlLCB0eXBlKSB7XHJcblx0ZnV0dXJlVmFsdWUgPSB0eXBlb2YgZnV0dXJlVmFsdWUgIT09ICd1bmRlZmluZWQnID8gZnV0dXJlVmFsdWUgOiAwO1xyXG5cdHR5cGUgPSB0eXBlb2YgdHlwZSAhPT0gJ3VuZGVmaW5lZCcgPyB0eXBlIDogMDtcclxuXHRpZiAocmF0ZVBlclBlcmlvZCAhPSAwLjApIHtcclxuXHRcdHZhciBxID0gTWF0aC5wb3coMSArIHJhdGVQZXJQZXJpb2QsIG51bWJlck9mUGF5bWVudHMpO1xyXG5cdFx0cmV0dXJuIC0ocmF0ZVBlclBlcmlvZCAqIChmdXR1cmVWYWx1ZSArIChxICogcHJlc2VudFZhbHVlKSkpIC8gKCgtMSArIHEpICogKDEgKyByYXRlUGVyUGVyaW9kICogKHR5cGUpKSk7XHJcblx0fSBlbHNlIGlmIChudW1iZXJPZlBheW1lbnRzICE9IDAuMCkge1xyXG5cdFx0cmV0dXJuIC0oZnV0dXJlVmFsdWUgKyBwcmVzZW50VmFsdWUpIC8gbnVtYmVyT2ZQYXltZW50cztcclxuXHR9XHJcblx0cmV0dXJuIDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvdW50UGF5bWVudExlYXNpbmcoc3VtLCBwcmVwYWlkLCB0aW1lLCBwZXJjZW50KSB7XHJcblx0bGV0IHBlcmNlbnRNb250aCA9IHBlcmNlbnQgLyAxMDAgLyAxMjtcclxuXHRyZXR1cm4gKHN1bSAtIHByZXBhaWQpICogKHBlcmNlbnRNb250aCArIHBlcmNlbnRNb250aCAvIChNYXRoLnBvdygxICsgcGVyY2VudE1vbnRoLCB0aW1lKSAtIDEpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY291bnRQYXltZW50Q3JlZGl0KHN1bSwgcHJlcGFpZCwgdGltZSwgcGVyY2VudCkge1xyXG5cdGxldCByYXRlUGVyY2VudCA9IHBlcmNlbnQgLyAxMiAvIDEwMDtcclxuXHRsZXQgbG9hbiA9IHN1bSAtIHByZXBhaWQ7XHJcblxyXG5cdHJldHVybiAtY291bnRQTVQocmF0ZVBlcmNlbnQsIHRpbWUsIGxvYW4pO1xyXG59XHJcblxyXG4vLyBjYWxjdWxhdGlvbiBhbmQgZ2V0dGluZyB0YXhcclxuZnVuY3Rpb24gZ2V0VGF4UmVmdW5kKHZhbHVlLCB0YXgpIHtcclxuXHRpZiAodGF4ID09PSAyMCkge1xyXG5cdFx0Ly8gcmV0dXJuIC0xICogKHZhbHVlICogMjAgLyAxMjApO1xyXG5cdFx0cmV0dXJuIHZhbHVlICogMjAgLyAxMjA7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGF4Q3V0c0xlYXNpbmcob3ZlcnBheW1lbnRDcmVkaXQsIGV4cGVuc2VzLCB0aW1lLCB0YXgpIHtcclxuXHRpZiAodGF4ID09PSAyMCkge1xyXG5cdFx0Ly8gcmV0dXJuIC0xICogKGV4cGVuc2VzIC8gMS4yKSAqIDAuMjtcclxuXHRcdHJldHVybiAoZXhwZW5zZXMgLyAxLjIpICogMC4yO1xyXG5cdH0gZWxzZSBpZiAodGF4ID09PSAxNSkge1xyXG5cdFx0Ly8gcmV0dXJuIC0xICogKChleHBlbnNlcyAvIDEuMikgKyBvdmVycGF5bWVudENyZWRpdCkgKiAwLjE1O1xyXG5cdFx0cmV0dXJuICgoZXhwZW5zZXMgLyAxLjIpICsgb3ZlcnBheW1lbnRDcmVkaXQpICogMC4xNTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUYXhDdXRzQ3JlZGl0KHN1bSwgZXhwZW5zZXMsIHRpbWUsIHRheCkge1xyXG5cdGxldCBsZCA9IGNvdW50TGluZWFyRGVwcmVjaWF0aW9uKHN1bSwgdGltZSk7XHJcblx0bGV0IG92ZXJwYXltZW50ID0gZXhwZW5zZXMgLSBzdW07XHJcblxyXG5cdGlmICh0YXggPT09IDIwKSB7XHJcblx0XHQvLyByZXR1cm4gLTEgKiAob3ZlcnBheW1lbnQgKyBsZCkgKiAwLjI7XHJcblx0XHRyZXR1cm4gKG92ZXJwYXltZW50ICsgbGQpICogMC4yO1xyXG5cdH0gZWxzZSBpZiAodGF4ID09PSAxNSkge1xyXG5cdFx0Ly8gcmV0dXJuIC0xICogKG92ZXJwYXltZW50ICsgbGQpICogMC4xNTtcclxuXHRcdHJldHVybiAob3ZlcnBheW1lbnQgKyBsZCkgKiAwLjE1O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRheEN1dHNNb25leShzdW0sIGV4cGVuc2VzLCB0aW1lLCB0YXgpIHtcclxuXHRsZXQgbGQgPSBjb3VudExpbmVhckRlcHJlY2lhdGlvbihzdW0sIHRpbWUpO1xyXG5cclxuXHRpZiAodGF4ID09PSAyMCkge1xyXG5cdFx0Ly8gcmV0dXJuIC0xICogbGQgKiAwLjI7XHJcblx0XHRyZXR1cm4gbGQgKiAwLjI7XHJcblx0fSBlbHNlIGlmICh0YXggPT09IDE1KSB7XHJcblx0XHQvLyByZXR1cm4gLTEgKiBsZCAqIDAuMTU7XHJcblx0XHRyZXR1cm4gbGQgKiAwLjE1O1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGdldHRpbmcgbW91bnQgbGlzdCBmb3IgZ3JhcGggcGF5bWVudHNcclxuZnVuY3Rpb24gZ2V0TW9udGhMaXN0KHF0eU1vdW50aCkge1xyXG5cdGxldCBhcnJNb3VudGggPSBbXTtcclxuXHRsZXQgbW91bnRocyA9IFsn0K/QvdCy0LDRgNGMJywn0KTQtdCy0YDQsNC70YwnLCfQnNCw0YDRgicsJ9CQ0L/RgNC10LvRjCcsJ9Cc0LDQuScsJ9CY0Y7QvdGMJywn0JjRjtC70YwnLCfQkNCy0LPRg9GB0YInLCfQodC10L3RgtGP0LHRgNGMJywn0J7QutGC0Y/QsdGA0YwnLCfQndC+0Y/QsdGA0YwnLCfQlNC10LrQsNCx0YDRjCddO1xyXG5cdGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcblx0bGV0IGN1cnJlbnRNb3VudGggPSB0b2RheS5nZXRNb250aCgpO1xyXG5cdGxldCBjdXJyZW50WWVhciA9IHRvZGF5LmdldEZ1bGxZZWFyKCk7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgcXR5TW91bnRoOyBpKyspIHtcclxuXHRcdGlmIChjdXJyZW50TW91bnRoID09PSAwICYmIGkgPiAwKSB7XHJcblx0XHRcdGN1cnJlbnRZZWFyKys7XHJcblx0XHR9XHJcblxyXG5cdFx0bGV0IGRhdGEgPSBtb3VudGhzW2N1cnJlbnRNb3VudGhdICsgJyAnICsgY3VycmVudFllYXI7XHJcblxyXG5cdFx0YXJyTW91bnRoLnB1c2goZGF0YSk7XHJcblxyXG5cdFx0Y3VycmVudE1vdW50aCsrO1xyXG5cdFx0Y3VycmVudE1vdW50aCA9IGN1cnJlbnRNb3VudGggPT09IDEyID8gMCA6IGN1cnJlbnRNb3VudGg7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gYXJyTW91bnRoO1xyXG59XHJcblxyXG4vLyB2aWV3IHBlcmNlbnRcclxuZnVuY3Rpb24gdmlld1BlcmNlbnQodmFsLCBmaXgpIHtcclxuXHRmaXggPSBmaXggfHwgMDtcclxuXHRyZXR1cm4gbmV3IFN0cmluZyh2YWwudG9GaXhlZChmaXgpKS5yZXBsYWNlKFwiLlwiLFwiLFwiKSArICcgJSc7XHJcbn1cclxuXHJcbi8vIGNyZWF0IGxpbmUgZm9yIGdyYXBoIHBheW1lbnRzXHJcbmZ1bmN0aW9uIGNyZWF0ZUxpbmVHcmFwZihudW1iZXIsIG5hbWUsIHZhbHVlLCBpc1Jlc3VsdCkge1xyXG5cdHZhbHVlID0gJC50cmltKHZhbHVlKSA9PT0gJycgPyB2YWx1ZSA6IHZhbHVlLnRvRml4ZWQoMCk7XHJcblx0dmFsdWUgPSBnZXRWYWx1ZUludCh2YWx1ZSk7XHJcblxyXG5cdGxldCBpbmZvID0gJzxkaXYgY2xhc3M9XCJmaW5hbmNlQ2FsY3VsYXRvcl9faW5mb1BvcHVwIGluZm9Qb3B1cCBpbmZvUG9wdXBfcHJvZHVjdCBqcy1pbmZvLXBvcHVwIGluaXRpYWxpemVkXCI+PGJ1dHRvbiBjbGFzcz1cImluZm9Qb3B1cF9fbGluayBpbmZvUG9wdXBfX2xpbmtfcHJvZHVjdCBqcy1pbmZvLXBvcHVwLWxpbmtcIj48c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiPjx1c2UgeGxpbms6aHJlZj1cIi9saXppbmcvc3ByaXRlLnN2ZyNpbmZvXCI+PC91c2U+PC9zdmc+PC9idXR0b24+PGRpdiBjbGFzcz1cImluZm9Qb3B1cF9faW5zaWRlIGluZm9Qb3B1cF9faW5zaWRlX3Byb2QganMtaW5mby1wb3B1cC1pbnNpZGUgaW5pdGlhbGl6ZWRcIj48YnV0dG9uIGNsYXNzPVwiaW5mb1BvcHVwX19jbG9zZSBqcy1pbmZvLXBvcHVwLWNsb3NlXCI+PHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIj48dXNlIHhsaW5rOmhyZWY9XCIvbGl6aW5nL3Nwcml0ZS5zdmcjY3Jvc3NcIj48L3VzZT48L3N2Zz48L2J1dHRvbj48ZGl2IGNsYXNzPVwiaW5mb1BvcHVwX19yZXN1bHRzIGluZm9Qb3B1cF9fcmVzdWx0c19jb3Vyc2VcIj48ZGl2IGNsYXNzPVwiaW5mb1BvcHVwX19saW5lUmVzdWx0XCI+0J7QsdGJ0LDRjyDRgdGD0LzQvNCwINC/0LvQsNGC0LXQttC10LksINCyINGCLtGHLiDQsNCy0LDQvdGBINC4INC/0LXRgNC10L/Qu9Cw0YLQsC48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4nO1xyXG5cclxuXHRpZiAoaXNSZXN1bHQpIHZhbHVlID0gdmFsdWUgKyAnICcgKyBpbmZvO1xyXG5cclxuXHRudW1iZXIgPSBudW1iZXIgPyAnPGRpdiBjbGFzcz1cInRjZWxsXCI+JytudW1iZXIrJzwvZGl2PicgOiAnJztcclxuXHJcblx0cmV0dXJuICc8ZGl2IGNsYXNzPVwidGxpbmVcIj4nICtcclxuXHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJ0ZCB0ZF9lbXB0eVwiPjwvZGl2PicgK1xyXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cInRkIHRkX3NtYWxsXCI+JytudW1iZXIrJzwvZGl2PicgK1xyXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cInRkXCI+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJ0Y2VsbFwiPicrbmFtZSsnPC9kaXY+JyArXHJcblx0XHRcdFx0XHRcdCc8L2Rpdj4nICtcclxuXHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJ0ZFwiPicgK1xyXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwidGNlbGxcIj4nK3ZhbHVlKyc8L2Rpdj4nICtcclxuXHRcdFx0XHRcdFx0JzwvZGl2PicgK1xyXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cInRkIHRkX2VtcHR5XCI+PC9kaXY+JyArXHJcblx0XHRcdFx0XHQnPC9kaXY+JztcclxufVxyXG5cclxuXHJcblxyXG4vLyBzdGFuZGFydCBjYWxjdWxhdGlvblxyXG5mdW5jdGlvbiBzdGFuZGFydENvdW50KHN1bSwgdGltZSwgcHJlcGFpZFBlcmNlbnQsIHRheFJlZ2ltZSwgY2FsY3VsYXRvclR5cGUpIHtcclxuXHRjb25zdCBwZXJjZW50UmF0ZSA9IHtcclxuXHRcdGxlYXNpbmc6IDE2LFxyXG5cdFx0Y3JlZGl0OiBjYWxjdWxhdG9yVHlwZSA9PT0gJ2luZGl2aWR1YWwnID8gMjQgOiAxMy41XHJcblx0fVxyXG5cclxuXHRsZXQgY291bnRQcmVwYWlkID0ge1xyXG5cdFx0bGVhc2luZzogc3VtIC8gMTAwICogcHJlcGFpZFBlcmNlbnQsXHJcblx0XHRjcmVkaXQ6IHN1bSAvIDEwMCAqIHByZXBhaWRQZXJjZW50LFxyXG5cdFx0bW9uZXk6IHN1bSxcclxuXHR9O1xyXG5cclxuXHRsZXQgY291bnRQYXltZW50ID0ge1xyXG5cdFx0bGVhc2luZzogY291bnRQYXltZW50TGVhc2luZyhzdW0sIGNvdW50UHJlcGFpZC5sZWFzaW5nLCB0aW1lLCBwZXJjZW50UmF0ZS5sZWFzaW5nKSxcclxuXHRcdGNyZWRpdDogY291bnRQYXltZW50Q3JlZGl0KHN1bSwgY291bnRQcmVwYWlkLmNyZWRpdCwgdGltZSwgcGVyY2VudFJhdGUuY3JlZGl0KSxcclxuXHR9O1xyXG5cclxuXHRsZXQgY291bnRSZXN1bHRFeHBlbnNlcyA9IHtcclxuXHRcdGxlYXNpbmc6IGNvdW50UHJlcGFpZC5sZWFzaW5nICsgKGNvdW50UGF5bWVudC5sZWFzaW5nICogdGltZSksXHJcblx0XHRjcmVkaXQ6IGNvdW50UHJlcGFpZC5jcmVkaXQgKyAoY291bnRQYXltZW50LmNyZWRpdCAqIHRpbWUpLFxyXG5cdFx0bW9uZXk6IGNvdW50UHJlcGFpZC5tb25leVxyXG5cdH07XHJcblxyXG5cdGxldCBjb3VudE92ZXJwYXltZW50ID0ge1xyXG5cdFx0bGVhc2luZzogY291bnRSZXN1bHRFeHBlbnNlcy5sZWFzaW5nIC0gc3VtLFxyXG5cdFx0Y3JlZGl0OiBjb3VudFJlc3VsdEV4cGVuc2VzLmNyZWRpdCAtIHN1bSxcclxuXHR9XHJcblxyXG5cdGxldCB0YXhSZWZ1bmQgPSB7XHJcblx0XHRsZWFzaW5nOiBnZXRUYXhSZWZ1bmQoY291bnRSZXN1bHRFeHBlbnNlcy5sZWFzaW5nLCB0YXhSZWdpbWUpLFxyXG5cdFx0Y3JlZGl0OiBnZXRUYXhSZWZ1bmQoc3VtLCB0YXhSZWdpbWUpLFxyXG5cdFx0bW9uZXk6IGdldFRheFJlZnVuZChzdW0sIHRheFJlZ2ltZSlcclxuXHR9O1xyXG5cclxuXHRsZXQgdGF4Q3V0cyA9IHtcclxuXHRcdGxlYXNpbmc6IGdldFRheEN1dHNMZWFzaW5nKGNvdW50UmVzdWx0RXhwZW5zZXMuY3JlZGl0IC0gc3VtLCBjb3VudFJlc3VsdEV4cGVuc2VzLmxlYXNpbmcsIHRpbWUsIHRheFJlZ2ltZSksXHJcblx0XHRjcmVkaXQ6IGdldFRheEN1dHNDcmVkaXQoc3VtLCBjb3VudFJlc3VsdEV4cGVuc2VzLmNyZWRpdCwgdGltZSwgdGF4UmVnaW1lKSxcclxuXHRcdG1vbmV5OiBnZXRUYXhDdXRzTW9uZXkoc3VtLCBjb3VudFJlc3VsdEV4cGVuc2VzLm1vbmV5LCB0aW1lLCB0YXhSZWdpbWUpXHJcblx0fTtcclxuXHJcblx0bGV0IHJlc3VsdFRheCA9IHtcclxuXHRcdGxlYXNpbmc6IHRheFJlZnVuZC5sZWFzaW5nICsgdGF4Q3V0cy5sZWFzaW5nLFxyXG5cdFx0Y3JlZGl0OiB0YXhSZWZ1bmQuY3JlZGl0ICsgdGF4Q3V0cy5jcmVkaXQsXHJcblx0XHRtb25leTogdGF4UmVmdW5kLm1vbmV5ICsgdGF4Q3V0cy5tb25leVxyXG5cdH07XHJcblxyXG5cdGxldCBmaW5hbmNlUmVzdWx0ID0ge1xyXG5cdFx0bGVhc2luZzogY291bnRSZXN1bHRFeHBlbnNlcy5sZWFzaW5nIC0gcmVzdWx0VGF4LmxlYXNpbmcsXHJcblx0XHRjcmVkaXQ6IGNvdW50UmVzdWx0RXhwZW5zZXMuY3JlZGl0IC0gcmVzdWx0VGF4LmNyZWRpdCxcclxuXHRcdG1vbmV5OiBjb3VudFJlc3VsdEV4cGVuc2VzLm1vbmV5IC0gcmVzdWx0VGF4Lm1vbmV5XHJcblx0fTtcclxuXHJcblx0bGV0IHNhdmluZyA9IHtcclxuXHRcdGxlYXNpbmc6IGNvdW50UmVzdWx0RXhwZW5zZXMubGVhc2luZyAtIGZpbmFuY2VSZXN1bHQubGVhc2luZyxcclxuXHRcdGNyZWRpdDogY291bnRSZXN1bHRFeHBlbnNlcy5jcmVkaXQgLSBmaW5hbmNlUmVzdWx0LmNyZWRpdCxcclxuXHRcdG1vbmV5OiBjb3VudFJlc3VsdEV4cGVuc2VzLm1vbmV5IC0gZmluYW5jZVJlc3VsdC5tb25leVxyXG5cdH07XHJcblxyXG5cdGxldCBzYXZpbmdQZXJjZW50ID0ge1xyXG5cdFx0bGVhc2luZzogdmlld1BlcmNlbnQoKDEgLSAxIC8gKGNvdW50UmVzdWx0RXhwZW5zZXMubGVhc2luZyAvIGZpbmFuY2VSZXN1bHQubGVhc2luZykpICogMTAwKSxcclxuXHRcdGNyZWRpdDogdmlld1BlcmNlbnQoKDEgLSAxIC8gKGNvdW50UmVzdWx0RXhwZW5zZXMuY3JlZGl0IC8gZmluYW5jZVJlc3VsdC5jcmVkaXQpKSAqIDEwMCksXHJcblx0XHRtb25leTogdmlld1BlcmNlbnQoKDEgLSAxIC8gKGNvdW50UmVzdWx0RXhwZW5zZXMubW9uZXkgLyBmaW5hbmNlUmVzdWx0Lm1vbmV5KSkgKiAxMDApXHJcblx0fTtcclxuXHJcblx0bGV0IHJhdGUgPSB7XHJcblx0XHRsZWFzaW5nOiB2aWV3UGVyY2VudCgoY291bnRSZXN1bHRFeHBlbnNlcy5sZWFzaW5nIC0gc3VtKSAvIHN1bSAvICh0aW1lIC8gMTIpICogMTAwLCAxKSxcclxuXHRcdGNyZWRpdDogdmlld1BlcmNlbnQocGVyY2VudFJhdGUuY3JlZGl0LCAxKSxcclxuXHRcdG1vbmV5OiB2aWV3UGVyY2VudCgwLCAxKVxyXG5cdH1cclxuXHJcblx0Ly8gcmVzdWx0cyBmb3IgZ3JhcGhcclxuXHRsZXQgcGF5bWVudHMgPSBbXTtcclxuXHRsZXQgcHJlcGFpZCA9IHN1bSAvIDEwMCAqIHByZXBhaWRQZXJjZW50O1xyXG5cdGxldCB0b3RhbCA9ICctJztcclxuXHJcblx0aWYgKGNhbGN1bGF0b3JUeXBlID09PSAnaW5kaXZpZHVhbCcpIHtcclxuXHRcdHRvdGFsID0gcHJlcGFpZCArIGNvdW50UGF5bWVudC5jcmVkaXQgKiB0aW1lO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0b3RhbCA9IHByZXBhaWQgKyBjb3VudFBheW1lbnQubGVhc2luZyAqIHRpbWU7XHJcblx0fVxyXG5cclxuXHRmb3IgKGxldCBpID0gMTsgaSA8PSB0aW1lOyBpKyspIHtcclxuXHRcdGlmIChjYWxjdWxhdG9yVHlwZSA9PT0gJ2luZGl2aWR1YWwnKSB7XHJcblx0XHRcdHBheW1lbnRzLnB1c2goY291bnRQYXltZW50LmNyZWRpdCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwYXltZW50cy5wdXNoKGNvdW50UGF5bWVudC5sZWFzaW5nKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRwYXltZW50OiBjb3VudFBheW1lbnQsXHJcblx0XHRyYXRlOiByYXRlLFxyXG5cclxuXHRcdC8vIHRheCBkYXRhXHJcblx0XHR0YXhSZWZ1bmQ6IHRheFJlZnVuZCxcclxuXHRcdHRheEN1dHM6IHRheEN1dHMsXHJcblx0XHRyZXN1bHRUYXg6IHJlc3VsdFRheCxcclxuXHJcblx0XHQvLyBleHBlbnNlcyBhbmQgb3ZlcnBheW1lbnQgZGF0YVxyXG5cdFx0cmVzdWx0RXhwZW5zZXM6IGNvdW50UmVzdWx0RXhwZW5zZXMsXHJcblx0XHRvdmVycGF5bWVudDogY291bnRPdmVycGF5bWVudCxcclxuXHJcblx0XHQvLyB0b3RhbCBkYXRhXHJcblx0XHRmaW5hbmNlUmVzdWx0OiBmaW5hbmNlUmVzdWx0LFxyXG5cdFx0c2F2aW5nOiBzYXZpbmcsXHJcblx0XHRzYXZpbmdQZXJjZW50OiBzYXZpbmdQZXJjZW50LFxyXG5cclxuXHRcdC8vIHJlc3VsdHMgZm9yIGdyYXBoXHJcblx0XHR0aW1lOiB0aW1lLFxyXG5cdFx0cHJlcGFpZDogcHJlcGFpZCxcclxuXHRcdHBheW1lbnRzOiBwYXltZW50cyxcclxuXHRcdHRvdGFsOiB0b3RhbFxyXG5cdH07XHJcbn1cclxuXHJcbi8vIGNhbGN1bGF0aW9uIGZpbmFuY2UgcHJvZ3JhbXNcclxuZnVuY3Rpb24gc2Vhc29uYWxCdXNpbmVzc0NvdW50KHN1bSwgdGltZSwgcHJlcGFpZFBlcmNlbnQpIHtcclxuXHRjb25zdCBwZXJjZW50UmF0ZUxlYXNpbmcgPSAxNjtcclxuXHJcblx0bGV0IHBheW1lbnRzID0gW107XHJcblx0bGV0IHByZXBhaWQgPSBzdW0gLyAxMDAgKiBwcmVwYWlkUGVyY2VudDtcclxuXHRsZXQgcGF5bWVudCA9IGNvdW50UGF5bWVudExlYXNpbmcoc3VtLCBwcmVwYWlkLCB0aW1lLCBwZXJjZW50UmF0ZUxlYXNpbmcpO1xyXG5cdGxldCBtaW5QYXltZW50ID0gcGF5bWVudCAqIDAuNTtcclxuXHRsZXQgbWF4UGF5bWVudCA9IHBheW1lbnQgKiAxLjU7XHJcblx0bGV0IHRvdGFsID0gcHJlcGFpZCArIChtaW5QYXltZW50ICsgbWF4UGF5bWVudCkgKiB0aW1lIC8gMjtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gdGltZTsgaSsrKSB7XHJcblx0XHRpZiAoaSAlIDYgPiAwICYmIGkgJSA2IDwgNCkge1xyXG5cdFx0XHRwYXltZW50cy5wdXNoKG1pblBheW1lbnQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cGF5bWVudHMucHVzaChtYXhQYXltZW50KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHR0aW1lOiB0aW1lLFxyXG5cdFx0cHJlcGFpZDogcHJlcGFpZCxcclxuXHRcdHBheW1lbnRzOiBwYXltZW50cyxcclxuXHRcdHRvdGFsOiB0b3RhbFxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGluc3RhbGxtZW50Q291bnQoc3VtLCB0aW1lLCBwcmVwYWlkUGVyY2VudCkge1xyXG5cdGNvbnN0IHBlcmNlbnRSYXRlID0gMjg7XHJcblx0Y29uc3QgaW5zdGFsbG1lbnRNb3VudGggPSA2O1xyXG5cdGNvbnN0IGxhc3RQYXltZW50cyA9IDE4MDA7XHJcblx0Y29uc3QgcXR5TW91bnRoID0gMTI7XHJcblxyXG5cdGxldCBwYXltZW50cyA9IFtdO1xyXG5cdGxldCBwcmVwYWlkID0gc3VtIC8gMTAwICogcHJlcGFpZFBlcmNlbnQ7XHJcblx0bGV0IGZpcnN0UGF5bWVudHMgPSBjb3VudFBheW1lbnRMZWFzaW5nKHN1bSwgcHJlcGFpZCwgaW5zdGFsbG1lbnRNb3VudGgsIHBlcmNlbnRSYXRlKTtcclxuXHRsZXQgdG90YWwgPSBwcmVwYWlkICsgZmlyc3RQYXltZW50cyAqIGluc3RhbGxtZW50TW91bnRoICsgbGFzdFBheW1lbnRzICogKHF0eU1vdW50aCAtIGluc3RhbGxtZW50TW91bnRoKTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gcXR5TW91bnRoOyBpKyspIHtcclxuXHRcdGlmIChpIDw9IGluc3RhbGxtZW50TW91bnRoKSB7XHJcblx0XHRcdHBheW1lbnRzLnB1c2goZmlyc3RQYXltZW50cyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwYXltZW50cy5wdXNoKGxhc3RQYXltZW50cyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dGltZTogcXR5TW91bnRoLFxyXG5cdFx0cHJlcGFpZDogcHJlcGFpZCxcclxuXHRcdHBheW1lbnRzOiBwYXltZW50cyxcclxuXHRcdHRvdGFsOiB0b3RhbFxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGxlYXNpbmdIb2xpZGF5c0NvdW50KHN1bSwgdGltZSwgcHJlcGFpZFBlcmNlbnQsIHRpbWVIb2xpZGF5cykge1xyXG5cdGNvbnN0IHBlcmNlbnRSYXRlTGVhc2luZyA9IDE2O1xyXG5cclxuXHRsZXQgcGF5bWVudHMgPSBbXTtcclxuXHRsZXQgcHJlcGFpZCA9IHN1bSAvIDEwMCAqIHByZXBhaWRQZXJjZW50O1xyXG5cdGxldCBvbGRQYXltZW50ID0gY291bnRQYXltZW50TGVhc2luZyhzdW0sIHByZXBhaWQsIHRpbWUsIHBlcmNlbnRSYXRlTGVhc2luZyk7XHJcblx0bGV0IHBheW1lbnQgPSBvbGRQYXltZW50ICogdGltZSAvICh0aW1lIC0gdGltZUhvbGlkYXlzKTtcclxuXHRsZXQgdG90YWwgPSBwcmVwYWlkICsgcGF5bWVudCAqICh0aW1lIC0gdGltZUhvbGlkYXlzKTtcclxuXHJcblx0Zm9yIChsZXQgaSA9IDE7IGkgPD0gdGltZTsgaSsrKSB7XHJcblx0XHRpZiAoaSA8PSB0aW1lSG9saWRheXMpIHtcclxuXHRcdFx0cGF5bWVudHMucHVzaCgwKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHBheW1lbnRzLnB1c2gocGF5bWVudCk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dGltZTogdGltZSxcclxuXHRcdHByZXBhaWQ6IHByZXBhaWQsXHJcblx0XHRwYXltZW50czogcGF5bWVudHMsXHJcblx0XHR0b3RhbDogdG90YWxcclxuXHR9O1xyXG59XHJcblxyXG5mdW5jdGlvbiB2aWV3RmluYW5jZVRhYmxlKGNhbGN1bGF0b3IsIGRhdGEsIGlzSW5pdCkge1xyXG5cdGxldCB3cmFwVGFibGUgPSBjYWxjdWxhdG9yLmZpbmQoJy5qcy1maW5hbmNlLXRhYmxlLXJlc3VsdCcpO1xyXG5cdGxldCB0YWJsZSA9IHdyYXBUYWJsZS5maW5kKCdbZGF0YS1maW5hbmNlLWVsZW09XCJ0YWJsZVwiXScpO1xyXG5cclxuXHRmdW5jdGlvbiBpbnB1dERhdGFDZWxsKG5hbWUsIHZhbHVlLCBwZXJjZW50KSB7XHJcblx0XHR2YWx1ZSA9IHBlcmNlbnQgfHwgJC50cmltKHZhbHVlKSA9PT0gJycgPyB2YWx1ZSA6IHZhbHVlLnRvRml4ZWQoMCk7XHJcblxyXG5cdFx0aWYgKHBlcmNlbnQpIHtcclxuXHRcdFx0dGFibGUuZmluZCgnW2RhdGEtdGFibGUtY2VsbD1cIicrbmFtZSsnXCJdJykuaHRtbCh2YWx1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YWJsZS5maW5kKCdbZGF0YS10YWJsZS1jZWxsPVwiJytuYW1lKydcIl0nKS5odG1sKGdldFZhbHVlSW50KHZhbHVlKSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpbnB1dERhdGFDZWxsKCdsZWFzaW5nLXBheW1lbnQnLCBkYXRhLnBheW1lbnQubGVhc2luZyk7XHJcblxyXG5cdGlucHV0RGF0YUNlbGwoJ2xlYXNpbmctcmF0ZScsIGRhdGEucmF0ZS5sZWFzaW5nLCB0cnVlKTtcclxuXHJcblx0Ly8gdGF4IGRhdGFcclxuXHRpbnB1dERhdGFDZWxsKCdsZWFzaW5nLXRheC1yZWZ1bmQnLCBkYXRhLnRheFJlZnVuZC5sZWFzaW5nKTtcclxuXHJcblx0aW5wdXREYXRhQ2VsbCgnbGVhc2luZy10YXgtY3V0cycsIGRhdGEudGF4Q3V0cy5sZWFzaW5nKTtcclxuXHJcblx0aW5wdXREYXRhQ2VsbCgnbGVhc2luZy1yZXN1bHQtdGF4JywgZGF0YS5yZXN1bHRUYXgubGVhc2luZyk7XHJcblxyXG5cdC8vIGV4cGVuc2VzIGFuZCBvdmVycGF5bWVudCBkYXRhXHJcblx0aW5wdXREYXRhQ2VsbCgnbGVhc2luZy1yZXN1bHQtZXhwZW5zZXMnLCBkYXRhLnJlc3VsdEV4cGVuc2VzLmxlYXNpbmcpO1xyXG5cclxuXHRpbnB1dERhdGFDZWxsKCdsZWFzaW5nLXJlc3VsdC1vdmVycGF5bWVudCcsIGRhdGEub3ZlcnBheW1lbnQubGVhc2luZyk7XHJcblxyXG5cdC8vIHRvdGFsIGRhdGFcclxuXHRpbnB1dERhdGFDZWxsKCdsZWFzaW5nLXJlc3VsdCcsIGRhdGEuZmluYW5jZVJlc3VsdC5sZWFzaW5nKTtcclxuXHJcblx0aW5wdXREYXRhQ2VsbCgnbGVhc2luZy1zYXZpbmcnLCBkYXRhLnNhdmluZy5sZWFzaW5nKTtcclxuXHJcblx0aW5wdXREYXRhQ2VsbCgnbGVhc2luZy1zYXZpbmctcGVyY2VudCcsIGRhdGEuc2F2aW5nUGVyY2VudC5sZWFzaW5nLCB0cnVlKTtcclxuXHJcblx0IWlzSW5pdCAmJiB3cmFwVGFibGUuYWRkQ2xhc3MoJ29wZW4nKTtcclxuXHJcblx0Z2V0RmluYW5jZUNvbmRpdGlvbnMoKTtcclxuXHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaW5hbmNlQ29uZGl0aW9ucygkd3JhcFRhYmxlKXtcclxuXHRsZXQgJGNvbmRpdGlvblRhYmxlID0gJCgnLmpzLWZpbmFuY2UtY29uZGl0aW9uJyk7XHJcblx0bGV0ICRmaW5hbmNlRm9ybSA9ICQoJy5qcy1maW5hbmNlLWZvcm0nKTtcclxuXHRsZXQgcmVnZXhwID0gLyhcXHMrKS9nO1xyXG5cdGxldCBmaW5hbmNlQ29uZGl0aW9ucyA9ICcnO1xyXG5cclxuXHRsZXQgJHZhbHVlc0Zvcm0gPSAkKCcubGVhc2luZ0Zvcm1EYXRhX192YWx1ZScsICRmaW5hbmNlRm9ybSk7XHJcblx0aWYoJHZhbHVlc0Zvcm0ubGVuZ3RoKXtcclxuXHRcdCR2YWx1ZXNGb3JtLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0bGV0ICR0aCA9ICQodGhpcyk7XHJcblx0XHRcdGZpbmFuY2VDb25kaXRpb25zICs9ICR0aC5maW5kKFwiLmxlYXNpbmdGb3JtRGF0YV9fbmFtZVwiKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UocmVnZXhwLCAnICcpKyAnOiAnICtcclxuXHRcdFx0XHQkdGguZmluZChcIi5sZWFzaW5nRm9ybURhdGFfX2lucHV0XCIpLnZhbCgpLnRyaW0oKS5yZXBsYWNlKHJlZ2V4cCwgJyAnKSArXHJcblx0XHRcdFx0J1xcclxcbic7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGxldCAkdGxpbmUgPSAkY29uZGl0aW9uVGFibGUuZmluZCgnLnRsaW5lJyk7XHJcblx0aWYoJHRsaW5lLmxlbmd0aCl7XHJcblx0XHRsZXQgc2VjdENoZWNrcyA9ICQoJy5maW5hbmNlQ2FsY3VsYXRvcl9fc2VsZWN0aW9uX2NoZWNrYm94ZXMnLCAkY29uZGl0aW9uVGFibGUpO1xyXG5cdFx0aWYoc2VjdENoZWNrcy5sZW5ndGgpe1xyXG5cdFx0XHRmaW5hbmNlQ29uZGl0aW9ucyArPSAn0J3QsNC70L7Qs9C+0LLRi9C5INGA0LXQttC40Lw6ICc7XHJcblx0XHRcdGZpbmFuY2VDb25kaXRpb25zICs9ICQoJ2lucHV0OmNoZWNrZWQnLCBzZWN0Q2hlY2tzKS5wYXJlbnQoKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UocmVnZXhwLCAnICcpKyAnXFxyXFxuJztcclxuXHRcdH1cclxuXHRcdGZpbmFuY2VDb25kaXRpb25zICs9ICdcXHJcXG4nO1xyXG5cdFx0JHRsaW5lLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0ZmluYW5jZUNvbmRpdGlvbnMgKz0gJCh0aGlzKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UocmVnZXhwLCAnICcpICsgJ1xcclxcbic7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdCQoJy5qcy1sZWFzaW5nLWJ0bicsICRjb25kaXRpb25UYWJsZSkuYXR0cignZGF0YS1hdXRvbG9hZC1kZXRhaWwnLGZpbmFuY2VDb25kaXRpb25zKTtcclxuXHJcbn1cclxuXHJcbi8vIGNhbGN1bGF0aW9uIGZpbmFuY2VcclxuZnVuY3Rpb24gY2FsY3VsYXRpb25GaW5hbmNlKGNhbGN1bGF0b3IsIGlzSW5pdCkge1xyXG5cdGNvbnN0IGNhbGN1bGF0b3JUeXBlID0gY2FsY3VsYXRvci5wYXJlbnRzKCcuanMtZGlzY29udC1zZWN0aW9uJykuYXR0cignZGF0YS1kaXNjb250LXNlY3Rpb24tbmFtZScpLnRyaW0oKSB8fCAnZW50aXR5JztcclxuXHJcblx0bGV0IHN1bSA9ICtnZXROdW1iZXIoY2FsY3VsYXRvci5maW5kKCdpbnB1dFtuYW1lPVwiZmluYW5jZS1jYWxjLXN1bVwiXScpLnZhbCgpKTsgLy8g0KHRg9C80LzQsFxyXG5cdGxldCB0aW1lID0gK2dldE51bWJlcihjYWxjdWxhdG9yLmZpbmQoJ2lucHV0W25hbWU9XCJmaW5hbmNlLWNhbGMtdGltZVwiXScpLnZhbCgpKTsgLy8g0KHRgNC+0LpcclxuXHRsZXQgcHJlcGFpZCA9IGNhbGN1bGF0b3IuZmluZCgnaW5wdXRbbmFtZT1cImZpbmFuY2UtY2FsYy1wcmVwYWlkXCJdJykudmFsKCkuc3BsaXQoJy8nKTsgLy8g0JDQstCw0L3RgVxyXG5cdGxldCB0YXhSZWdpbWUgPSArZ2V0TnVtYmVyKGNhbGN1bGF0b3IuZmluZCgnaW5wdXRbbmFtZT1cImZpbmFuY2UtY2FsYy10YXgtcmVnaW1lXCJdOmNoZWNrZWQnKS52YWwoKSk7IC8vINCd0LDQu9C+0LPQvtCy0YvQuSDRgNC10LbQuNC8XHJcblxyXG5cdHByZXBhaWQgPSArZ2V0RmxvYXQocHJlcGFpZFsxXSB8fCBwcmVwYWlkWzBdKTtcclxuXHJcblx0bGV0IHJlc3VsdFN0YW5kYXJ0Q291bnQgPSBzdGFuZGFydENvdW50KHN1bSwgdGltZSwgcHJlcGFpZCwgdGF4UmVnaW1lLCBjYWxjdWxhdG9yVHlwZSk7XHJcblxyXG5cdHZpZXdGaW5hbmNlVGFibGUoY2FsY3VsYXRvciwgcmVzdWx0U3RhbmRhcnRDb3VudCwgaXNJbml0KTtcclxufVxyXG5cclxuLy8gaW5pdCBldmVudCBmaW5hbmNlIGNhbGN1bGF0aW9uXHJcbmZ1bmN0aW9uIGluaXRFdmVudHNGaW5hbmNlQ2FsY3VsYXRpb24oKSB7XHJcblx0aWYgKCEkKCcuanMtZmluYW5jZS1jYWxjdWxhdG9yJylbMF0pIHJldHVybiBmYWxzZTtcclxuXHJcblx0bGV0IHNsaWRlclJhbmdlcyA9ICQoJy5qcy1maW5hbmNlLWNhbGN1bGF0b3InKS5maW5kKCcuanMtcmFuZ2UtdmFsdWVzLXNlbGVjdGlvbicpO1xyXG5cdGxldCBjb3VudFVwZGF0ZVJhbmdlcyA9IDA7XHJcblxyXG5cdCQoJy5qcy1jb3VudC1maW5hbmNlLWNhbGN1bGF0b3InKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRjYWxjdWxhdGlvbkZpbmFuY2UoJCh0aGlzKS5wYXJlbnRzKCcuanMtZmluYW5jZS1jYWxjdWxhdG9yJykpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuanMtZmluYW5jZS1jYWxjdWxhdG9yIGlucHV0W3R5cGU9XCJyYWRpb1wiXScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcclxuXHRcdGNhbGN1bGF0aW9uRmluYW5jZSgkKHRoaXMpLnBhcmVudHMoJy5qcy1maW5hbmNlLWNhbGN1bGF0b3InKSk7XHJcblx0fSk7XHJcblxyXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc2xpZGVyUmFuZ2VzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRjb25zdCBzbGlkZXIgPSBzbGlkZXJSYW5nZXNbaV07XHJcblxyXG5cdFx0c2xpZGVyLm5vVWlTbGlkZXIub24oJ3VwZGF0ZScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb3VudFVwZGF0ZVJhbmdlcysrO1xyXG5cclxuXHRcdFx0aWYgKGNvdW50VXBkYXRlUmFuZ2VzID4gc2xpZGVyUmFuZ2VzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGNhbGN1bGF0aW9uRmluYW5jZSgkKHNsaWRlcikucGFyZW50cygnLmpzLWZpbmFuY2UtY2FsY3VsYXRvcicpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjYWxjdWxhdGlvbkZpbmFuY2UoJCgnLmpzLWZpbmFuY2UtY2FsY3VsYXRvcicpLCB0cnVlKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcblx0Ly8gaW5pdCBmaW5hbmNlIHRhYmxlXHJcblx0aW5pdEZpbmFuY2VUYWJsZSgnLmpzLWZpbmFuY2UtdGFibGUnKTtcclxuXHJcblx0Ly8gaW5pdCBmaW5hbmNlIGNhbGN1bGF0b3JcclxuXHRpbml0RmluYW5jZUNhbGN1bGF0b3IoKTtcclxuXHJcblx0Ly8gaW5pdCBldmVudCBmaW5hbmNlIGNhbGN1bGF0aW9uXHJcblx0aW5pdEV2ZW50c0ZpbmFuY2VDYWxjdWxhdGlvbigpO1xyXG59KTtcclxuXHJcbi8vIGNvbnRyb2wgcG9wdXBzIGluZm8gLSDRg9C/0YDQsNCy0LvQtdC90LjQtSDQv9C+0L/QsNC/0LDQvNC4INGBINC40L3RhNC+0YDQvNCw0YbQuNC10Lkg0L4g0LvQuNC30LjQvdCz0LVcclxuZnVuY3Rpb24gcG9zaXRpb25JbmZvUG9wdXAobGluaywgaW5zaWRlQ2xvbmUpIHtcclxuICAgIC8vIGxldCBwb3B1cCA9ICQobGluaykuZmluZCgnLmpzLWluZm8tcG9wdXAtaW5zaWRlJyk7XHJcbiAgICBsZXQgd2lkdGhQYWdlID0gJChkb2N1bWVudCkub3V0ZXJXaWR0aCgpO1xyXG4gICAgbGV0IHdpZHRoTGluayA9ICQobGluaykub3V0ZXJXaWR0aCgpO1xyXG4gICAgbGV0IGhlaWdodExpbmsgPSAkKGxpbmspLm91dGVySGVpZ2h0KCk7XHJcbiAgICAvLyBsZXQgd2lkdGhQb3B1cCA9IHdpZHRoUGFnZSA+PSA0ODAgPyAzODAgOiAzMjA7XHJcbiAgICBsZXQgdG9wID0gJChsaW5rKS5vZmZzZXQoKS50b3AgKyBoZWlnaHRMaW5rICsgNTtcclxuICAgIGxldCBsZWZ0ID0gJChsaW5rKS5vZmZzZXQoKS5sZWZ0O1xyXG5cclxuICAgIGluc2lkZUNsb25lLmNzcyh7XCJ0b3BcIjowLCBcImxlZnRcIjowfSkuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHJcbiAgICBsZXQgd2lkdGhQb3B1cCA9IGluc2lkZUNsb25lLm91dGVyV2lkdGgoKTtcclxuICAgIGxldCBtYXhSaWdodCA9IGxlZnQgKyB3aWR0aFBvcHVwO1xyXG4gICAgbGV0IG1heExlZnQgPSBsZWZ0ICsgd2lkdGhMaW5rIC0gd2lkdGhQb3B1cDtcclxuICAgIC8qY29uc29sZS5sb2cobGluayk7XHJcbiAgICBjb25zb2xlLmxvZygnd2lkdGhMaW5rOicrd2lkdGhMaW5rKTtcclxuICAgIGNvbnNvbGUubG9nKCdsZWZ0OicrbGVmdCk7XHJcbiAgICBjb25zb2xlLmxvZygnd2lkdGhQb3B1cDonK3dpZHRoUG9wdXApO1xyXG4gICAgY29uc29sZS5sb2coJ21heFJpZ2h0OicrbWF4UmlnaHQpO1xyXG4gICAgY29uc29sZS5sb2coJ3dpZHRoUGFnZTonK3dpZHRoUGFnZSk7XHJcbiAgICBjb25zb2xlLmxvZygnbWF4TGVmdDonICsgbWF4TGVmdCk7Ki9cclxuICAgIGlmIChtYXhSaWdodCA+IHdpZHRoUGFnZSAmJiBtYXhMZWZ0IDwgMCkge1xyXG4gICAgICAgIGluc2lkZUNsb25lLnJlbW92ZUNsYXNzKCdpbmZvUG9wdXBfX2luc2lkZV9sZWZ0JykuYWRkQ2xhc3MoJ2luZm9Qb3B1cF9faW5zaWRlX2NlbnRlcicpO1xyXG4gICAgICAgIGxlZnQgPSAnNTAlJztcclxuICAgIH0gZWxzZSBpZiAobWF4UmlnaHQgPiB3aWR0aFBhZ2UpIHtcclxuICAgICAgICBpbnNpZGVDbG9uZS5yZW1vdmVDbGFzcygnaW5mb1BvcHVwX19pbnNpZGVfY2VudGVyJykuYWRkQ2xhc3MoJ2luZm9Qb3B1cF9faW5zaWRlX2xlZnQnKTtcclxuICAgICAgICBsZWZ0ID0gbGVmdCArIHdpZHRoTGluaztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5zaWRlQ2xvbmUucmVtb3ZlQ2xhc3MoJ2luZm9Qb3B1cF9faW5zaWRlX2NlbnRlcicpLnJlbW92ZUNsYXNzKCdpbmZvUG9wdXBfX2luc2lkZV9sZWZ0Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5zaWRlQ2xvbmUuY3NzKHtcInRvcFwiOnRvcCwgXCJsZWZ0XCI6bGVmdH0pO1xyXG5cclxuICAgIC8vIHJldHVybiBpbnNpZGVDbG9uZTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9nZ2xlQWR2SW5mbyhidG4sIGNsb3NlKSB7XHJcbiAgICBsZXQgYmxvY2sgPSBidG4ucGFyZW50cygnLmpzLWluZm8tcG9wdXAnKTtcclxuICAgIGxldCBpbnNpZGUgPSBibG9jay5maW5kKCcuanMtaW5mby1wb3B1cC1pbnNpZGUnKTtcclxuICAgIGxldCBpbnNpZGVDbG9uZSA9IGluc2lkZS5jbG9uZSgpO1xyXG5cclxuICAgIGlmICghYmxvY2suaGFzQ2xhc3MoJ29wZW4nKSAmJiAhY2xvc2UpIHtcclxuICAgICAgICAkKCcuanMtaW5mby1wb3B1cC5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAkKCcuanMtaW5mby1wb3B1cC1pbnNpZGUub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJykuc2xpZGVVcCgyMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHBvc2l0aW9uSW5mb1BvcHVwKGJsb2NrLCBpbnNpZGVDbG9uZSk7XHJcbiAgICAgICAgYmxvY2suYWRkQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICBpbnNpZGVDbG9uZS5hZGRDbGFzcygnb3BlbicpLnNsaWRlRG93bigyMDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkKCcuanMtaW5mby1wb3B1cC5vcGVuJykucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcclxuICAgICAgICAkKCcuanMtaW5mby1wb3B1cC1pbnNpZGUub3BlbicpLnJlbW92ZUNsYXNzKCdvcGVuJykuc2xpZGVVcCgyMDAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b2dnbGVBZHZJbmZvTW9iaWxlKGJ0bikge1xyXG4gICAgaWYgKGJ0bi5oYXNDbGFzcygnb3BlbicpKSB7XHJcbiAgICAgICAgYnRuLnJlbW92ZUNsYXNzKCdvcGVuJykuc2libGluZ3MoJy5qcy1pbmZvLXBvcHVwJykuc2xpZGVVcCgyMDApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICAkKCcuanMtaW5mby1jb250cm9sLm9wZW4nKS5yZW1vdmVDbGFzcygnb3BlbicpLnNpYmxpbmdzKCcuanMtaW5mby1wb3B1cCcpLnNsaWRlVXAoMjAwKTtcclxuICAgICAgICBidG4uYWRkQ2xhc3MoJ29wZW4nKS5zaWJsaW5ncygnLmpzLWluZm8tcG9wdXAnKS5zbGlkZURvd24oMjAwKTtcclxuICAgIH1cclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAvLyBldmVudHMgaW5mbyBwb3B1cFxyXG4gICAgJCgnLmpzLWluZm8tcG9wdXAnKS5hZGRDbGFzcygnaW5pdGlhbGl6ZWQnKTtcclxuICAgICQoJy5qcy1pbmZvLXBvcHVwLWluc2lkZScpLmFkZENsYXNzKCdpbml0aWFsaXplZCcpO1xyXG5cclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcuanMtaW5mby1wb3B1cC1saW5rJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0b2dnbGVBZHZJbmZvKCQodGhpcykpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1pbmZvLXBvcHVwLWNsb3NlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB0b2dnbGVBZHZJbmZvKCQodGhpcyksIHRydWUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgJy5qcy1pbmZvLWNvbnRyb2wnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHRvZ2dsZUFkdkluZm9Nb2JpbGUoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBldmVudCBjbGljayBvdXRzaWRlIGVsZW1lbnRcclxuICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICQoJy5qcy1pbmZvLXBvcHVwLWluc2lkZS5vcGVuJylbMF0gJiZcclxuICAgICAgICAgICAgISQoZS50YXJnZXQpLmhhc0NsYXNzKCdqcy1pbmZvLXBvcHVwLWluc2lkZScpICYmXHJcbiAgICAgICAgICAgICEkKGUudGFyZ2V0KS5wYXJlbnRzKCcuanMtaW5mby1wb3B1cC1pbnNpZGUnKVswXSAmJlxyXG4gICAgICAgICAgICAhJChlLnRhcmdldCkuaGFzQ2xhc3MoJ2pzLWluZm8tcG9wdXAnKSAmJlxyXG4gICAgICAgICAgICAhJChlLnRhcmdldCkucGFyZW50cygnLmpzLWluZm8tcG9wdXAnKVswXVxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBsZXQgaW5mb1BvcHVwcyA9ICQoJy5qcy1pbmZvLXBvcHVwLm9wZW4nKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvUG9wdXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gJChpbmZvUG9wdXBzW2ldKS5maW5kKCcuanMtaW5mby1wb3B1cC1saW5rJyk7XHJcbiAgICAgICAgICAgICAgICB0b2dnbGVBZHZJbmZvKGl0ZW0sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn0pOyJdLCJmaWxlIjoidmVuZG9yL2NhbGN1bGF0b3IuanMifQ==
