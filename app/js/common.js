var debugTimes = false;

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
    }
}

function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}

document.addEventListener("DOMContentLoaded", function (event) {

    initSmoothScrolling();
    // Разворот текста
    var bindExpandService = function (block) {
        var button = block.querySelector('.js-more-btn');
        var strService = block.querySelector('.js-service-text')
        block.classList.add('is-hidden');

        if(strService !== null){
            var strLength = strService.scrollHeight;
            
            if(strLength < 200){
                block.classList.add('is-button-hide');
                block.classList.remove('is-hidden');
            }
        }

        button.addEventListener('click', function () {
            block.classList.toggle('is-hidden');
            if (button.innerText.toLowerCase() === 'развернуть') {
                button.innerText = 'Свернуть';
            } else {
                button.innerText = 'Развернуть';
            }
        })
    }

    
    var blocksService = document.querySelectorAll('.js-hidden-container');

    if (blocksService.length) {
        for (var i = 0; i < blocksService.length; i += 1) {
            bindExpandService(blocksService[i]);
        }
    }

    // Табы
    function tab() {
        var tabNav = document.querySelectorAll('.product__tab-btn'),
            tabContent = document.querySelectorAll('.characteristics'),
            popupTitle = document.querySelector('.js-popup-title'),
            productBtn = document.querySelector('.js-product-button'),
            inputProductTitle = document.getElementById('product_title'),
            inputProduct = document.getElementById('product_id'),
            tabId,
            tabDataText;

            tabNav.forEach(function(item){
                item.addEventListener('click', selectTabNav);
            })

            function selectTabNav() {

                if(!this.classList.contains('is-active')){
                    tabNav.forEach(function(item){
                        item.classList.remove('is-active');
                    });
                }
                
                this.classList.add('is-active');

                if(screen.width < 768){
                    var tabOffsetTop = this.getBoundingClientRect().top

                    window.scrollBy({
                        top: tabOffsetTop
                    })

                    setTimeout(function(){

                        window.scrollBy({
                            top: -60
                        })
                    }, 0)
                }

                tabId = this.getAttribute('data-id');
                tabDataText = this.getAttribute('data-text');
                productBtn.textContent = tabDataText
                selectTabContent(tabId);
                inputProductTitle.setAttribute('value', tabDataText)
                inputProduct.setAttribute('value', 'EcoWood' + ' ' + tabId)

                if(tabDataText == "Получить предложение"){
                    popupTitle.textContent = "Получить КП на EcoWood" + " " + tabId
                }else{
                    popupTitle.textContent = "Узнать цену на EcoWood" + " " + tabId
                }
                
            }

            function selectTabContent(tabName) {
                tabContent.forEach(function(item){
                    var tabContentId = item.getAttribute('id');

                    if(tabName == tabContentId){
                        item.classList.add('is-active');
                    }else{
                        item.classList.remove('is-active');
                    }
                });
                
            }
    };

    tab();

    // Фиксирование шапки и отображение кнопки наверх
    var buttonUp = document.querySelector('.button-up')

    window.addEventListener('scroll', function(e){
        var pageScrollTop = window.pageYOffset;
        var header = document.querySelector('.header');
        var headerHeight = header.clientHeight + 40;

        if(pageScrollTop >= headerHeight){
            header.classList.add('is-fixed');
        }else{
            header.classList.remove('is-fixed');
        }

        var scrolled = window.pageYOffset || document.documentElement.scrollTop;

        if (scrolled > 700) {
            buttonUp.classList.add('is-show');
        } else {
            buttonUp.classList.remove('is-show');
        }
    })

    // Показать больше продуктов

    var buttonMoreService = document.querySelectorAll('.button-more--element');

    buttonMoreService.forEach(function(item){
        var curBtn = item

        curBtn.addEventListener('click', function(e){
            var activeBlock = this.closest('.js-parent')
            activeBlock.classList.toggle('is-active');

            if (curBtn.innerText.toLowerCase() === 'показать еще' || curBtn.innerText.toLowerCase() === 'другие модели') {
                curBtn.innerText = 'Скрыть';
            } else {
                var btnText = curBtn.getAttribute('data-text-btn')
                curBtn.innerText = btnText

                if(btnText !== 'Другие модели'){
                    
                    window.scrollTo({
                        top: activeBlock.offsetTop
                    })
                }
            }
        })
    })

    // Мобильное меню
    var body = document.querySelector('body');
    var burger = document.querySelector('.js-burg');
    var headerMenu = document.querySelector('.header__nav');
    var wrapper = document.querySelector('.wrapper');
    var headerMenuLink = document.querySelectorAll('.header__nav-link');
    var closeMenuBtn = document.querySelector('.js-close-menu')
    var closeCatalogBtn = document.querySelector('.js-close-catalog')
    var catalog = document.querySelector('.catalog__dropdown')
    var catalogBtn = document.querySelector('.catalog__btn')


    burger.addEventListener('click', function(){

        if(!this.classList.contains('active')){
            headerMenu.classList.add('is-active');
            body.classList.add('body--opened');
            wrapper.classList.add('overlay')
            
        }else{
            headerMenu.classList.remove('is-active');
            body.classList.remove('body--opened');
            wrapper.classList.remove('overlay')
        }
    })

    closeMenuBtn.addEventListener('click', function(){
        body.classList.remove('is-hidden');
        body.classList.remove('body--opened');
        wrapper.classList.remove('overlay');
        headerMenu.classList.remove('is-active');
    })

    closeCatalogBtn.addEventListener('click', function(){
        catalog.classList.remove('active');
        catalogBtn.classList.remove('active');
    })

    for(var i = 0; i < headerMenuLink.length; i++){

        var linkItem = headerMenuLink[i];

        linkItem.addEventListener('click', function(e){

            var header = document.querySelector('.header__inner')

            if(headerMenu.classList.contains('is-active')){
                headerMenu.classList.remove('is-active');
                burger.classList.remove('active');
                wrapper.classList.remove('overlay');
                body.classList.remove('is-hidden');
                header.classList.remove('is-color');
            }

        });
    }

    // Меняет разметку табов на мобильном разрешении
    if(screen.width <= 767){
        
        var productTab = document.querySelectorAll('.product__tab-item')
        
        productTab.forEach(function(item){

            var tabItem = item
            var tabBtnId = tabItem.querySelector('.product__tab-btn')
            var tabItemId = tabBtnId.getAttribute('data-id')
            var tableItem = document.getElementById(tabItemId)

            tabItem.append(tableItem)
        })
    }

    var galleryThumbs = new Swiper('.detail-slider-thumbs', {
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        touchRatio: 0,
        navigation: {
            nextEl: '.detail-slider__arrow--next',
            prevEl: '.detail-slider__arrow--prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 15
            },
            350: {
                slidesPerView: 2,
            },
            470: {
                slidesPerView: 3,
                spaceBetween: 35
            }
        }
    });

    var gallery = new Swiper('.detail-slider-top', {
        spaceBetween: 10,
        thumbs: {
            swiper: galleryThumbs
        }
    });

    // табы в карточке товара
    var tabButtons = _toConsumableArray(document.querySelectorAll('.detail-tabs__button'));
    var tabContents = _toConsumableArray(document.querySelectorAll('.detail-tabs__tab'));

    for (var j = 0; j < tabButtons.length; j += 1) {
        if (j === 0) {
            tabButtons[j].classList.add('detail-tabs__button_active');
        }

        tabButtons[j].addEventListener('click', function (e) {
            e.preventDefault();
            var target = e.target.getAttribute('href');
            var current = document.querySelector('.detail-tabs__tab_active');
            current.classList.remove('detail-tabs__tab_active');
            current.classList.add('detail-tabs__tab_hidden');
            var newActive = document.querySelector(target);
            newActive.classList.add('detail-tabs__tab_active');
            newActive.classList.remove('detail-tabs__tab_hidden');

            document.querySelector('.detail-tabs__button_active').classList.remove('detail-tabs__button_active');
            document.querySelector('.detail-tabs__button_preactive') && document.querySelector('.detail-tabs__button_preactive').classList.remove('detail-tabs__button_preactive');
            e.target.classList.add('detail-tabs__button_active');
            e.target.previousElementSibling && e.target.previousElementSibling.classList.add('detail-tabs__button_preactive');
        })
    }

    for (var k = 0; k < tabContents.length; k += 1) {
        if (k !== 0) {
            tabContents[k].classList.add('detail-tabs__tab_hidden');
        } else {
            tabContents[k].classList.add('detail-tabs__tab_active');
        }
    }

    @@include('vendor/smoothScroll.js')
    @@include('../components/popup/popup.js')
});

