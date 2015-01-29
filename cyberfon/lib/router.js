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

Router.route('sign_in');
Router.route('sign_up');
Router.route('sign_out');
Router.route('profile');
Router.route('people_list');
Router.route('chat');
Router.route('context_menu');
Router.route('change_private');
Router.route('config_menu');
Router.route('account_settings');
Router.route('image_config');
Router.route('logout');
Router.route('dialogs');
Router.route('user_chats');



