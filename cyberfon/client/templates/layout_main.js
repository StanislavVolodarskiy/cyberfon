Template.layout_main.helpers({
    'user_id': function() {
        return Meteor.userId();
    }
});
Template.layout_main.events({
    'click .js-back': function(event) {
        window.history.back();
    }
});
