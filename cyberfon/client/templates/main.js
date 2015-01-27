var STATUS_EDITIING = 'Template.main.status_editing';
Session.setDefault(STATUS_EDITIING, false);

Template.main.helpers({
    'status': function() {
        var user = Meteor.user();
        return (user === undefined || user === null) ? undefined : user.profile.status;
    },
    'users': function() {
        return Meteor.users.find({'_id': {'$ne': Meteor.userId()}});
    },
    'status_editing': function() {
        return Session.get(STATUS_EDITIING);
    }
});

Template.main.events({
    'click .js-edit-status': function(event, template) {
        Session.set(STATUS_EDITIING, true);
        Tracker.flush();
        template.$('.js-status-editing input').focus();
    },
    'keydown input[type=text]': function(event) {
        if (event.which === 27 /* Esc */) {
            event.preventDefault();
            event.target.blur();
        }
    },
    'keyup input[type=text]': _.throttle(function(event) {
        var user = Meteor.user();
        Meteor.users.update({'_id': user._id}, {$set: {'profile.status': event.target.value}})
    }, 300),
    'blur input[type=text]': function(event) {
        Session.set(STATUS_EDITIING, false);
    }
});
