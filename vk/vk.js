if (Meteor.isClient) {
    (function() {
        var url = function(path, params) {
            if (params === undefined) {
                params = [];
            }
            var param_str = _.map(params, function(v) {
                return v[0] + '=' + encodeURIComponent(v[1]);
            }).join('&');
            return (param_str === '') ? path : path + '?' + param_str;
        };

        Template.main.helpers({
            'auth_url': function() {
                return url('https://oauth.vk.com/authorize', [
                    ['client_id', '4910052'],
                    ['scope', 'friends'],
                    ['redirect_uri', 'https://oauth.vk.com/blank.html'],
                    ['display', 'page'],
                    ['v', '5.32'],
                    ['response_type', 'token']
                ]);
            }
        });
    })();
}

if (Meteor.isServer) {
    Meteor.startup(function() {
        // code to run on server at startup
    });
}