function submitFormHandler(form, values, ajax){
    var $form = $(form);
    var thanksPopup = $form.closest(".js-popup");
    var href = ($form.attr('action')!== '#' && $form.attr('action') !== '')? $form.attr('action') : '/ajax/';
    $.ajax({
        url: href,
        type: 'post',
        data: $form.serializeArray(),
        success: function (data) {
            //console.log(data);
            if(data.status === "success"){

                $('input[type=text],input[type=tel],input[type=email]', $form).val('');
                if($form.hasClass('js-rewrite')){
                    $form.html('<div class=" is-' + data.status + ' js-mess">' + data.message + '</div>');

                }else if($form.hasClass('js-success-form')){
                    var activePopup = document.querySelector('.popup.open');
                    var successPopup = document.querySelector('.js-popup-success');
                    activePopup.classList.remove('open')
                    successPopup.classList.add('open')
                }else if( typeof data.data !== 'undefined' && (data.data.title || data.data.content) ){
                    if(data.data.title){
                        thanksPopup.find('.js-title').html(data.data.title)
                    }
                    if(data.data.content){
                        thanksPopup.find('.js-content').html(data.data.content)
                    }
                }
            }else{
                $form.append('<div class=" is-' + data.status + ' js-mess">' + data.message + '</div>');
            }
        }
    });

}

