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
            
            if(strLength < 500){
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

    function initSmoothScrolling() {
  
      var duration = 800;

      var pageUrl = location.hash ?
        stripHash(location.href) :
        location.href;

      // delegatedLinkHijacking();
      directLinkHijacking();

      function delegatedLinkHijacking() {
        document.body.addEventListener('click', onClick, false);

        function onClick(e) {
          if (!isInPageLink(e.target))
            return;

          e.stopPropagation();
          e.preventDefault();

          jump(e.target.hash, {
            duration: duration,
            callback: function() {
              setFocus(e.target.hash);
            }
          });
        }
      }

      function directLinkHijacking() {
        [].slice.call(document.querySelectorAll('a'))
          .filter(isInPageLink)
          .forEach(function(a) {
            a.addEventListener('click', onClick, false);
          });

        function onClick(e) {
          e.stopPropagation();
          e.preventDefault();

          jump(e.target.hash, {
            duration: duration,
          });
        }

      }

      function isInPageLink(n) {
        return n.tagName.toLowerCase() === 'a' &&
          n.hash.length > 0 &&
          stripHash(n.href) === pageUrl;
      }

      function stripHash(url) {
        return url.slice(0, url.lastIndexOf('#'));
      }

      function setFocus(hash) {
        var element = document.getElementById(hash.substring(1));

        if (element) {
          if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
            element.tabIndex = -1;
          }

          element.focus();
        }
      }

    }

    function jump(target, options) {
      var
        start = window.pageYOffset,
        opt = {
          duration: options.duration,
          offset: options.offset || 0,
          callback: options.callback,
          easing: options.easing || easeInOutQuad
        },
        distance = typeof target === 'string' ?
        opt.offset + document.querySelector(target).getBoundingClientRect().top - 126 :
        target,
        duration = typeof opt.duration === 'function' ?
        opt.duration(distance) :
        opt.duration,
        timeStart, timeElapsed;

      requestAnimationFrame(function(time) {
        timeStart = time;
        loop(time);
      });

      function loop(time) {
        timeElapsed = time - timeStart;

        window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

        if (timeElapsed < duration)
          requestAnimationFrame(loop)
        else
          end();
      }

      function end() {
        window.scrollTo(0, start + distance);

        if (typeof opt.callback === 'function')
          opt.callback();
      }

      function easeInOutQuad(t, b, c, d) {
        t /= d / 2
        if (t < 1) return c / 2 * t * t + b
        t--
        return -c / 2 * (t * (t - 2) - 1) + b
      }

    }
    // функционал вызова и закрытия модального окна
    var   popupLink = document.querySelectorAll('.js-popup-show'),
       popupClose = document.querySelectorAll('.js-close');
    body = document.querySelector('body');
    html = document.querySelector('html');
    lockPadding = document.querySelectorAll('.lock-padding');
    unlock = true
    timeOut = 400;

    (function($){
        $(function(){
            $(document).on("click",'.js-popup-show', function (e) {
                const link = this;
                const linkId = this.getAttribute('data-content');
                var fileId = this.getAttribute('data-file');
                const popupElement = document.querySelector('' + linkId);
                const ajaxLink = this.getAttribute('data-ajax');

                const params  = {};
                $.each(link.attributes, function(index, attr) {
                    if(/^data\-param\-(.+)$/.test(attr.nodeName)){
                        let key = attr.nodeName.match(/^data\-param\-(.+)$/)[1];
                        params[key.toUpperCase()] = $(link).data('param-'+key);
                    }
                });


                if(ajaxLink){
                    $.ajax({
                        url: ajaxLink,
                        data: params
                    }).done(function(data){
                        const $contentBox = $(popupElement).find('.js-popup-content');
                        if(data.status){
                            if(data.status === 'success'){
                                $contentBox.html(data.message)
                            }else{
                                $contentBox.html(data.message)
                                console.warn(data);
                            }
                        }else{
                            $contentBox.html(data)
                        }


                        setTimeout(() => {
                            $.each(link.attributes, function(index, attr) {
                                if(/^data\-autoload\-(.+)$/.test(attr.nodeName)){
                                    let key = attr.nodeName.match(/^data\-autoload\-(.+)$/)[1];
                                    let parName = 'PROPERTY['+key.toUpperCase()+']';
                                    let el = $('input[name="'+parName+'"],textarea[name="'+parName+'"]');
                                    if(el.length){
                                        el.val($(link).data('autoload-'+key))
                                    }
                                }
                            });
                        },300)


                        popupOpen(popupElement,fileId)
                    });
                }else{
                    popupOpen(popupElement,fileId)
                }
                e.preventDefault()
            })
        });
    })(jQuery);

    if (popupClose.length > 0) {

        for (let i = 0; i < popupClose.length; i++) {
            let popupCloseElement = popupClose[i]

            popupCloseElement.addEventListener("click", function (e) {
                popupOnClose(this.closest('.popup'), true)
                e.preventDefault()
            })
        }
    }

    function popupOpenByID(linkId, html) {
        let popupElement = document.querySelector('' + linkId);
        if(popupElement){
            let $contentBox = $(popupElement).find('.js-popup-content');
            $contentBox.html(html);
            popupOpen(popupElement);
        }
    }

    function popupOpen(curentPopup, fileId) {

        if (curentPopup && unlock) {

            var popupActive = document.querySelector('.popup.open');

            if (popupActive) {
                popupOnClose(popupActive, false);
            } else {
                bodyLock();
            }

            curentPopup.classList.add('open')

            if(fileId){
                var imgContainer = curentPopup.querySelector('.popup__content--project')
                var imgEl = document.createElement('img')
                imgEl.setAttribute('src',  fileId )
                imgContainer.append(imgEl)
            }
            curentPopup.addEventListener('click', function (e) {
                if (!e.target.closest('.popup__content')) {
                    popupOnClose(e.target.closest('.popup'), true)
                }
            })
        }
    }

    function bodyLock() {
        var lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + "px";
        if (lockPadding.length > 0) {

            for (var i = 0; i < lockPadding.length; i++) {
                var lockPaddingEl = lockPadding[i]
                lockPaddingEl.style.paddingRight = lockPaddingValue
            }
        }
        body.style.paddingRight = lockPaddingValue
        body.classList.add('is-hidden')
        buttonUp.style.opacity = 0

        unlock = false

        setTimeout(function () {
            unlock = true
        }, timeOut)

    }

    function bodyUnLock() {

        setTimeout(function () {
            for (var i = 0; i < lockPadding.length; i++) {
                var lockPaddingEl = lockPadding[i]
                lockPaddingEl.style.paddingRight = '0px'
            }

            body.style.paddingRight = '0px'
            body.classList.remove('is-hidden')
            buttonUp.style.opacity = 1

        }, timeOut)

        unlock = false

        setTimeout(function () {
            unlock = true
        }, timeOut)
    }

    function popupOnClose(popupActive, doUnlock) {

        var imgActive = popupActive.getElementsByTagName('img')

        if(imgActive.length){

            setTimeout(function(){
                imgActive[0].remove()
            }, 400)
        
        }

        if (unlock) {
            popupActive.classList.remove('open');

            if (doUnlock) {
                bodyUnLock();
            }
        }
    }
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

