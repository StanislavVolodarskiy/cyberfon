Template.sign_in.events({
    'submit': function(event, template) {
        event.preventDefault();

        var username = template.$('[name=username]').val();
        var password = template.$('[name=password]').val();

        Meteor.loginWithPassword({'username': username}, password, function(error) {
            if (error === undefined) {
                Router.go('main');
            } else {
                console.log(error);
            }
        });
    }
});
