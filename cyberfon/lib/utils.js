Utils = (function() {

    var make_ordered_dict = function() {

        var dict = {};
        var head = {};
        head['prev'] = head;
        head['next'] = head;

        var insert_node_before = function(place, key, value) {
            var prev = place.prev;
            var next = place;

            var node = {
                'prev' : prev ,
                'next' : next ,
                'key'  : key  ,
                'value': value
            };
            prev.next = node;
            next.prev = node;

            return node;
        };

        var remove_node = function(node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        };

        var put = function(key, value) {
            console.log('PUT', key, value);
            if (dict.hasOwnProperty(key)) {
                dict[key]['value'] = value;
            } else {
                dict[key] = insert_node_before(head, key, value);
            }
        };

        var get = function(key) {
            console.log('GET', key);
            return (dict.hasOwnProperty(key)) ? dict[key]['value'] : undefined;
        };

        var has = function(key) {
            console.log('HAS', key);
            return dict.hasOwnProperty(key);
        };

        var remove = function(key) {
            console.log('REMOVE', key);
            if (dict.hasOwnProperty(key)) {
                remove_node(dict[key]);
                delete dict[key];
            }
        };

        var each = function(f) {
            for (var node = head.next; node !== head; node = node.next) {
                f(node['value'], node['key']);
            }
        };

        var map = function(f) {
            var list = [];
            each(function(v, k) { list.push(f(v, k)); });
            return list;
        };

        var filter = function(p, f) {
            var list = [];
            each(function(v, k) {
                if (p(v, k)) {
                    list.push(f(v, k));
                }
            });
            return list;
        };

        return {
            'put'   : put,
            'get'   : get,
            'has'   : has,
            'remove': remove,
            'each'  : each,
            'map'   : map,
            'filter': filter
        };
    };
    
    var make_set = function(array) {
        var dict = {};
        _.each(array, function(v) {
            dict[v] = undefined;
        });
        return function(v) {return dict.hasOwnProperty(v);};
    };

    return {
        'make_set': make_set,
        'make_ordered_dict': make_ordered_dict
    };
})();
