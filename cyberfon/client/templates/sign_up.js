Template.sign_up.events({
    'submit': function(event, template) {
        event.preventDefault();

        var username = template.$('[name=username]').val();
        var password = template.$('[name=password]').val();
        var password_again = template.$('[name=password_again]').val();

        if (password !== password_again) {
            console.log('passwords are different');
            return;
        }

        Accounts.createUser({
            'username': username,
            'password': password,
            'profile': { 'status': '?' }
        }, function(error) {
            if (error === undefined) {
                Router.go('main');
            } else {
                console.log(error);
            }
        });
    }
});
