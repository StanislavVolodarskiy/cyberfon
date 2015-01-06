Template.main.helpers({
    'status': function() {
        var user = Meteor.user();
        if (user === undefined) {
            return undefined;
        }
        if (user.profile === undefined) {
            user.profile = {'status': '??'};
            Meteor.users.update({'_id': user._id}, {$set: {'profile': user.profile}})
        }
        return user.profile.status;
    },
    'users': function() {
        return Meteor.users.find({});
    }
});
