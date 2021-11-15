var phoneMaskLeasing = IMask(
    document.getElementById('phone-mask-order'), {
        mask: '+{7}(000)000-00-00'
    });

new window.JustValidate('.js-form-order', {
    rules: {
        name: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        text:{
            required: false,
        },
        myField: {
            required: true,
            minLength: 16,
            maxLength: 16,
        }
    },

    messages: {
        name: 'Пожалуйста, введите ваше имя',
        email: 'Пожалуйста, введите корректный адрес электронной почты',
        myField: 'Пожалуйста, введите корректный номер телефона'
    },

    focusWrongField: true,

    submitHandler: submitFormHandler,
});