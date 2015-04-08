Template.profile.helpers({
    'username': function() {
        return Meteor.user().username;
    },
    'profile': function() {
        return Meteor.user().profile;
    }
});

Template.profile.events({
    'submit': function(event, template) {
        event.preventDefault();

        var set = {};
        var update = function(input, predicate, field) {
            var value = template.$('[name=' + input + ']').val();
            if (predicate(value)) {
                set['profile.' + field] = value;
            }
        };

        update('first_name' , function(v) {return v != '';}, 'first_name' );
        update('second_name', function(v) {return true   ;}, 'second_name');
        update('last_name'  , function(v) {return v != '';}, 'last_name'  );
        
        Meteor.users.update({'_id': Meteor.user()._id}, {'$set': set})

        var old_password = template.$('[name=old_password]').val();
        if (old_password !== '') {
            var password = template.$('[name=password]').val();
            var password_again = template.$('[name=password_again]').val();
            if (password === password_again) {
                Accounts.changePassword(old_password, password);
            }
        }
    },
    
    'click .js-open-main'  : function() { Router.go('main'); }
    
});

