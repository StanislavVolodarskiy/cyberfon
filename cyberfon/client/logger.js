
Deps.autorun(function() {
    var user = Meteor.userId();
    if (user === undefined || user === null) {
        return;
    }

    var loc = Geolocation.currentLocation();
    if (loc === null) {
        return;
    }

    var location = {
        'type'       : 'Point',
        'coordinates': [loc.coords.longitude, loc.coords.latitude]
    };

    // TODO: make upsert
    // TODO: throttle timestamp update
    Deps.nonreactive(function() {
        console.log(new Date());
        var record = Locations.findOne({'user': user}, {'user': 1});
        if (record === undefined) {
            Locations.insert({
                'user': user,
                'location': location,
                'timestamp': new Date()
            });
        } else {
            Locations.update({'_id': record._id}, {'$set': {
                'location': location,
                'timestamp': new Date()
            }});
        }
    });
});

