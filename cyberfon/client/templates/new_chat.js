Template.new_chat.events({
    'submit': function(event, template) {
        event.preventDefault();
        
        var user_id = Meteor.userId();
        if (user_id === undefined || user_id === null) {
            Router.go('main');
            return;
        }

        var status = template.$('[name=status]').val();

        var result = Statuses.insert({
            'user': user_id,
            'date': new Date(),
            'text': status
        });
        Meteor.users.update({'_id': user_id}, {'$set': {'profile.status': result}});

        Router.go('main');
    }
});
