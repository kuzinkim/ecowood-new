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