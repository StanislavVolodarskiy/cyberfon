(function() {
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

    Template.auth.helpers({
        'vk_auth_url': function() {
            return url('https://oauth.vk.com/authorize', [
                ['client_id'    , '4910052'    ],
                ['scope'        , 'friends'    ],
                ['redirect_uri' , auth_cb_url()],
                ['display'      , 'page'       ],
                ['v'            , '5.32'       ],
                ['response_type', 'token'      ]
            ]);
        }
    });
})();
