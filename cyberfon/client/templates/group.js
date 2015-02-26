Template.group.helpers({
    'user_id': function() {
        var status = Statuses.findOne({'_id': this.chat_id}, {'user': 1});
        if (status === undefined) {
            return undefined;
        }
        return status.user;
    },
    'profile': function() {
        var status = Statuses.findOne({'_id': this.chat_id}, {'user': 1});
        if (status === undefined) {
            return undefined;
        }
        var user = Meteor.users.findOne({'_id': status.user});
        return (user === undefined || user === null) ? undefined : user.profile;
    },
    'status': function() {
        return Statuses.findOne({'_id': this.chat_id});
    },
    'comments': function() {
        var user_location = function(user) {
            if (user === undefined || user === null) {
                return undefined;
            }
            var location = Locations.findOne({'user': user}, {'location': 1});
            return (location === undefined) ? undefined : location.location;
        };

        var neighbour = function(location, distance, user) {
            if (location === undefined) {
                return false;
            }

            return Locations.find({
                'user'    : user                                                        ,
                'location': {'$near': {'$geometry': location, '$maxDistance': distance}}
            }).count() > 0;
        };

        var near = (function(location, distance) {
            return function(user) {
                return neighbour(location, distance, user);
            };
        })(user_location(Meteor.userId()), 1000);

        return Comments.find({
            'status': this.chat_id
        }).map(function(doc) {
            var author = Meteor.users.findOne({'_id': doc.author});
            return {
                'author': author._id,
                'first_name': author.profile.first_name,
                'last_name': author.profile.last_name,
                'author_class': (author._id === Meteor.userId()) ? 'is_author' : 'isnt_author',
                'distance_image': near(doc.author) ? 'near' : 'far',
                'date': formatdate(doc.date),
                'text': doc.text,
                'delete_comment_class': 'delete_twit'
            };
        });
    }
});

Template.chat.events({
    'click .js-open-dialog': function(event, template) {
        var status = Statuses.findOne({'_id': template.data.chat_id}, {'user': 1});
        if (status !== undefined) {
            Router.go('dialog', {'_id': status.user});
        }
    },
    'submit form': function(event, template) {
        event.preventDefault();

        var user = Meteor.userId();
        if (user === undefined || user === null) {
            return;
        }

        var comment = template.$('[name=comment]').val().trim();
        if (comment === '') {
            return;
        }

        Comments.insert({
            'status': template.data.chat_id,
            'date': new Date(),
            'author': user,
            'text': comment
        });

        event.target.comment.value = '';
        
        var scrollChat = document.getElementById("chat_screen");
        scrollChat.scrollTop = scrollChat.scrollHeight;
        
    }
});

function formatdate (date) {
   return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) +  '.' + date.getFullYear();
}
