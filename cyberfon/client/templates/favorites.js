var Utils = (function() {

    var make_ordered_dict = function() {

        var dict = {};
        var head = {};
        head['prev'] = head;
        head['next'] = head;

        var insert_node_before = function(place, key, value) {
            var prev = place.prev;
            var next = place;

            var node = {
                'prev' : prev ,
                'next' : next ,
                'key'  : key  ,
                'value': value
            };
            prev.next = node;
            next.prev = node;

            return node;
        };

        var remove_node = function(node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        };

        var put = function(key, value) {
            console.log('PUT', key, value);
            if (dict.hasOwnProperty(key)) {
                dict[key]['value'] = value;
            } else {
                dict[key] = insert_node_before(head, key, value);
            }
        };

        var get = function(key) {
            console.log('GET', key);
            return (dict.hasOwnProperty(key)) ? dict[key]['value'] : undefined;
        };

        var has = function(key) {
            console.log('HAS', key);
            return dict.hasOwnProperty(key);
        };

        var remove = function(key) {
            console.log('REMOVE', key);
            if (dict.hasOwnProperty(key)) {
                remove_node(dict[key]);
                delete dict[key];
            }
        };

        var each = function(f) {
            for (var node = head.next; node !== head; node = node.next) {
                f(node['value'], node['key']);
            }
        };

        var map = function(f) {
            var list = [];
            each(function(v, k) { list.push(f(v, k)); });
            return list;
        };

        var filter = function(p, f) {
            var list = [];
            each(function(v, k) {
                if (p(v, k)) {
                    list.push(f(v, k));
                }
            });
            return list;
        };

        return {
            'put'   : put,
            'get'   : get,
            'has'   : has,
            'remove': remove,
            'each'  : each,
            'map'   : map,
            'filter': filter
        };
    };
    
    var make_set = function(array) {
        var dict = {};
        _.each(array, function(v) {
            dict[v] = undefined;
        });
        return function(v) {return dict.hasOwnProperty(v);};
    };

    return {
        'make_set': make_set,
        'make_ordered_dict': make_ordered_dict
    };
})();

(function() {
    var favorites_rv = (function() {
        var favorites = Utils.make_ordered_dict();
        var favorites_rv = new ReactiveVar(favorites);

        Deps.autorun(function() {
            var user = Meteor.user();
            var new_favorites = (user === undefined || user === null) ? [] : user.profile.favorites;

            var new_favorites_set = Utils.make_set(new_favorites);
            favorites.each(function(v, k) {
                if (!new_favorites_set(k)) {
                    favorites.put(k, Meteor.setTimeout(function() {
                        favorites.remove(k);
                        favorites_rv.set(favorites);
                    }, 30000));
                }
            });

            _.each(new_favorites, function(v) {
                if (favorites.has(v)) {
                    var id = favorites.get(v);
                    if (id !== undefined) {
                        Meteor.clearTimeout(id);
                        favorites.put(v);
                    }
                } else {
                    favorites.put(v);
                    favorites_rv.set(favorites);
                }
            });
        });

        return favorites_rv;
    })();

    Template.favorites.helpers({
        'users': function() {
            var user_location = function(user) {
                var location = Locations.findOne({'user': user}, {'location': 1});
                return (location === undefined) ? undefined : location.location;
            };

            var neighbours = function(user, distance) {
                var location = user_location(user);
                if (location === undefined) {
                    return [];
                }

                return Locations.find({
                    'location': {'$near': {'$geometry': location, '$maxDistance': distance}},
                    'user'    : {'$ne'  : user                                             }
                }, {
                    'user': 1
                }).map(function(doc) { return doc.user; });
            };

            var user = Meteor.user();
            if (user === undefined || user === null) {
                return [];
            }

            var neighbour_set = Utils.make_set(neighbours(user._id, 1000));

            var favorites = favorites_rv.get().map(function(v, k) { return k; });

            var favorites_set = Utils.make_set(favorites_rv.get().filter(
                function(v) { return v === undefined; },
                function(v, k) { return k; }
            ));

            return Meteor.users.find({
                '_id': {'$in': favorites}
            }).map(function(doc) {
                var favorite = favorites_set(doc._id);

                return {
                    'user_id': doc._id,
                    'first_name': doc.profile.first_name,
                    'last_name': doc.profile.last_name,
                    'fake_avatar': 'avatars/av1.jpg',
                    'distance_image': neighbour_set(doc._id) ? 'near' : 'far',
                    'favorite': favorite,
                    'favorite_class': favorite ? 'favorit': '',
                    'status': Statuses.findOne({'_id': doc.profile.status})
                };
            });
        }
    });
})();


Template.favorit_user.events({
    'click .js-toggle-favorite': function(event, template) {
        var user = Meteor.user();
        if (user === undefined || user === null) {
            return;
        }

        var op = (template.data.favorite) ? '$pull' : '$addToSet';
        var update = {};
        update[op] = {'profile.favorites': template.data.user_id};
        Meteor.users.update({'_id': user._id}, update);
    }
});
