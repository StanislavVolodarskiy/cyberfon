Template.layout_main.helpers({
    'user_id': function() {
        return Meteor.userId();
    }
});
Template.layout_main.events({
    'click .js-back': function() {
        window.history.back();
    },
    'click .js-open-favorites': function() {
        Router.go('favorites');
    },
    'click .js-open-dialogs': function() {
        Router.go('dialogs');
    }
});
