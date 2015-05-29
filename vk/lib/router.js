Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    'layoutTemplate': 'layout'
});

var vk = (function(auth_cb_route) {
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

    var login = function(go_to) {
        var auth_cb_url = function() {
            return Meteor.settings.public.scheme + '://' + Meteor.settings.public.host + '/' + auth_cb_route;
        };

        var url = function(path, params) {
            if (params === undefined) {
                params = [];
            }
            var param_str = _.map(params, function(v) {
                return v[0] + '=' + encodeURIComponent(v[1]);
            }).join('&');
            return (param_str === '') ? path : path + '?' + param_str;
        };

        window.open(url('https://oauth.vk.com/authorize', [
            ['client_id'    , '4910052'    ],
            ['scope'        , 'friends'    ],
            ['redirect_uri' , auth_cb_url()],
            ['display'      , 'page'       ],
            ['v'            , '5.32'       ],
            ['response_type', 'token'      ],
            ['state'        , go_to        ]
        ]), '_self');
    };

    return {
        'login': login,
        'loggedIn': function() {
            return token !== undefined;
        }
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
        }
        this.next();
    }
});

