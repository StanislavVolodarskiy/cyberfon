Template.dialog.helpers({
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
            return message.time;
        });
    }
});

Template.dialog.events({
    'keydown input[type=text]': function(event) {
        if (event.which === 13 /* Enter */) {
            event.preventDefault();
            event.target.blur();
        }
    },
    'blur input[type=text]': function(event) {
        var user_id = Meteor.userId();
        var corr_id = this.corr_id;

        Messages.insert({
            'from': user_id,
            'to': corr_id,
            'time': new Date(),
            'text': event.target.value
        });
    }
});

Template.message.helpers({
    'author': function() {
        return Meteor.users.findOne({_id: this.from});
    }
});
