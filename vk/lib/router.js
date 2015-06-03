Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    'layoutTemplate': 'layout'
});

var vk = (function(auth_cb_route) {
    var version = '5.33';

    var users = function(cb) {
        HTTP.get(url('https://api.vk.com/method/users.get', [
            ['v'           , version    ],
            ['access_token', token      ],
            ['fields'      , 'sex,bdate']
        ]), {}, cb);
    };

    return {
        'users': users
    };
})('vk_auth_cb');

Router.route('root', function() {}, {
    'path': '/',
    'onBeforeAction': function() {
        Router.go('friends');
        this.next();
    }
});

Router.route('friends', {
    'onBeforeAction': function() {
        if (Meteor.user() === null) {
            console.log('THERE');
            Meteor.loginWithVk(function() {
                console.log(arguments);
            });
        } else {
            console.log('HERE');
        }
        this.next();
    }
});

