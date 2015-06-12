Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    'layoutTemplate': 'layout'
});

var vk = (function() {
    var url = function(path, params) {
        if (params === undefined) {
            params = [];
        }
        var param_str = _.map(params, function(v) {
            return v[0] + '=' + encodeURIComponent(v[1]);
        }).join('&');
        return (param_str === '') ? path : path + '?' + param_str;
    };

    var version = '5.33';

    var users = function(cb) {
        console.log('URL');
        HTTP.get(url('https://api.vk.com/method/users.get', [
            ['v'           , version    ],
            ['access_token', token      ],
            ['fields'      , 'sex,bdate']
        ]), {}, cb);
    };

    return {
        'users': users
    };
})();

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
            if (Accounts.loginServicesConfigured()) {
                console.log('THERE');
                Meteor.loginWithVk(function() {
                    console.log(arguments);
                });
            }
        } else {
            console.log('HERE');
            console.log(vk);
            vk.users(function() {
                console.log(arguments);
            });
        }
        this.next();
    }
});

