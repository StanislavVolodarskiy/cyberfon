Template.avatar.helpers({
    'fake_avatar': function() {
        return (this.user_id === Meteor.userId()) ? '/avatars/av1.jpg' : '/avatars/av2.jpg';
    }
});

Template.avatar.events({
    'click .js-open-user': function(event, template) {
        Router.go('user', {'_id': template.data.user_id});
    }
});
