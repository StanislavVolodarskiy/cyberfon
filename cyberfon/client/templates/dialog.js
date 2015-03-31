Template.dialog.helpers({
    'user_id': function() {
        return Meteor.userId();
    },
    'correspondent': function() {
        return Meteor.users.findOne({'_id': this.corr_id});
    },
    'messages': function() {
        var user_id = Meteor.userId();
        var corr_id = this.corr_id;
        var outgoing = Messages.find({'from': user_id, 'to': corr_id}).fetch();
        var incoming = Messages.find({'from': corr_id, 'to': user_id}).fetch();

        var merge = function(a1, a2, key){
            var list = [];
            var i1 = 0;
            var i2 = 0;

            while (i1 < a1.length && i2 < a2.length){
                list.push((key(a1[i1]) < key(a2[i2])) ? a1[i1++] : a2[i2++]);
            }

            return list.concat(a1.slice(i1)).concat(a2.slice(i2));
        };
        return merge(outgoing, incoming, function(message) {
            return message.date;
        });
    }
});

Template.dialog.events({
    'submit form': function(event, template) {
        event.preventDefault();

        var user_id = Meteor.userId();
        var corr_id = this.corr_id;

        var message = template.$('[name=message]').val().trim();
        if (message === '') {
            return;
        }

        Messages.insert({
            'from': user_id,
            'to': corr_id,
            'date': formatdate(new Date()),
            'text': message
        });

        event.target.message.value = '';
        
        var scrollChat = document.getElementById("dialog_screen_id");
        scrollChat.scrollTop = scrollChat.scrollHeight;
    }
});

Template.message.helpers({
    'first_name': function() {
        return Meteor.users.findOne({_id: this.from}).profile.first_name;
    },
    'last_name': function() {
        return Meteor.users.findOne({_id: this.from}).profile.last_name;
    },
    'author_class': function() {
        return (this.from == Meteor.userId()) ? 'is_author' : 'isnt_author';
    }
});

function formatdate (date) {
   return ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) +  '.' + date.getFullYear().toString().substr(2,2);
}

Template.dialog.rendered = function() {
    if(!this._rendered) {
      this._rendered = true;
      var height = window.innerHeight - 44 - 44;
      document.getElementById('dialog_screen_id').style.height = height + 'px';
    }
};