var STATUS_EDITIING = 'Template.main.status_editing';
Session.setDefault(STATUS_EDITIING, false);

var fake_vasiliy = {
    'fake_avatar': 'avatars/av1.jpg',
    'first_name': 'Вася',
    'last_name': 'Пупкин',
    'status': {
        'text'     : 'Хочу чтобы всем было тепло и хорошо и чтобы всех было все что хотят',
        'date'     : new Date(2015, 1, 22, 10, 33, 16, 4),
        'nComments': 4
    }
};

var fake_alexey = {
    'fake_avatar': 'avatars/av4.jpg',
    'first_name': 'Леша',
    'last_name': 'Гришин',
    'status': {
        'text'     : 'Три проходки в кино, яблоки, помидоры, малина и клубника',
        'date'     : new Date(2015, 2, 22, 10, 33, 16, 4),
        'nComments': 9
    }
};

Template.main.helpers({
    'status': function() {
        return {
            'text'     : 'Эй, пошли на шашлык, братва',
            'date'     : new Date(),
            'nComments': 3
        };
        var user = Meteor.user();
        return (user === undefined || user === null) ? undefined : user.profile.status;
    },
    'near_users': function() {
        return [fake_vasiliy, fake_alexey];
    },
    'favourite_users': function() {
        return [fake_alexey, fake_vasiliy];
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
