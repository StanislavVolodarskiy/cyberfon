Template.menu.helpers({
    'username': function() {
        return Meteor.user().username;
    },
    'lat': function() {
        
        var each = function(obj, f) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    f(key, obj[key]);
                }
            }
        };
        var dump = function(title, obj) {
            console.log(title);
            each(obj, function(key, value) {
                console.log('   ' + key + ': ' + value);
            });
        };
        dump('error', Geolocation.error());
        dump('location', Geolocation.currentLocation());
        dump('coords', Geolocation.currentLocation().coords);
        dump('latLng', Geolocation.latLng());
        return 'UGU';
    }
});
