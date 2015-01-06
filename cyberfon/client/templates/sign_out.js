Template.sign_out.events({
    'click .js-sign-out': function(event, template) {
        event.preventDefault();

        Meteor.logout(function() {
            Router.go('main');
        });
    }
});
