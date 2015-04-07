(function() {
    var lastTimestamp = new Date();

    var make_store = function(user) {
        return function(longitude, latitude) {
            var location = {
                'type'       : 'Point',
                'coordinates': [longitude, latitude]
            };

            lastTimestamp = new Date();

            // TODO: make upsert
            var record = Locations.findOne({'user': user}, {'user': 1});
            if (record === undefined) {
                Locations.insert({
                    'user'     : user         ,
                    'location' : location     ,
                    'timestamp': lastTimestamp
                });
            } else {
                Locations.update({'_id': record._id}, {'$set': {
                    'location' : location     ,
                    'timestamp': lastTimestamp
                }});
            }
        };
    };

    var dump = function(id, cb) {
        return function() {
            console.log(id + ' ' + Array.prototype.slice.call(arguments).join(' '));
            cb([]);
        };
    };

    var read_wifis = (Meteor.isCordova) ? function(cb) {
        WifiWizard.startScan(
            function() {
                WifiWizard.getScanResults(function(wifis) {
                    cb(_.map(wifis, function(wifi) {return {'mac': wifi['BSSID']};}));
                }, dump('WifiWizard.getScanResults.fail', cb));
            },
            dump('WifiWizard.startScan.fail', cb)
        );
    } : function(cb) {
        cb([]);
    };

    var read_cells = (Meteor.isCordova) ? function(cb) {
        CellInfo.gsmCells(function(gsm_cells) {
            _.each(gsm_cells, function(cell) {
                cell['cellid'] = cell['id'];
                delete cell['id'];
            });
            cb(gsm_cells);
        }, dump('CellInfo.gsmCells.failure', cb));
    } : function(cb) {
        cb([]);
    };

    var yandexLocation = function(store) {
        var cells = undefined;
        var wifis = undefined;

        var askYandex = function() {
            if (cells !== undefined && wifis !== undefined) {
                if (cells.length > 0 || wifis.length > 0) {
                    Meteor.call('yandexLocator', cells, wifis, function(error, result) {
                        if (error !== undefined) {
                            console.log(JSON.stringify(error));
                            return;
                        }
                        if (result.position.type === 'ip') {
                            console.log(JSON.stringify(result));
                            return;
                        }
                        console.log(JSON.stringify(result));
                        store(result.position.longitude, result.position.latitude);
                    });
                }
            }
        };

        read_cells(function(gsm_cells) {
            cells = gsm_cells;
            askYandex();
        });
        read_wifis(function(wifi_networks) {
            wifis = wifi_networks;
            askYandex();
        });
    };

    // TODO: throttle timestamp update
    Deps.autorun(function() {
        var user = Meteor.userId();
        if (user === undefined || user === null) {
            return;
        }

        var loc = Geolocation.currentLocation();
        if (loc === null) {
            return;
        }

        console.log('gps');
        Deps.nonreactive(function() {make_store(user)(loc.coords.longitude, loc.coords.latitude);});
    });

    Meteor.setInterval(function() {
        if (new Date().getTime() > lastTimestamp.getTime() + 55 * 1000) {
            var user = Meteor.userId();
            if (user === undefined || user === null) {
                return;
            }
            console.log('yandexLocation');
            yandexLocation(make_store(user));
        }
    }, 10 * 1000);
})();
