Locations = new Meteor.Collection('locations');
if (Meteor.isServer) {
    Locations._ensureIndex({'user'     : 1         });
    Locations._ensureIndex({'location' : '2dsphere'});
    Locations._ensureIndex({'timestamp': 1         });

    Meteor.setInterval(function() {
        var time = new Date(new Date().getTime() - 120 * 1000);
        Locations.remove({'timestamp': {'$lt': time}});
    }, 10 * 1000);
}


Statuses = new Meteor.Collection('statuses');
if (Meteor.isServer) {
    Statuses._ensureIndex({'user': 1, 'date': 1});
}

Comments = new Meteor.Collection('comments');
if (Meteor.isServer) {
    Comments._ensureIndex({'status': 1, 'date': 1});
}

Messages = new Meteor.Collection('messages');
if (Meteor.isServer) {
    Messages._ensureIndex({'from': 1, 'to'  : 1, 'date': 1});
    Messages._ensureIndex({'to'  : 1, 'from': 1           });
}

Regions = new Meteor.Collection('regions');
if (Meteor.isServer) {
    Locations._ensureIndex({'location': '2dsphere'});
}
