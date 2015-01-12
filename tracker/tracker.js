var Log = new Meteor.Collection('log');

if (Meteor.isClient) {
    var TRACK_NAME = 'Template.tracker.track_name';
    Session.setDefault(TRACK_NAME, '');

    var log = function(name, object) {
        var track;
        Deps.nonreactive(function() {
            track = Session.get(TRACK_NAME);
        });
        if (track === '') {
            return;
        }
        console.log(object);
        var record = {
            'time': new Date(),
            'track': track
        };
        record[name] = object;
        Log.insert(record);
    };

    Template.tracker.helpers({
        track: function() {
            return Session.get(TRACK_NAME);
        },
        error: function() {
            return Geolocation.error();
        },
        position: function() {
            return Geolocation.currentLocation();
        }
    });

    Template.tracker.events({
        'keyup input[type=text]': function(event) {
            Session.set(TRACK_NAME, event.target.value);
        }
    });

    Deps.autorun(function() {
        log('position', Geolocation.currentLocation());
    });

    Deps.autorun(function() {
        log('error', Geolocation.error());
    });
}
