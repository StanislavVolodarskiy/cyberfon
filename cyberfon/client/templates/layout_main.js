Template.layout_main.helpers({
    'user_id': function() {
        return Meteor.userId();
    },
    'global_status': function() {
        return 'global_invisible';
        return 'global_online';
        return 'global_connecting';
        return 'global_offline';
    },
    'gps_status': function() {
        return 'gps_looking_coord';
        return 'gps_show_coord';
        return 'gps_off';
    },
    'network_status': function() {
        switch (Meteor.status().status) {
        case 'connected' : return 'network_connected';
        case 'connecting':
        case 'waiting'   : return 'network_connecting';
        case 'failed'    :
        case 'offline'   :
        default          : return 'network_disconnected';
        }
    }
});

Template.layout_main.events({
    'click .js-back'          : function() { window.history.back() ; },
    'click .js-open-main'     : function() { Router.go('main'     ); },
    'click .js-open-favorites': function() { Router.go('favorites'); },
    'click .js-open-dialogs'  : function() { Router.go('dialogs'  ); }
});
