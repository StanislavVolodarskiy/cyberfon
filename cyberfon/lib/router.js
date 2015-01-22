Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    layoutTemplate: 'layout'
});

Router.route('main', {
    path: '/',
    onBeforeAction: function() {
        if (!Meteor.user() && !Meteor.loggingIn()) {
            Router.go('sign_in');
        }
        this.next();
    }
});

Router.route('dialog', {
    path: '/dialog/:_id',
    data: function() {
        return {corr_id: this.params._id};
    }
});

Router.route('menu');

Router.route('sign_in_up', {
    layoutTemplate: undefined
});

Router.route('sign_in');
Router.route('sign_up');
Router.route('sign_out');
Router.route('profile');
