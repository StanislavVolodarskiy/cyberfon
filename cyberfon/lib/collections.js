Messages = new Meteor.Collection('messages');
if (Meteor.isServer) {
    Messages._ensureIndex({'from': 1, 'to': 1, 'time': 1});
}
