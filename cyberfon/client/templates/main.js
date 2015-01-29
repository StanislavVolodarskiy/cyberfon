var STATUS_EDITIING = 'Template.main.status_editing';
Session.setDefault(STATUS_EDITIING, false);

var fake_vasiliy = {
    'user_id': 'fake_vasiliy',
    'fake_avatar': 'avatars/av1.jpg',
    'first_name': 'Вася',
    'last_name': 'Пупкин',
    'status': {
        'status_id': 'fake_vasiliy_status_id',
        'text'     : 'Хочу чтобы всем было тепло и хорошо и чтобы всех было все что хотят',
        'date'     : new Date(2015, 1, 22, 10, 33, 16, 4),
        'nComments': 4
    }
};

var fake_alexey = {
    'user_id': 'fake_alexey',
    'fake_avatar': 'avatars/av4.jpg',
    'first_name': 'Леша',
    'last_name': 'Гришин',
    'status': {
        'status_id': 'fake_alexey_status_id',
        'text'     : 'Три проходки в кино, яблоки, помидоры, малина и клубника',
        'date'     : new Date(2015, 2, 22, 10, 33, 16, 4),
        'nComments': 9
    }
};

Template.main.helpers({
    'status': function() {
        return {
            'status_id': 'my_status_id',
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
});

Template.main.events({
    'click .js-open-chat': function(event, template) {
        Router.go('chat', {'_id': 'my_status_id'});
    }
});

Template.main_user.events({
    'click .js-open-chat': function(event, template) {
        Router.go('chat', {'_id': template.data.status.status_id});
    }
});
