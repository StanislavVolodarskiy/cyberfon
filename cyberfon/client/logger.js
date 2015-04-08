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


    var make_cached_locate = function(max_size, timeout, locate) {
        var size = 0;
        var cache = Utils.make_ordered_dict();

        var array_key = function(array) {
            var values = _.map(array, JSON.stringify);
            values.sort();
            return JSON.stringify(values);
        };

        return function(cells, wifis, cb) {
            console.log('SIZES: ' + size + ' / ' + max_size);
            var key = array_key(cells) + array_key(wifis);
            console.log('KEY: ' + key);
            var value = cache.get(key);
            console.log('VALUE: ' + JSON.stringify(value));
            if (value !== undefined && new Date().getTime() < value.timestamp + timeout) {
                console.log('CACHE');
                cb(value.error, value.result);
            } else {
                console.log('LOCATE');
                locate(cells, wifis, function(error, result) {
                    if (!cache.has(key)) {
                        // remove oldest entries
                        while (size >= max_size) {
                            console.log('REMOVE: ' + cache.first().key);
                            cache.remove(cache.first().key);
                            --size;
                        }
                        ++size;
                    }
                    console.log('PUT: ' + key);
                    cache.put(key, {'error': error, 'result': result, 'timestamp': new Date().getTime()});
                    cb(error, result);
                });
            }
        };
    };

    var cached_locate = make_cached_locate(60, 60 * 60 * 1000, function(cells, wifis, cb) {
        console.log('locateWithYandex');
        Meteor.call('yandexLocator', cells, wifis, cb);
    });

    var locateWithYandex = function(store) {
        var cells = undefined;
        var wifis = undefined;

        var askYandex = function() {
            if (cells !== undefined && wifis !== undefined) {
                if (cells.length > 0 || wifis.length > 0) {
                    cached_locate(cells, wifis, function(error, result) {
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
            locateWithYandex(make_store(user));
        }
    }, 10 * 1000);
})();
