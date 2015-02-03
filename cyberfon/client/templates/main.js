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
        var user = Meteor.user();
        return (user === undefined || user === null) ? undefined : user.profile.status;
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

        var user = Meteor.user();
        if (user === undefined || user === null) {
            return [];
        }

        var user_ids = user.profile.favorites.concat(neighbours(user._id, 1000));

        return Meteor.users.find({'_id': {'$in': user_ids}});
    }
});

Template.main.events({
    'click .js-open-chat': function(event, template) {
        Router.go('chat', {'_id': 'my_status_id'});
    }
});

Template.main_user.events({
    'click .js-open-chat-2': function(event, template) {
        Router.go('chat', {'_id': template.data.status.status_id});
    },
    'click .js-toggle-favorite': function(event, template) {
        console.log('TODO: js-toggle-favorite');
    }
});
