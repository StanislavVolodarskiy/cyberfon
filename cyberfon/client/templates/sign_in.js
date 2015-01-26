var SIGN_IN_ERRORS = 'Template.sign_in.errors';

Template.sign_in.created = function() {
    Session.set(SIGN_IN_ERRORS, []);
};

Template.sign_in.helpers({
    errors: function() {
        return Session.get(SIGN_IN_ERRORS);
    }
});

Template.sign_in.events({
    'submit': function(event, template) {
        event.preventDefault();

        var phone_num = template.$('[name=phone_num]').val();
        var password  = template.$('[name=password]').val();

        Meteor.loginWithPassword({'username': phone_num}, password, function(error) {
            if (error === undefined) {
                Router.go('main');
            } else {
                console.log(error);

                var errors = [];

                if (error.reason == 'Match failed') {
                    errors.push('Нет такой пары телефон/пароль.');
                }
                Session.set(SIGN_IN_ERRORS, errors);
            }
        });
    }
});
