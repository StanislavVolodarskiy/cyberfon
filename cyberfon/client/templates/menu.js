Template.menu.helpers({
    'username': function() {
        return Meteor.user().username;
    },
    'profile': function() {
        return Meteor.user().profile;
    }
});
