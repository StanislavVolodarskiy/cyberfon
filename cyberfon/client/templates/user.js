Template.user.helpers({
    'profile': function() {
        var user = Meteor.users.findOne({'_id': this.user_id}, {'profile': 1});
        return (user === undefined) ? undefined : user.profile;
    },
    'statuses': function() {
        var user = Meteor.users.findOne({'_id': this.user_id}, {'profile': 1});
        var status = (user === undefined) ? undefined : user.profile.status;

        return Statuses.find({'user': this.user_id}, {'user_id': 0}).map(function(doc) {
            doc['active_class'] = (doc._id === status) ? 'twit_active' : 'twit_passive';
            doc['n_comments'] = Comments.find({'status': doc._id}).count();
            return doc;
        });
    }
});

Template.user.events({
    'click .js-open-dialog': function(event, template) {
        Router.go('dialog', {'_id': template.data.user_id});
    }
});

Template.user_status.events({
    'click .js-open-chat': function(event, template) {
        Router.go('chat', {'_id': template.data._id});
    }
});
