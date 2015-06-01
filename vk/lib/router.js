if (Meteor.isServer) {
    WebApp.connectHandlers.use(function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        console.log('RES', res);
        return next();
    });
}

Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    'layoutTemplate': 'layout'
});

var vk = (function(auth_cb_route) {
    var version = '5.33';

    var user;
    var token;

    Router.route(auth_cb_route, function() {
        var map = {};
        _.each(this.params.hash.split('&'), function(v) {
            var items = v.split('=');
            map[items[0]] = items[1];
        });
        user = map.user_id;
        token = map.access_token;
        Router.go(map.state);
    });

    var url = function(path, params) {
        if (params === undefined) {
            params = [];
        }
        var param_str = _.map(params, function(v) {
            return v[0] + '=' + encodeURIComponent(v[1]);
        }).join('&');
        return (param_str === '') ? path : path + '?' + param_str;
    };

    var login = function(go_to) {
        var auth_cb_url = function() {
            return Meteor.settings.public.scheme + '://' + Meteor.settings.public.host + '/' + auth_cb_route;
        };

        window.open(url('https://oauth.vk.com/authorize', [
            ['client_id'    , '4910052'    ],
            ['scope'        , 'friends'    ],
            ['redirect_uri' , auth_cb_url()],
            ['display'      , 'page'       ],
            ['v'            , version      ],
            ['response_type', 'token'      ],
            ['state'        , go_to        ]
        ]), '_self');
    };

    var users = function(cb) {
        HTTP.get(url('https://api.vk.com/method/users.get', [
            ['v'           , version    ],
            ['access_token', token      ],
            ['fields'      , 'sex,bdate']
        ]), {}, cb);
    };

    return {
        'login': login,
        'loggedIn': function() {
            return token !== undefined;
        },
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
        if (!vk.loggedIn()) {
            vk.login('friends');
        } else {
            vk.users(function(response) {
                console.log(response);
            });
        }
        this.next();
    }
});

