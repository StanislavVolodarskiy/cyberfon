
ServiceConfiguration.configurations.remove({
    'service': 'vk'
});

ServiceConfiguration.configurations.insert({
    'service': 'vk',
    'appId'  : '4910052',
    'secret' : '3GT1pXVf5eXkArMoXalz'
});

Meteor.methods({
    'get_url': function(url) {
        return HTTP.get(url, {});
    }
});
