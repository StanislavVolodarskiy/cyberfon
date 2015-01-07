var STATUS_EDITIING = 'Template.main.status_editing';
Session.setDefault(STATUS_EDITIING, false);

Template.main.helpers({
    'status': function() {
        var user = Meteor.user();
        return (user === undefined) ? undefined : user.profile.status;
    },
    'users': function() {
        return Meteor.users.find({});
    },
    'status_editing': function() {
        return Session.get(STATUS_EDITIING);
    }
});

Template.main.events({
    'click .js-edit-status': function(event) {
        Session.set(STATUS_EDITIING, true);
    },
    'keyup input[type=text]': _.throttle(function(event) {
        var user = Meteor.user();
        Meteor.users.update({'_id': user._id}, {$set: {'profile.status': event.target.value}})
    }, 300),
    'blur input[type=text]': function(event) {
        Session.set(STATUS_EDITIING, false);
    }
});
