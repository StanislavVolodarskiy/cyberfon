var vk_access = (function() {
    var user;
    var token;
    return {
        'open': function(u, t) {
            user = u;
            token = t;
        },
        'opened': function() {
            return token !== undefined;
        }
    };
})();

Router.setTemplateNameConverter(function(s) { return s; });

Router.configure({
    'layoutTemplate': 'layout'
});

Router.route('root', function() {}, {
    'path': '/',
    'onBeforeAction': function() {
        Router.go('auth');
        this.next();
    }
});

Router.route('friends', {
    'onBeforeAction': function() {
        if (!vk_access.opened()) {
            Router.go('auth');
        }
        this.next();
    }
});

Router.route('auth', function() {
    var auth_cb_url = function() {
        return Meteor.settings.public.scheme + '://' + Meteor.settings.public.host + '/auth_cb';
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
        ['response_type', 'token'      ]
    ]), '_self');
});

Router.route('auth_cb', function() {
    var map = {};
    _.each(this.params.hash.split('&'), function(v) {
        var items = v.split('=');
        map[items[0]] = items[1];
    });
    vk_access.open(map.user_id, map.access_token);
    Router.go('friends');
});
