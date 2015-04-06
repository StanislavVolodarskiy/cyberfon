Template.avatar.helpers({
    'fake_avatar': function() {
        
        var width = (this.width > 0) ? this.width : 40;
        
        var href = (this.user_id === Meteor.userId()) ? '/' : '/user/' + this.user_id;
        
        return {
            'path': (this.user_id === Meteor.userId()) ? '/avatars/nophoto.jpg' : '/avatars/nophoto.jpg',
            'width': width,
            'href': href
        }
    }
});

Template.avatar.events({
    'click .js-open-user': function(event, template) {
        Router.go('user', {'_id': template.data.user_id});
    }
});
