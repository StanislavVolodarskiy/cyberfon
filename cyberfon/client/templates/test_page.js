(function() {

    var dump = function(id, cb) {
        return function() {
            console.log(id + ' ' + Array.prototype.slice.call(arguments).join(' '));
            cb([]);
        };
    };

    var read_wifis = (Meteor.isCordova) ? function(cb) {
        WifiWizard.startScan(
            function() {
                WifiWizard.getScanResults(function(wifis) {
                    cb(_.map(wifis, function(wifi) {return {'mac': wifi['BSSID']};}));
                }, dump('WifiWizard.getScanResults.fail', cb));
            },
            dump('WifiWizard.startScan.fail', cb)
        );
    } : function(cb) {
        cb([]);
    };

    var read_cells = (Meteor.isCordova) ? function(cb) {
        CellInfo.gsmCells(function(gsm_cells) {
            _.each(gsm_cells, function(cell) {
                cell['cellid'] = cell['id'];
                delete cell['id'];
            });
            cb(gsm_cells);
        }, dump('CellInfo.gsmCells.failure', cb));
    } : function(cb) {
        cb([]);
    };

    var cells    = new ReactiveVar();
    var wifis    = new ReactiveVar();
    var response = new ReactiveVar();

    Template.test_page.helpers({
        'wifis'   : function() {return JSON.stringify(wifis   .get(), null, 4);},
        'cells'   : function() {return JSON.stringify(cells   .get(), null, 4);},
        'response': function() {return JSON.stringify(response.get(), null, 4);}
    });

    Template.test_page.events({
        'click .js-show-request': function(event, template) {
            event.preventDefault();
            read_cells(function(gsm_cells    ) {cells.set(gsm_cells    );});
            read_wifis(function(wifi_networks) {wifis.set(wifi_networks);});
        },
        'click .js-call-locator': function(event, template) {
            event.preventDefault();
            if (cells.get().length > 0 || wifis.get().length > 0) {
                Meteor.call('yandexLocator', cells.get(), wifis.get(), function(error, result) {
                    if (error !== undefined) {
                        response.set(error);
                        return;
                    }
                    response.set(result);
                });
            }
        }
    });
})();
