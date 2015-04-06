(function() {

     var network_status = function() {
        switch (Meteor.status().status) {
            case 'connected' : return 'network_connected';

            case 'connecting':
            case 'waiting'   : return 'network_connecting';

            case 'failed'    :
            case 'offline'   :
            default          : return 'network_disconnected';
        }
    };

    Template.layout_main.helpers({
        'user_id': function() {
            return Meteor.userId();
        },
        'global_status': function() {
            switch (network_status()) {
            case 'network_connected'   : return 'global_online'    ;
            case 'network_connecting'  : return 'global_connecting';
            case 'network_disconnected': return 'global_offline'   ;
            default                    : return 'global_invisible' ;
            }
        },
        'gps_status': function() {
            var userId = Meteor.userId();
            if (userId === undefined || userId === null) {
                return 'gps_off';
            }
            return (Locations.find({'user': userId}).count() > 0) ? 'gps_show_coord' : 'gps_off';
        },
        'network_status': network_status
    });
})();

Template.layout_main.events({
    'click .js-back'          : function() { window.history.back() ; },
    'click .js-open-main'     : function() { Router.go('main'     ); },
    'click .js-open-favorites': function() { Router.go('favorites'); },
    'click .js-open-dialogs'  : function() { Router.go('dialogs'  ); }
});
