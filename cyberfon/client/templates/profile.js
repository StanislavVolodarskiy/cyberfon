var SIGN_UP_KEY = 'Template.profile.sign_up';
Session.setDefault(SIGN_UP_KEY, false);

Template.profile.helpers({
    'sign_up': function() {
        return Session.get(SIGN_UP_KEY);
    }
});

Template.profile.events({
    'click .js-sign-in': function() {
        Session.set(SIGN_UP_KEY, false);
    },

    'click .js-sign-up': function() {
        Session.set(SIGN_UP_KEY, true);
    },

    'click .js-sign-off': function() {
        Meteor.logout();
    },

    'submit': function(event, template) {
        event.preventDefault();

        if (Session.get(SIGN_UP_KEY)) {
            var username = template.$('[name=username]').val();
            var password = template.$('[name=password]').val();
            var confirm = template.$('[name=confirm]').val();

            Accounts.createUser({
                'username': username,
                'password': password
            }, function(error) {
                console.log(error);
                if (error) {
                    return Session.set(ERRORS_KEY, {'none': error.reason});
                }

                Router.go('main');
            });
        } else {
            var username = template.$('[name=username]').val();
            var password = template.$('[name=password]').val();

            Meteor.loginWithPassword({'username': username}, password, function(error) {
                console.log(error);
                if (error) {
                    return Session.set(ERRORS_KEY, {'none': error.reason});
                }

                Router.go('main');
            });
        }

    }
});
