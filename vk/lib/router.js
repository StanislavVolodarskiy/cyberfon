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
        return {'args': _.map(this.params.hash.split('&'), function(v) {
            var items = v.split('=');
            return {'key': items[0], 'value': items[1]};
        })};
    }
});
