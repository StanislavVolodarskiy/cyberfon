Template.main.helpers({
    'status': function() {
        var user = Meteor.user();
        if (user === undefined || user === null) {
            return [];
        }

        return user.profile.status;

        return {
            'status_id': 'my_status_id',
            'text'     : 'Там эти, олени. Может на шашлык сходим? На оленях покатаемся?..',
            'date'     : new Date(),
            'nComments': 3
        };
    },

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
            var user = doc.profile;

            user._id = doc._id;

            user.fake_avatar = 'avatars/av1.jpg';

            user.distance_image = neighbour_set(doc._id) ? 'near' : 'far';

            var favorite = favorite_set(doc._id);
            user.favorite = favorite;
            user.favorite_class = favorite ? 'ion-locked': 'ion-unlocked';

            return user;
        });
    }
});

Template.main.events({
    'click .js-open-chat': function(event, template) {
        Router.go('chat', {'_id': 'TODO_my_status_id'});
    }
});

Template.main_user.events({
    'click .js-open-chat-2': function(event, template) {
        Router.go('chat', {'_id': template.data.status.status_id});
    },
    'click .js-toggle-favorite': function(event, template) {
        var user = Meteor.user();
        if (user === undefined || user === null) {
            return;
        }

        var op = (template.data.favorite) ? '$pull' : '$addToSet';
        var update = {};
        update[op] = {'profile.favorites': template.data._id};
        Meteor.users.update({'_id': user._id}, update);
    }
});
