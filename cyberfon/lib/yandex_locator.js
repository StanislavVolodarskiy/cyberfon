if (Meteor.isServer) {
    Meteor.methods({
        'yandexLocator': function(gsm_cells, wifi_networks) {
            this.unblock();
            return HTTP.post('http://api.lbs.yandex.net/geolocation', {
                'params': {
                    'json': JSON.stringify({
                        'common': {
                            'version': '1.0',
                            'api_key': 'AAHzI1UBAAAAwTCUDAIACUNCCIzZwhAH3P6TG-qV1OpwxjQAAAAAAAAAAACQyMVLz9nwIQMUZyUcKzZwZ-1W0w=='
                        },
                        'gsm_cells': gsm_cells,
                        'wifi_networks': wifi_networks
                    })
                }
            }).data;
        }
    });
}
