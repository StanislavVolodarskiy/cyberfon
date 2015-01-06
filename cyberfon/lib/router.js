Router.setTemplateNameConverter(function(s) { return s; });

Router.route('main', {
    path: '/',
    onBeforeAction: function () {
        if (!Meteor.user() && !Meteor.loggingIn()) {
            Router.go('sign_in');
        }
        this.next();
    }
});

Router.route('menu');

Router.route('sign_in');
Router.route('sign_up');
Router.route('sign_out');
