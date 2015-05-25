Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    'layoutTemplate': 'layout'
});

Router.route('root', {
    'path': '/',
    'onBeforeAction': function() {
        Router.go('auth');
        this.next();
    }
});

Router.route('friends', {
    'onBeforeAction': function() {
        // if (!Meteor.user() && !Meteor.loggingIn()) {
            Router.go('auth');
        // }
        this.next();
    }
});

Router.route('auth');

Router.route('auth_cb', {
    data: function() {
        return {'args': _.map(this.params, function(v, k) {
            return {'key': k, 'value': v};
        })};
    }
});
