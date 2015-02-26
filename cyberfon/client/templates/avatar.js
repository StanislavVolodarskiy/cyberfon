Template.avatar.helpers({
    'fake_avatar': function() {
        return (this.user_id === Meteor.userId()) ? '/avatars/nophoto.jpg' : '/avatars/nophoto.jpg';
    }
});

Template.avatar.events({
    'click .js-open-user': function(event, template) {
        Router.go('user', {'_id': template.data.user_id});
    }
});
