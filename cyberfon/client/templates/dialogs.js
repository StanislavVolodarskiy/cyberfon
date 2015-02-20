Template.dialogs.helpers({
    'user_id': function() {
        return Meteor.userId();
    },

    'status': function() {
        var null_status = {
            'status_id' : undefined,
            'text'      : '-',
            'date'      : '-',
            'n_comments': '-'
        };

        var user = Meteor.user();
        if (user === undefined || user === null) {
            return null_status;
        }
        if (user.profile.status === undefined) {
            return null_status;
        }

        var status = Statuses.findOne({'_id': user.profile.status});
        if (status === undefined) {
            return null_status;
        }

        status['n_comments'] = Comments.find({'status': user.profile.status}).count();

        return status;
    },

    'dialogs': function() {
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

        var last = {};
        var update_last = function(corr_id, date, text) {
            if (last.hasOwnProperty(corr_id)) {
                if (date > last[corr_id].date) {
                    last[corr_id].date = date;
                    last[corr_id].text = text;
                }
            } else {
                last[corr_id] = { 'date': date, 'text': text };
            }
        };

        Messages.find({'from': user._id}).forEach(function(doc) { update_last(doc.to  , doc.date, doc.text); });
        Messages.find({'to'  : user._id}).forEach(function(doc) { update_last(doc.from, doc.date, doc.text); });

        var last_ids = _.map(last, function(value, key) { return key; });

        Meteor.users.find({
            '_id': {'$in': last_ids}
        }).forEach(function(doc) {
            _.each({
                'corr_id': doc._id,
                'first_name': doc.profile.first_name,
                'last_name': doc.profile.last_name,
                'distance_image': neighbour_set(doc._id) ? 'near' : 'far',
            }, function(value, key) {
                last[doc._id][key] = value;
            });
        });

        return _.filter(last, function(value) {
            return value.hasOwnProperty('corr_id');
        }).sort(function(a, b) {
            if (a.date < b.date) {
                return -1;
            }
            if (a.date > b.date) {
                return 1;
            }
            return 0;
        });
    }
});

Template.dialogs_dialog.events({
    'click .js-open-dialog': function(event, template) {
        Router.go('dialog', {'_id': template.data.corr_id});
    }
});

