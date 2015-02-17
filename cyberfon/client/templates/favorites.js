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

        var make_set = function(array) {
            var dict = {};
            _.each(array, function(v) {
                dict[v] = undefined;
            });
            return function(v) {return dict.hasOwnProperty(v);};
        };

        var user = Meteor.user();
        if (user === undefined || user === null) {
            return [];
        }

        var neighbour_ids = neighbours(user._id, 1000);
        var user_ids = user.profile.favorites.concat(neighbour_ids);

        var neighbour_set = make_set(neighbour_ids         );
        var favorite_set  = make_set(user.profile.favorites);

        return Meteor.users.find({
            '_id': {'$in': user_ids}
        }).map(function(doc) {
            var favorite = favorite_set(doc._id);

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
