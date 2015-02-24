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

        var neighbour_set = make_set(neighbours(user._id, 1000));

        return Meteor.users.find({
            '_id': {'$in': user.profile.favorites}
        }).map(function(doc) {
            return {
                'user_id': doc._id,
                'first_name': doc.profile.first_name,
                'last_name': doc.profile.last_name,
                'fake_avatar': 'avatars/av1.jpg',
                'distance_image': neighbour_set(doc._id) ? 'near' : 'far',
                'status': Statuses.findOne({'_id': doc.profile.status})
            };
        });
    }
});

Template.favorit_user.events({
    'click .js-toggle-favorite': function(event, template) {
        console.log('UGU');
        var user = Meteor.user();
        if (user === undefined || user === null) {
            return;
        }

        Meteor.users.update({'_id': user._id}, {'$pull': {'profile.favorites': template.data.user_id}});
    }
});