function initCompareTable(items, spcifications) {
    let $items = $(items);
    if (!$items[0]) return false;

    let responsive = [
        {
            breakpoint: 0,
            settings: {
                columns: 1,
                duplicate: 'in'
            }
        },
        {
            breakpoint: 480,
            settings: {
                columns: 2,
                duplicate: 'in'
            }
        },
        {
            breakpoint: 600,
            settings: {
                columns: 3,
                duplicate: 'in'
            }
        },
        {
            breakpoint: 768,
            settings: {
                columns: 4,
                duplicate: 'in'
            }
        },
        {
            breakpoint: 992,
            settings: {
                columns: 4,
                duplicate: 'out'
            }
        },
        {
            breakpoint: 1280,
            settings: {
                columns: 5,
                duplicate: 'out'
            }
        },
    ];

    if (spcifications) {
        responsive = [
            {
                breakpoint: 0,
                settings: {
                    columns: 1,
                }
            },
            {
                breakpoint: 600,
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
            {
                breakpoint: 992,
                settings: {
                    columns: 3,
                }
            },
            {
                breakpoint: 1280,
                settings: {
                    columns: 7,
                }
            },
        ];
    }

    for (let i = 0; i < $items.length; i++) {
        const item = $($items[i]);

        item.compareTable({
            sort: true,
            prev: '<svg width="10" height="10"><use xlink:href="'+((item.data('arrow'))?item.data('arrow'):'/assets/images/sprite.svg#arrow')+'"></use></svg>',
            next: '<svg width="10" height="10"><use xlink:href="'+((item.data('arrow'))?item.data('arrow'):'/assets/images/sprite.svg#arrow')+'"></use></svg>',
            folding: true,
            lines: 10,
            responsive: responsive,
        });
    }
}

@@include('vendor/polyfill.js')

$(document).ready(function(){
    initCompareTable('.js-table-props');
	initCompareTable('.js-compare-table', true);
    
    $('.footer__catalog-btn').on('click', function(){
        $(this).toggleClass('active')
        $('.footer__catalog-dropdown').stop().slideToggle()
    })

    $('.catalog__btn').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active')
        $('.catalog__dropdown').toggleClass('active')
    })

    var catalogItem = document.querySelectorAll('.js-catalog-item');
    var catalogContainer = document.querySelector('.js-catalog-container');


    var moveElement = function (item) {
        if(catalogContainer){
            var clonedElement = item.cloneNode(true);
            catalogContainer.append(clonedElement);
        }
    };
    

    for(var i = 0; i < catalogItem.length; i++){
        catalogEl = catalogItem[i];
        moveElement(catalogEl);
    }

    

    function moveCatalogOnMenu () {
        var catalog = $('.catalog')
        var headerNav = $('.header__nav')
        var headerMenuMobile = $('.header__menu')

        if(window.matchMedia('(max-width: 768px)').matches){
            headerNav.prepend(catalog)
        }
    }

    moveCatalogOnMenu();

    $('.header__nav-item a').on('click', function(){
        if($('body').hasClass('body--opened')){
            $('body').removeClass('body--opened')
        }
    })
    
})