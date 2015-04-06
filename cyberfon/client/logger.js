Meteor.startup(function () {
    if (Meteor.isCordova) {
        var dump = function(id, args) {
            var dump = function() {
                console.log(id + ' ' + Array.prototype.slice.call(arguments).join(' '));
            };
            if (args == undefined) {
                return dump;
            }
            dump.apply(null, args);
        };

        var print_object = function(object) {
            return _.map(object, function(value, key) {
                return key + ': ' + value;
            }).join(', ');
        };

        WifiWizard.startScan(
            function() {
                dump('WifiWizard.startScan.success', arguments);
                WifiWizard.getScanResults(
                    function(networks) {
                        _.each(networks, function(network) {
                            console.log('wifi ' + print_object(network));
                        });
                    },
                    dump('WifiWizard.getScanResults.fail')
                );
            },
            dump('WifiWizard.startScan.fail')
        );
    }
});

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

