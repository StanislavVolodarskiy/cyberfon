/*
(function() {

    var dump = function(id, args) {
        var dump = function() {
            console.log(id + ' ' + Array.prototype.slice.call(arguments).join(' '));
        };
        if (args == undefined) {
            return dump;
        }
        dump.apply(null, args);
    };

    var read_wifis = (Meteor.isCordova) ? function(cb) {
        WifiWizard.startScan(
            function() {
                dump('WifiWizard.startScan.success', arguments);
                WifiWizard.getScanResults(cb(networks), dump('WifiWizard.getScanResults.fail'));
            },
            dump('WifiWizard.startScan.fail')
        );
    } : function(cb) {
        cb([]);
    };

    var read_cells = (Meteor.isCordova) ? function(cb) {
        CellInfo.gsmCells(cb, dump('failure'));
    } : function(cb) {
        cb({});
    }

    var cells    = new ReactiveVar();
    var wifis    = new ReactiveVar();
    var response = new ReactiveVar();

    Template.test_page.helpers({
        'wifis'   : function() {
            console.log('UGU');
            return JSON.stringify(wifis   .get(), null, 4);},
        'cells'   : function() {return JSON.stringify(cells   .get(), null, 4);},
        'response': function() {return JSON.stringify(response.get(), null, 4);}
    });

    Template.test_page.events({
        'click .js-show-request': function(event, template) {
            event.preventDefault();
            console.log('UGU');
            read_cells(function(gsm_cells    ) {cells.set(gsm_cells    );});
            console.log('UGU');
            read_wifis(function(wifi_networks) {wifis.set(wifi_networks);});
            console.log('UGU');
        },
        'click .js-call-locator': function(event, template) {
            event.preventDefault();
            Meteor.call('yandexLocator', cells.get(), wifis.get(), function(error, result) {
                if (error !== undefined) {
                    response.set(error);
                    return;
                }
                response.set(result);
            });
        }
    });
})();
*/