(function (arr) {

    // проверяем поддержку matches
    if (!Element.prototype.matches) {

        // определяем свойство
        Element.prototype.matches = Element.prototype.matchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector;

    }

    // проверяем поддержку closest
    if (!Element.prototype.closest) {

        // реализуем
        Element.prototype.closest = function (css) {
            var node = this;

            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }

    if ('NodeList' in window && !NodeList.prototype.forEach) {
        console.info('polyfill for IE11');
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    arr.forEach(function (item) {
        if (item.hasOwnProperty('append')) {
            return;
        }
        Object.defineProperty(item, 'append', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function append() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function (argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.appendChild(docFrag);
            }
        });
    });

})([Element.prototype, Document.prototype, DocumentFragment.prototype]);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGRlYnVnVGltZXMgPSBmYWxzZTtcclxuXHJcbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcclxuICAgIHJldHVybiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB8fCBfaXRlcmFibGVUb0FycmF5KGFycikgfHwgX25vbkl0ZXJhYmxlU3ByZWFkKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTsgaSA8IGFyci5sZW5ndGg7IGkrKykgYXJyMltpXSA9IGFycltpXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFycjI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xyXG4gICAgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoaXRlcikgfHwgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGl0ZXIpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTtcclxufVxyXG5cclxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpO1xyXG59XHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHJcbiAgICBpbml0U21vb3RoU2Nyb2xsaW5nKCk7XHJcbiAgICAvLyDQoNCw0LfQstC+0YDQvtGCINGC0LXQutGB0YLQsFxyXG4gICAgdmFyIGJpbmRFeHBhbmRTZXJ2aWNlID0gZnVuY3Rpb24gKGJsb2NrKSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGJsb2NrLnF1ZXJ5U2VsZWN0b3IoJy5qcy1tb3JlLWJ0bicpO1xyXG4gICAgICAgIHZhciBzdHJTZXJ2aWNlID0gYmxvY2sucXVlcnlTZWxlY3RvcignLmpzLXNlcnZpY2UtdGV4dCcpXHJcbiAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZCgnaXMtaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIGlmKHN0clNlcnZpY2UgIT09IG51bGwpe1xyXG4gICAgICAgICAgICB2YXIgc3RyTGVuZ3RoID0gc3RyU2VydmljZS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZihzdHJMZW5ndGggPCA1MDApe1xyXG4gICAgICAgICAgICAgICAgYmxvY2suY2xhc3NMaXN0LmFkZCgnaXMtYnV0dG9uLWhpZGUnKTtcclxuICAgICAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWhpZGRlbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGJsb2NrLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWhpZGRlbicpO1xyXG4gICAgICAgICAgICBpZiAoYnV0dG9uLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpID09PSAn0YDQsNC30LLQtdGA0L3Rg9GC0YwnKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b24uaW5uZXJUZXh0ID0gJ9Ch0LLQtdGA0L3Rg9GC0YwnO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uLmlubmVyVGV4dCA9ICfQoNCw0LfQstC10YDQvdGD0YLRjCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgdmFyIGJsb2Nrc1NlcnZpY2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtaGlkZGVuLWNvbnRhaW5lcicpO1xyXG5cclxuICAgIGlmIChibG9ja3NTZXJ2aWNlLmxlbmd0aCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYmxvY2tzU2VydmljZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICBiaW5kRXhwYW5kU2VydmljZShibG9ja3NTZXJ2aWNlW2ldKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8g0KLQsNCx0YtcclxuICAgIGZ1bmN0aW9uIHRhYigpIHtcclxuICAgICAgICB2YXIgdGFiTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnByb2R1Y3RfX3RhYi1idG4nKSxcclxuICAgICAgICAgICAgdGFiQ29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGFyYWN0ZXJpc3RpY3MnKSxcclxuICAgICAgICAgICAgcG9wdXBUaXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wb3B1cC10aXRsZScpLFxyXG4gICAgICAgICAgICBwcm9kdWN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXByb2R1Y3QtYnV0dG9uJyksXHJcbiAgICAgICAgICAgIGlucHV0UHJvZHVjdFRpdGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3RfdGl0bGUnKSxcclxuICAgICAgICAgICAgaW5wdXRQcm9kdWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Byb2R1Y3RfaWQnKSxcclxuICAgICAgICAgICAgdGFiSWQsXHJcbiAgICAgICAgICAgIHRhYkRhdGFUZXh0O1xyXG5cclxuICAgICAgICAgICAgdGFiTmF2LmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZWN0VGFiTmF2KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNlbGVjdFRhYk5hdigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpKXtcclxuICAgICAgICAgICAgICAgICAgICB0YWJOYXYuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihzY3JlZW4ud2lkdGggPCA3Njgpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWJPZmZzZXRUb3AgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IHRhYk9mZnNldFRvcFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxCeSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b3A6IC02MFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDApXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGFiSWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpO1xyXG4gICAgICAgICAgICAgICAgdGFiRGF0YVRleHQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS10ZXh0Jyk7XHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0QnRuLnRleHRDb250ZW50ID0gdGFiRGF0YVRleHRcclxuICAgICAgICAgICAgICAgIHNlbGVjdFRhYkNvbnRlbnQodGFiSWQpO1xyXG4gICAgICAgICAgICAgICAgaW5wdXRQcm9kdWN0VGl0bGUuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRhYkRhdGFUZXh0KVxyXG4gICAgICAgICAgICAgICAgaW5wdXRQcm9kdWN0LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnRWNvV29vZCcgKyAnICcgKyB0YWJJZClcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0YWJEYXRhVGV4dCA9PSBcItCf0L7Qu9GD0YfQuNGC0Ywg0L/RgNC10LTQu9C+0LbQtdC90LjQtVwiKXtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnRleHRDb250ZW50ID0gXCLQn9C+0LvRg9GH0LjRgtGMINCa0J8g0L3QsCBFY29Xb29kXCIgKyBcIiBcIiArIHRhYklkXHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cFRpdGxlLnRleHRDb250ZW50ID0gXCLQo9C30L3QsNGC0Ywg0YbQtdC90YMg0L3QsCBFY29Xb29kXCIgKyBcIiBcIiArIHRhYklkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2VsZWN0VGFiQ29udGVudCh0YWJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJDb250ZW50LmZvckVhY2goZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRhYkNvbnRlbnRJZCA9IGl0ZW0uZ2V0QXR0cmlidXRlKCdpZCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0YWJOYW1lID09IHRhYkNvbnRlbnRJZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB0YWIoKTtcclxuXHJcbiAgICAvLyDQpNC40LrRgdC40YDQvtCy0LDQvdC40LUg0YjQsNC/0LrQuCDQuCDQvtGC0L7QsdGA0LDQttC10L3QuNC1INC60L3QvtC/0LrQuCDQvdCw0LLQtdGA0YVcclxuICAgIHZhciBidXR0b25VcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idXR0b24tdXAnKVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbihlKXtcclxuICAgICAgICB2YXIgcGFnZVNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcclxuICAgICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpO1xyXG4gICAgICAgIHZhciBoZWFkZXJIZWlnaHQgPSBoZWFkZXIuY2xpZW50SGVpZ2h0ICsgNDA7XHJcblxyXG4gICAgICAgIGlmKHBhZ2VTY3JvbGxUb3AgPj0gaGVhZGVySGVpZ2h0KXtcclxuICAgICAgICAgICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2lzLWZpeGVkJyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKCdpcy1maXhlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNjcm9sbGVkID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGxlZCA+IDcwMCkge1xyXG4gICAgICAgICAgICBidXR0b25VcC5jbGFzc0xpc3QuYWRkKCdpcy1zaG93Jyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnV0dG9uVXAuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2hvdycpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcblxyXG4gICAgLy8g0J/QvtC60LDQt9Cw0YLRjCDQsdC+0LvRjNGI0LUg0L/RgNC+0LTRg9C60YLQvtCyXHJcblxyXG4gICAgdmFyIGJ1dHRvbk1vcmVTZXJ2aWNlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmJ1dHRvbi1tb3JlLS1lbGVtZW50Jyk7XHJcblxyXG4gICAgYnV0dG9uTW9yZVNlcnZpY2UuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICB2YXIgY3VyQnRuID0gaXRlbVxyXG5cclxuICAgICAgICBjdXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgdmFyIGFjdGl2ZUJsb2NrID0gdGhpcy5jbG9zZXN0KCcuanMtcGFyZW50JylcclxuICAgICAgICAgICAgYWN0aXZlQmxvY2suY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VyQnRuLmlubmVyVGV4dC50b0xvd2VyQ2FzZSgpID09PSAn0L/QvtC60LDQt9Cw0YLRjCDQtdGJ0LUnIHx8IGN1ckJ0bi5pbm5lclRleHQudG9Mb3dlckNhc2UoKSA9PT0gJ9C00YDRg9Cz0LjQtSDQvNC+0LTQtdC70LgnKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJCdG4uaW5uZXJUZXh0ID0gJ9Ch0LrRgNGL0YLRjCc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYnRuVGV4dCA9IGN1ckJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGV4dC1idG4nKVxyXG4gICAgICAgICAgICAgICAgY3VyQnRuLmlubmVyVGV4dCA9IGJ0blRleHRcclxuXHJcbiAgICAgICAgICAgICAgICBpZihidG5UZXh0ICE9PSAn0JTRgNGD0LPQuNC1INC80L7QtNC10LvQuCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogYWN0aXZlQmxvY2sub2Zmc2V0VG9wXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9KVxyXG5cclxuICAgIC8vINCc0L7QsdC40LvRjNC90L7QtSDQvNC10L3RjlxyXG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcbiAgICB2YXIgYnVyZ2VyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLWJ1cmcnKTtcclxuICAgIHZhciBoZWFkZXJNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbmF2Jyk7XHJcbiAgICB2YXIgd3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53cmFwcGVyJyk7XHJcbiAgICB2YXIgaGVhZGVyTWVudUxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuaGVhZGVyX19uYXYtbGluaycpO1xyXG4gICAgdmFyIGNsb3NlTWVudUJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jbG9zZS1tZW51JylcclxuICAgIHZhciBjbG9zZUNhdGFsb2dCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtY2xvc2UtY2F0YWxvZycpXHJcbiAgICB2YXIgY2F0YWxvZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19kcm9wZG93bicpXHJcbiAgICB2YXIgY2F0YWxvZ0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXRhbG9nX19idG4nKVxyXG5cclxuXHJcbiAgICBidXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICBpZighdGhpcy5jbGFzc0xpc3QuY29udGFpbnMoJ2FjdGl2ZScpKXtcclxuICAgICAgICAgICAgaGVhZGVyTWVudS5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcclxuICAgICAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdib2R5LS1vcGVuZWQnKTtcclxuICAgICAgICAgICAgd3JhcHBlci5jbGFzc0xpc3QuYWRkKCdvdmVybGF5JylcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGhlYWRlck1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnYm9keS0tb3BlbmVkJyk7XHJcbiAgICAgICAgICAgIHdyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnb3ZlcmxheScpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICBjbG9zZU1lbnVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaGlkZGVuJyk7XHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdib2R5LS1vcGVuZWQnKTtcclxuICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ292ZXJsYXknKTtcclxuICAgICAgICBoZWFkZXJNZW51LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xyXG4gICAgfSlcclxuXHJcbiAgICBjbG9zZUNhdGFsb2dCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNhdGFsb2cuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgY2F0YWxvZ0J0bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgIH0pXHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGhlYWRlck1lbnVMaW5rLmxlbmd0aDsgaSsrKXtcclxuXHJcbiAgICAgICAgdmFyIGxpbmtJdGVtID0gaGVhZGVyTWVudUxpbmtbaV07XHJcblxyXG4gICAgICAgIGxpbmtJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblxyXG4gICAgICAgICAgICB2YXIgaGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9faW5uZXInKVxyXG5cclxuICAgICAgICAgICAgaWYoaGVhZGVyTWVudS5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpKXtcclxuICAgICAgICAgICAgICAgIGhlYWRlck1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBidXJnZXIuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoJ292ZXJsYXknKTtcclxuICAgICAgICAgICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaGlkZGVuJyk7XHJcbiAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnJlbW92ZSgnaXMtY29sb3InKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDQnNC10L3Rj9C10YIg0YDQsNC30LzQtdGC0LrRgyDRgtCw0LHQvtCyINC90LAg0LzQvtCx0LjQu9GM0L3QvtC8INGA0LDQt9GA0LXRiNC10L3QuNC4XHJcbiAgICBpZihzY3JlZW4ud2lkdGggPD0gNzY3KXtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgcHJvZHVjdFRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcm9kdWN0X190YWItaXRlbScpXHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJvZHVjdFRhYi5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pe1xyXG5cclxuICAgICAgICAgICAgdmFyIHRhYkl0ZW0gPSBpdGVtXHJcbiAgICAgICAgICAgIHZhciB0YWJCdG5JZCA9IHRhYkl0ZW0ucXVlcnlTZWxlY3RvcignLnByb2R1Y3RfX3RhYi1idG4nKVxyXG4gICAgICAgICAgICB2YXIgdGFiSXRlbUlkID0gdGFiQnRuSWQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJylcclxuICAgICAgICAgICAgdmFyIHRhYmxlSXRlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYkl0ZW1JZClcclxuXHJcbiAgICAgICAgICAgIHRhYkl0ZW0uYXBwZW5kKHRhYmxlSXRlbSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBnYWxsZXJ5VGh1bWJzID0gbmV3IFN3aXBlcignLmRldGFpbC1zbGlkZXItdGh1bWJzJywge1xyXG4gICAgICAgIGZyZWVNb2RlOiB0cnVlLFxyXG4gICAgICAgIHdhdGNoU2xpZGVzVmlzaWJpbGl0eTogdHJ1ZSxcclxuICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxyXG4gICAgICAgIHRvdWNoUmF0aW86IDAsXHJcbiAgICAgICAgbmF2aWdhdGlvbjoge1xyXG4gICAgICAgICAgICBuZXh0RWw6ICcuZGV0YWlsLXNsaWRlcl9fYXJyb3ctLW5leHQnLFxyXG4gICAgICAgICAgICBwcmV2RWw6ICcuZGV0YWlsLXNsaWRlcl9fYXJyb3ctLXByZXYnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgYnJlYWtwb2ludHM6IHtcclxuICAgICAgICAgICAgMzIwOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAyLFxyXG4gICAgICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxNVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAzNTA6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6IDIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIDQ3MDoge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMyxcclxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMzVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHZhciBnYWxsZXJ5ID0gbmV3IFN3aXBlcignLmRldGFpbC1zbGlkZXItdG9wJywge1xyXG4gICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXHJcbiAgICAgICAgdGh1bWJzOiB7XHJcbiAgICAgICAgICAgIHN3aXBlcjogZ2FsbGVyeVRodW1ic1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vINGC0LDQsdGLINCyINC60LDRgNGC0L7Rh9C60LUg0YLQvtCy0LDRgNCwXHJcbiAgICB2YXIgdGFiQnV0dG9ucyA9IF90b0NvbnN1bWFibGVBcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGV0YWlsLXRhYnNfX2J1dHRvbicpKTtcclxuICAgIHZhciB0YWJDb250ZW50cyA9IF90b0NvbnN1bWFibGVBcnJheShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZGV0YWlsLXRhYnNfX3RhYicpKTtcclxuXHJcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRhYkJ1dHRvbnMubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICBpZiAoaiA9PT0gMCkge1xyXG4gICAgICAgICAgICB0YWJCdXR0b25zW2pdLmNsYXNzTGlzdC5hZGQoJ2RldGFpbC10YWJzX19idXR0b25fYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0YWJCdXR0b25zW2pdLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdocmVmJyk7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRldGFpbC10YWJzX190YWJfYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGN1cnJlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZGV0YWlsLXRhYnNfX3RhYl9hY3RpdmUnKTtcclxuICAgICAgICAgICAgY3VycmVudC5jbGFzc0xpc3QuYWRkKCdkZXRhaWwtdGFic19fdGFiX2hpZGRlbicpO1xyXG4gICAgICAgICAgICB2YXIgbmV3QWN0aXZlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xyXG4gICAgICAgICAgICBuZXdBY3RpdmUuY2xhc3NMaXN0LmFkZCgnZGV0YWlsLXRhYnNfX3RhYl9hY3RpdmUnKTtcclxuICAgICAgICAgICAgbmV3QWN0aXZlLmNsYXNzTGlzdC5yZW1vdmUoJ2RldGFpbC10YWJzX190YWJfaGlkZGVuJyk7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV0YWlsLXRhYnNfX2J1dHRvbl9hY3RpdmUnKS5jbGFzc0xpc3QucmVtb3ZlKCdkZXRhaWwtdGFic19fYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV0YWlsLXRhYnNfX2J1dHRvbl9wcmVhY3RpdmUnKSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGV0YWlsLXRhYnNfX2J1dHRvbl9wcmVhY3RpdmUnKS5jbGFzc0xpc3QucmVtb3ZlKCdkZXRhaWwtdGFic19fYnV0dG9uX3ByZWFjdGl2ZScpO1xyXG4gICAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKCdkZXRhaWwtdGFic19fYnV0dG9uX2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBlLnRhcmdldC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGUudGFyZ2V0LnByZXZpb3VzRWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZCgnZGV0YWlsLXRhYnNfX2J1dHRvbl9wcmVhY3RpdmUnKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGFiQ29udGVudHMubGVuZ3RoOyBrICs9IDEpIHtcclxuICAgICAgICBpZiAoayAhPT0gMCkge1xyXG4gICAgICAgICAgICB0YWJDb250ZW50c1trXS5jbGFzc0xpc3QuYWRkKCdkZXRhaWwtdGFic19fdGFiX2hpZGRlbicpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRhYkNvbnRlbnRzW2tdLmNsYXNzTGlzdC5hZGQoJ2RldGFpbC10YWJzX190YWJfYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGluaXRTbW9vdGhTY3JvbGxpbmcoKSB7XHJcbiAgXHJcbiAgICAgIHZhciBkdXJhdGlvbiA9IDgwMDtcclxuXHJcbiAgICAgIHZhciBwYWdlVXJsID0gbG9jYXRpb24uaGFzaCA/XHJcbiAgICAgICAgc3RyaXBIYXNoKGxvY2F0aW9uLmhyZWYpIDpcclxuICAgICAgICBsb2NhdGlvbi5ocmVmO1xyXG5cclxuICAgICAgLy8gZGVsZWdhdGVkTGlua0hpamFja2luZygpO1xyXG4gICAgICBkaXJlY3RMaW5rSGlqYWNraW5nKCk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBkZWxlZ2F0ZWRMaW5rSGlqYWNraW5nKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNsaWNrLCBmYWxzZSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xyXG4gICAgICAgICAgaWYgKCFpc0luUGFnZUxpbmsoZS50YXJnZXQpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBqdW1wKGUudGFyZ2V0Lmhhc2gsIHtcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgc2V0Rm9jdXMoZS50YXJnZXQuaGFzaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZGlyZWN0TGlua0hpamFja2luZygpIHtcclxuICAgICAgICBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKSlcclxuICAgICAgICAgIC5maWx0ZXIoaXNJblBhZ2VMaW5rKVxyXG4gICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24oYSkge1xyXG4gICAgICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xyXG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBqdW1wKGUudGFyZ2V0Lmhhc2gsIHtcclxuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gaXNJblBhZ2VMaW5rKG4pIHtcclxuICAgICAgICByZXR1cm4gbi50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdhJyAmJlxyXG4gICAgICAgICAgbi5oYXNoLmxlbmd0aCA+IDAgJiZcclxuICAgICAgICAgIHN0cmlwSGFzaChuLmhyZWYpID09PSBwYWdlVXJsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmdW5jdGlvbiBzdHJpcEhhc2godXJsKSB7XHJcbiAgICAgICAgcmV0dXJuIHVybC5zbGljZSgwLCB1cmwubGFzdEluZGV4T2YoJyMnKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIHNldEZvY3VzKGhhc2gpIHtcclxuICAgICAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2guc3Vic3RyaW5nKDEpKTtcclxuXHJcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgIGlmICghL14oPzphfHNlbGVjdHxpbnB1dHxidXR0b258dGV4dGFyZWEpJC9pLnRlc3QoZWxlbWVudC50YWdOYW1lKSkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnRhYkluZGV4ID0gLTE7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBqdW1wKHRhcmdldCwgb3B0aW9ucykge1xyXG4gICAgICB2YXJcclxuICAgICAgICBzdGFydCA9IHdpbmRvdy5wYWdlWU9mZnNldCxcclxuICAgICAgICBvcHQgPSB7XHJcbiAgICAgICAgICBkdXJhdGlvbjogb3B0aW9ucy5kdXJhdGlvbixcclxuICAgICAgICAgIG9mZnNldDogb3B0aW9ucy5vZmZzZXQgfHwgMCxcclxuICAgICAgICAgIGNhbGxiYWNrOiBvcHRpb25zLmNhbGxiYWNrLFxyXG4gICAgICAgICAgZWFzaW5nOiBvcHRpb25zLmVhc2luZyB8fCBlYXNlSW5PdXRRdWFkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkaXN0YW5jZSA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID9cclxuICAgICAgICBvcHQub2Zmc2V0ICsgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIDEyNiA6XHJcbiAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgIGR1cmF0aW9uID0gdHlwZW9mIG9wdC5kdXJhdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/XHJcbiAgICAgICAgb3B0LmR1cmF0aW9uKGRpc3RhbmNlKSA6XHJcbiAgICAgICAgb3B0LmR1cmF0aW9uLFxyXG4gICAgICAgIHRpbWVTdGFydCwgdGltZUVsYXBzZWQ7XHJcblxyXG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24odGltZSkge1xyXG4gICAgICAgIHRpbWVTdGFydCA9IHRpbWU7XHJcbiAgICAgICAgbG9vcCh0aW1lKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmdW5jdGlvbiBsb29wKHRpbWUpIHtcclxuICAgICAgICB0aW1lRWxhcHNlZCA9IHRpbWUgLSB0aW1lU3RhcnQ7XHJcblxyXG4gICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBvcHQuZWFzaW5nKHRpbWVFbGFwc2VkLCBzdGFydCwgZGlzdGFuY2UsIGR1cmF0aW9uKSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lRWxhcHNlZCA8IGR1cmF0aW9uKVxyXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZW5kKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVuZCgpIHtcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oMCwgc3RhcnQgKyBkaXN0YW5jZSk7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0LmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICAgICAgb3B0LmNhbGxiYWNrKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQodCwgYiwgYywgZCkge1xyXG4gICAgICAgIHQgLz0gZCAvIDJcclxuICAgICAgICBpZiAodCA8IDEpIHJldHVybiBjIC8gMiAqIHQgKiB0ICsgYlxyXG4gICAgICAgIHQtLVxyXG4gICAgICAgIHJldHVybiAtYyAvIDIgKiAodCAqICh0IC0gMikgLSAxKSArIGJcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8vINGE0YPQvdC60YbQuNC+0L3QsNC7INCy0YvQt9C+0LLQsCDQuCDQt9Cw0LrRgNGL0YLQuNGPINC80L7QtNCw0LvRjNC90L7Qs9C+INC+0LrQvdCwXHJcbiAgICB2YXIgICBwb3B1cExpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcG9wdXAtc2hvdycpLFxyXG4gICAgICAgcG9wdXBDbG9zZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1jbG9zZScpO1xyXG4gICAgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuICAgIGh0bWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdodG1sJyk7XHJcbiAgICBsb2NrUGFkZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5sb2NrLXBhZGRpbmcnKTtcclxuICAgIHVubG9jayA9IHRydWVcclxuICAgIHRpbWVPdXQgPSA0MDA7XHJcblxyXG4gICAgKGZ1bmN0aW9uKCQpe1xyXG4gICAgICAgICQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgJChkb2N1bWVudCkub24oXCJjbGlja1wiLCcuanMtcG9wdXAtc2hvdycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rID0gdGhpcztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtJZCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgICAgIHZhciBmaWxlSWQgPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1maWxlJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3B1cEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcnICsgbGlua0lkKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGFqYXhMaW5rID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtYWpheCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyAgPSB7fTtcclxuICAgICAgICAgICAgICAgICQuZWFjaChsaW5rLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGluZGV4LCBhdHRyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoL15kYXRhXFwtcGFyYW1cXC0oLispJC8udGVzdChhdHRyLm5vZGVOYW1lKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSBhdHRyLm5vZGVOYW1lLm1hdGNoKC9eZGF0YVxcLXBhcmFtXFwtKC4rKSQvKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zW2tleS50b1VwcGVyQ2FzZSgpXSA9ICQobGluaykuZGF0YSgncGFyYW0tJytrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICBpZihhamF4TGluayl7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBhamF4TGluayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcGFyYW1zXHJcbiAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJGNvbnRlbnRCb3ggPSAkKHBvcHVwRWxlbWVudCkuZmluZCgnLmpzLXBvcHVwLWNvbnRlbnQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5zdGF0dXMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5zdGF0dXMgPT09ICdzdWNjZXNzJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRlbnRCb3guaHRtbChkYXRhLm1lc3NhZ2UpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkY29udGVudEJveC5odG1sKGRhdGEubWVzc2FnZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRlbnRCb3guaHRtbChkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2gobGluay5hdHRyaWJ1dGVzLCBmdW5jdGlvbihpbmRleCwgYXR0cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKC9eZGF0YVxcLWF1dG9sb2FkXFwtKC4rKSQvLnRlc3QoYXR0ci5ub2RlTmFtZSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gYXR0ci5ub2RlTmFtZS5tYXRjaCgvXmRhdGFcXC1hdXRvbG9hZFxcLSguKykkLylbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJOYW1lID0gJ1BST1BFUlRZWycra2V5LnRvVXBwZXJDYXNlKCkrJ10nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWwgPSAkKCdpbnB1dFtuYW1lPVwiJytwYXJOYW1lKydcIl0sdGV4dGFyZWFbbmFtZT1cIicrcGFyTmFtZSsnXCJdJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsLmxlbmd0aCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbC52YWwoJChsaW5rKS5kYXRhKCdhdXRvbG9hZC0nK2tleSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwzMDApXHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9wdXBPcGVuKHBvcHVwRWxlbWVudCxmaWxlSWQpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBwb3B1cE9wZW4ocG9wdXBFbGVtZW50LGZpbGVJZClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSkoalF1ZXJ5KTtcclxuXHJcbiAgICBpZiAocG9wdXBDbG9zZS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9wdXBDbG9zZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcG9wdXBDbG9zZUVsZW1lbnQgPSBwb3B1cENsb3NlW2ldXHJcblxyXG4gICAgICAgICAgICBwb3B1cENsb3NlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHBvcHVwT25DbG9zZSh0aGlzLmNsb3Nlc3QoJy5wb3B1cCcpLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBvcHVwT3BlbkJ5SUQobGlua0lkLCBodG1sKSB7XHJcbiAgICAgICAgbGV0IHBvcHVwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJycgKyBsaW5rSWQpO1xyXG4gICAgICAgIGlmKHBvcHVwRWxlbWVudCl7XHJcbiAgICAgICAgICAgIGxldCAkY29udGVudEJveCA9ICQocG9wdXBFbGVtZW50KS5maW5kKCcuanMtcG9wdXAtY29udGVudCcpO1xyXG4gICAgICAgICAgICAkY29udGVudEJveC5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICBwb3B1cE9wZW4ocG9wdXBFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcG9wdXBPcGVuKGN1cmVudFBvcHVwLCBmaWxlSWQpIHtcclxuXHJcbiAgICAgICAgaWYgKGN1cmVudFBvcHVwICYmIHVubG9jaykge1xyXG5cclxuICAgICAgICAgICAgdmFyIHBvcHVwQWN0aXZlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBvcHVwLm9wZW4nKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwb3B1cEFjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgcG9wdXBPbkNsb3NlKHBvcHVwQWN0aXZlLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBib2R5TG9jaygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJlbnRQb3B1cC5jbGFzc0xpc3QuYWRkKCdvcGVuJylcclxuXHJcbiAgICAgICAgICAgIGlmKGZpbGVJZCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1nQ29udGFpbmVyID0gY3VyZW50UG9wdXAucXVlcnlTZWxlY3RvcignLnBvcHVwX19jb250ZW50LS1wcm9qZWN0JylcclxuICAgICAgICAgICAgICAgIHZhciBpbWdFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpXHJcbiAgICAgICAgICAgICAgICBpbWdFbC5zZXRBdHRyaWJ1dGUoJ3NyYycsICBmaWxlSWQgKVxyXG4gICAgICAgICAgICAgICAgaW1nQ29udGFpbmVyLmFwcGVuZChpbWdFbClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjdXJlbnRQb3B1cC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWUudGFyZ2V0LmNsb3Nlc3QoJy5wb3B1cF9fY29udGVudCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9wdXBPbkNsb3NlKGUudGFyZ2V0LmNsb3Nlc3QoJy5wb3B1cCcpLCB0cnVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBib2R5TG9jaygpIHtcclxuICAgICAgICB2YXIgbG9ja1BhZGRpbmdWYWx1ZSA9IHdpbmRvdy5pbm5lcldpZHRoIC0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndyYXBwZXInKS5vZmZzZXRXaWR0aCArIFwicHhcIjtcclxuICAgICAgICBpZiAobG9ja1BhZGRpbmcubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2NrUGFkZGluZy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGxvY2tQYWRkaW5nRWwgPSBsb2NrUGFkZGluZ1tpXVxyXG4gICAgICAgICAgICAgICAgbG9ja1BhZGRpbmdFbC5zdHlsZS5wYWRkaW5nUmlnaHQgPSBsb2NrUGFkZGluZ1ZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBsb2NrUGFkZGluZ1ZhbHVlXHJcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdpcy1oaWRkZW4nKVxyXG4gICAgICAgIGJ1dHRvblVwLnN0eWxlLm9wYWNpdHkgPSAwXHJcblxyXG4gICAgICAgIHVubG9jayA9IGZhbHNlXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB1bmxvY2sgPSB0cnVlXHJcbiAgICAgICAgfSwgdGltZU91dClcclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gYm9keVVuTG9jaygpIHtcclxuXHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9ja1BhZGRpbmcubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb2NrUGFkZGluZ0VsID0gbG9ja1BhZGRpbmdbaV1cclxuICAgICAgICAgICAgICAgIGxvY2tQYWRkaW5nRWwuc3R5bGUucGFkZGluZ1JpZ2h0ID0gJzBweCdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYm9keS5zdHlsZS5wYWRkaW5nUmlnaHQgPSAnMHB4J1xyXG4gICAgICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWhpZGRlbicpXHJcbiAgICAgICAgICAgIGJ1dHRvblVwLnN0eWxlLm9wYWNpdHkgPSAxXHJcblxyXG4gICAgICAgIH0sIHRpbWVPdXQpXHJcblxyXG4gICAgICAgIHVubG9jayA9IGZhbHNlXHJcblxyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB1bmxvY2sgPSB0cnVlXHJcbiAgICAgICAgfSwgdGltZU91dClcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwb3B1cE9uQ2xvc2UocG9wdXBBY3RpdmUsIGRvVW5sb2NrKSB7XHJcblxyXG4gICAgICAgIHZhciBpbWdBY3RpdmUgPSBwb3B1cEFjdGl2ZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaW1nJylcclxuXHJcbiAgICAgICAgaWYoaW1nQWN0aXZlLmxlbmd0aCl7XHJcblxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpbWdBY3RpdmVbMF0ucmVtb3ZlKClcclxuICAgICAgICAgICAgfSwgNDAwKVxyXG4gICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVubG9jaykge1xyXG4gICAgICAgICAgICBwb3B1cEFjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKCdvcGVuJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZG9VbmxvY2spIHtcclxuICAgICAgICAgICAgICAgIGJvZHlVbkxvY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSk7XHJcblxyXG5mdW5jdGlvbiBzdWJtaXRGb3JtSGFuZGxlcihmb3JtLCB2YWx1ZXMsIGFqYXgpe1xyXG4gICAgdmFyICRmb3JtID0gJChmb3JtKTtcclxuICAgIHZhciB0aGFua3NQb3B1cCA9ICRmb3JtLmNsb3Nlc3QoXCIuanMtcG9wdXBcIik7XHJcbiAgICB2YXIgaHJlZiA9ICgkZm9ybS5hdHRyKCdhY3Rpb24nKSE9PSAnIycgJiYgJGZvcm0uYXR0cignYWN0aW9uJykgIT09ICcnKT8gJGZvcm0uYXR0cignYWN0aW9uJykgOiAnL2FqYXgvJztcclxuICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBocmVmLFxyXG4gICAgICAgIHR5cGU6ICdwb3N0JyxcclxuICAgICAgICBkYXRhOiAkZm9ybS5zZXJpYWxpemVBcnJheSgpLFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIGlmKGRhdGEuc3RhdHVzID09PSBcInN1Y2Nlc3NcIil7XHJcblxyXG4gICAgICAgICAgICAgICAgJCgnaW5wdXRbdHlwZT10ZXh0XSxpbnB1dFt0eXBlPXRlbF0saW5wdXRbdHlwZT1lbWFpbF0nLCAkZm9ybSkudmFsKCcnKTtcclxuICAgICAgICAgICAgICAgIGlmKCRmb3JtLmhhc0NsYXNzKCdqcy1yZXdyaXRlJykpe1xyXG4gICAgICAgICAgICAgICAgICAgICRmb3JtLmh0bWwoJzxkaXYgY2xhc3M9XCIgaXMtJyArIGRhdGEuc3RhdHVzICsgJyBqcy1tZXNzXCI+JyArIGRhdGEubWVzc2FnZSArICc8L2Rpdj4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZigkZm9ybS5oYXNDbGFzcygnanMtc3VjY2Vzcy1mb3JtJykpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhY3RpdmVQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cC5vcGVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN1Y2Nlc3NQb3B1cCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wb3B1cC1zdWNjZXNzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlUG9wdXAuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbicpXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2Vzc1BvcHVwLmNsYXNzTGlzdC5hZGQoJ29wZW4nKVxyXG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoIHR5cGVvZiBkYXRhLmRhdGEgIT09ICd1bmRlZmluZWQnICYmIChkYXRhLmRhdGEudGl0bGUgfHwgZGF0YS5kYXRhLmNvbnRlbnQpICl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5kYXRhLnRpdGxlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhbmtzUG9wdXAuZmluZCgnLmpzLXRpdGxlJykuaHRtbChkYXRhLmRhdGEudGl0bGUpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuZGF0YS5jb250ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhbmtzUG9wdXAuZmluZCgnLmpzLWNvbnRlbnQnKS5odG1sKGRhdGEuZGF0YS5jb250ZW50KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAkZm9ybS5hcHBlbmQoJzxkaXYgY2xhc3M9XCIgaXMtJyArIGRhdGEuc3RhdHVzICsgJyBqcy1tZXNzXCI+JyArIGRhdGEubWVzc2FnZSArICc8L2Rpdj4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gaW5pdENvbXBhcmVUYWJsZShpdGVtcywgc3BjaWZpY2F0aW9ucykge1xyXG4gICAgbGV0ICRpdGVtcyA9ICQoaXRlbXMpO1xyXG4gICAgaWYgKCEkaXRlbXNbMF0pIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICBsZXQgcmVzcG9uc2l2ZSA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDAsXHJcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiAxLFxyXG4gICAgICAgICAgICAgICAgZHVwbGljYXRlOiAnaW4nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludDogNDgwLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uczogMixcclxuICAgICAgICAgICAgICAgIGR1cGxpY2F0ZTogJ2luJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDYwMCxcclxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IDMsXHJcbiAgICAgICAgICAgICAgICBkdXBsaWNhdGU6ICdpbidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiA0LFxyXG4gICAgICAgICAgICAgICAgZHVwbGljYXRlOiAnaW4nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYnJlYWtwb2ludDogOTkyLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uczogNCxcclxuICAgICAgICAgICAgICAgIGR1cGxpY2F0ZTogJ291dCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBicmVha3BvaW50OiAxMjgwLFxyXG4gICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgY29sdW1uczogNSxcclxuICAgICAgICAgICAgICAgIGR1cGxpY2F0ZTogJ291dCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICBdO1xyXG5cclxuICAgIGlmIChzcGNpZmljYXRpb25zKSB7XHJcbiAgICAgICAgcmVzcG9uc2l2ZSA9IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uczogMSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogNjAwLFxyXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiAyLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiA3NjgsXHJcbiAgICAgICAgICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IDMsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IDk5MixcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uczogMyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogMTI4MCxcclxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uczogNyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgJGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9ICQoJGl0ZW1zW2ldKTtcclxuXHJcbiAgICAgICAgaXRlbS5jb21wYXJlVGFibGUoe1xyXG4gICAgICAgICAgICBzb3J0OiB0cnVlLFxyXG4gICAgICAgICAgICBwcmV2OiAnPHN2ZyB3aWR0aD1cIjEwXCIgaGVpZ2h0PVwiMTBcIj48dXNlIHhsaW5rOmhyZWY9XCInKygoaXRlbS5kYXRhKCdhcnJvdycpKT9pdGVtLmRhdGEoJ2Fycm93Jyk6Jy9hc3NldHMvaW1hZ2VzL3Nwcml0ZS5zdmcjYXJyb3cnKSsnXCI+PC91c2U+PC9zdmc+JyxcclxuICAgICAgICAgICAgbmV4dDogJzxzdmcgd2lkdGg9XCIxMFwiIGhlaWdodD1cIjEwXCI+PHVzZSB4bGluazpocmVmPVwiJysoKGl0ZW0uZGF0YSgnYXJyb3cnKSk/aXRlbS5kYXRhKCdhcnJvdycpOicvYXNzZXRzL2ltYWdlcy9zcHJpdGUuc3ZnI2Fycm93JykrJ1wiPjwvdXNlPjwvc3ZnPicsXHJcbiAgICAgICAgICAgIGZvbGRpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVzOiAxMCxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTogcmVzcG9uc2l2ZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuKGZ1bmN0aW9uIChhcnIpIHtcclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L/QvtC00LTQtdGA0LbQutGDIG1hdGNoZXNcclxuICAgIGlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xyXG5cclxuICAgICAgICAvLyDQvtC/0YDQtdC00LXQu9GP0LXQvCDRgdCy0L7QudGB0YLQstC+XHJcbiAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXNTZWxlY3RvciB8fFxyXG4gICAgICAgICAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcclxuICAgICAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubW96TWF0Y2hlc1NlbGVjdG9yIHx8XHJcbiAgICAgICAgICAgIEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyDQv9GA0L7QstC10YDRj9C10Lwg0L/QvtC00LTQtdGA0LbQutGDIGNsb3Nlc3RcclxuICAgIGlmICghRWxlbWVudC5wcm90b3R5cGUuY2xvc2VzdCkge1xyXG5cclxuICAgICAgICAvLyDRgNC10LDQu9C40LfRg9C10LxcclxuICAgICAgICBFbGVtZW50LnByb3RvdHlwZS5jbG9zZXN0ID0gZnVuY3Rpb24gKGNzcykge1xyXG4gICAgICAgICAgICB2YXIgbm9kZSA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAobm9kZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUubWF0Y2hlcyhjc3MpKSByZXR1cm4gbm9kZTtcclxuICAgICAgICAgICAgICAgIGVsc2Ugbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICgnTm9kZUxpc3QnIGluIHdpbmRvdyAmJiAhTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2gpIHtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ3BvbHlmaWxsIGZvciBJRTExJyk7XHJcbiAgICAgICAgTm9kZUxpc3QucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcclxuICAgICAgICAgICAgdGhpc0FyZyA9IHRoaXNBcmcgfHwgd2luZG93O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpc1tpXSwgaSwgdGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uaGFzT3duUHJvcGVydHkoJ2FwcGVuZCcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGl0ZW0sICdhcHBlbmQnLCB7XHJcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXHJcbiAgICAgICAgICAgIHZhbHVlOiBmdW5jdGlvbiBhcHBlbmQoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJnQXJyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSxcclxuICAgICAgICAgICAgICAgICAgICBkb2NGcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFyZ0Fyci5mb3JFYWNoKGZ1bmN0aW9uIChhcmdJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzTm9kZSA9IGFyZ0l0ZW0gaW5zdGFuY2VvZiBOb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY0ZyYWcuYXBwZW5kQ2hpbGQoaXNOb2RlID8gYXJnSXRlbSA6IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFN0cmluZyhhcmdJdGVtKSkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChkb2NGcmFnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG59KShbRWxlbWVudC5wcm90b3R5cGUsIERvY3VtZW50LnByb3RvdHlwZSwgRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGVdKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XHJcbiAgICBpbml0Q29tcGFyZVRhYmxlKCcuanMtdGFibGUtcHJvcHMnKTtcclxuXHRpbml0Q29tcGFyZVRhYmxlKCcuanMtY29tcGFyZS10YWJsZScsIHRydWUpO1xyXG4gICAgXHJcbiAgICAkKCcuZm9vdGVyX19jYXRhbG9nLWJ0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnYWN0aXZlJylcclxuICAgICAgICAkKCcuZm9vdGVyX19jYXRhbG9nLWRyb3Bkb3duJykuc3RvcCgpLnNsaWRlVG9nZ2xlKClcclxuICAgIH0pXHJcblxyXG4gICAgJCgnLmNhdGFsb2dfX2J0bicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgICAgICQoJy5jYXRhbG9nX19kcm9wZG93bicpLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxyXG4gICAgfSlcclxuXHJcbiAgICB2YXIgY2F0YWxvZ0l0ZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtY2F0YWxvZy1pdGVtJyk7XHJcbiAgICB2YXIgY2F0YWxvZ0NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1jYXRhbG9nLWNvbnRhaW5lcicpO1xyXG5cclxuXHJcbiAgICB2YXIgbW92ZUVsZW1lbnQgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgIGlmKGNhdGFsb2dDb250YWluZXIpe1xyXG4gICAgICAgICAgICB2YXIgY2xvbmVkRWxlbWVudCA9IGl0ZW0uY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgICAgICAgICBjYXRhbG9nQ29udGFpbmVyLmFwcGVuZChjbG9uZWRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgXHJcblxyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGNhdGFsb2dJdGVtLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBjYXRhbG9nRWwgPSBjYXRhbG9nSXRlbVtpXTtcclxuICAgICAgICBtb3ZlRWxlbWVudChjYXRhbG9nRWwpO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG5cclxuICAgIGZ1bmN0aW9uIG1vdmVDYXRhbG9nT25NZW51ICgpIHtcclxuICAgICAgICB2YXIgY2F0YWxvZyA9ICQoJy5jYXRhbG9nJylcclxuICAgICAgICB2YXIgaGVhZGVyTmF2ID0gJCgnLmhlYWRlcl9fbmF2JylcclxuICAgICAgICB2YXIgaGVhZGVyTWVudU1vYmlsZSA9ICQoJy5oZWFkZXJfX21lbnUnKVxyXG5cclxuICAgICAgICBpZih3aW5kb3cubWF0Y2hNZWRpYSgnKG1heC13aWR0aDogNzY4cHgpJykubWF0Y2hlcyl7XHJcbiAgICAgICAgICAgIGhlYWRlck5hdi5wcmVwZW5kKGNhdGFsb2cpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG1vdmVDYXRhbG9nT25NZW51KCk7XHJcblxyXG4gICAgJCgnLmhlYWRlcl9fbmF2LWl0ZW0gYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoJCgnYm9keScpLmhhc0NsYXNzKCdib2R5LS1vcGVuZWQnKSl7XHJcbiAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYm9keS0tb3BlbmVkJylcclxuICAgICAgICB9XHJcbiAgICB9KVxyXG4gICAgXHJcbn0pIl0sImZpbGUiOiJjb21tb24uanMifQ==
