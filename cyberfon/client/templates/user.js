Template.user.helpers({
    'profile': function() {
        var user = Meteor.users.findOne({'_id': this.user_id}, {'profile': 1});
        return (user === undefined) ? undefined : user.profile;
    }
});

Template.user.events({
    'click .js-open-dialog': function(event, template) {
        Router.go('dialog', {'_id': template.data.user_id});
    }
});
