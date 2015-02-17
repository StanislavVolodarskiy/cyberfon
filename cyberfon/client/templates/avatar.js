Template.avatar.helpers({
    'fake_avatar': function() {
        return '/avatars/av1.jpg';
    }
});

Template.avatar.events({
    'click .js-open-user': function(event, template) {
        Router.go('user', {'_id': template.data.user_id});
    }
});
