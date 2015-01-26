var SIGN_UP_ERRORS = 'Template.sign_up.errors';

Template.sign_up.created = function() {
    Session.set(SIGN_UP_ERRORS, []);
};

Template.sign_up.helpers({
    errors: function() {
        return Session.get(SIGN_UP_ERRORS);
    }
});

Template.sign_up.events({
    'submit': function(event, template) {
        event.preventDefault();

        var first_name     = template.$('[name=first_name]'    ).val().trim();
        var last_name      = template.$('[name=last_name]'     ).val().trim();
        var phone_num      = template.$('[name=phone_num]'     ).val()       ;
        var password       = template.$('[name=password]'      ).val()       ;
        var password_again = template.$('[name=password_again]').val()       ;

        var errors = [];
        if (first_name === ''          ) { errors.push('Введите имя.'    ); }
        if (last_name === ''           ) { errors.push('Введите фамилию.'); }
        if (password !== password_again) { errors.push('Разные пароли.'    ); }

        if (errors.length > 0) {
            Session.set(SIGN_UP_ERRORS, errors);
            return;
        }

        alert('AGA');

        Accounts.createUser({
            'username': phone_num,
            'password': password,
            'profile': {
                'first_name': first_name,
                'last_name' : last_name ,
                'status'    : '?'
            }
        }, function(error) {
            console.log(error);

            var errors = [];
            if (errors.length == 0) {
                console.log(error);
                errors.push('Неизвестная ошибка.');
            }
            Session.set(SIGN_UP_ERRORS, errors);
        });
    }
});
