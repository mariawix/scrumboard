define(function(require) {
    'use strict';
    var APP_ID = 'XjxchNOzvFd3vQtsmLYDlx4Eejx2nEG6jpv74f2R',
        JS_KEY = 'QuaW5EFDVR6rVPeA1qLnBQhY5Uze3OH86zhyoz5V',
        parseClassNames = {cardClass: 'Card', sprintClass: 'Sprint', teamClass: 'Team', memberClass: 'Member'},
        parseClasses = {},

        itemsCounter;

    function init() {
        itemsCounter = 0;
        _.forIn(parseClassNames, function(value, key) {
            parseClasses[value] = Parse.Object.extend(value);
        });
        Parse.initialize(APP_ID, JS_KEY);
    }

    function logError() {
        var error = (arguments.length === 1) ? arguments[0] : arguments[1];
        console.log('operation failed: ' + error.message + ' (' + error.code + ')');
    }

    function addItem(item, className) {
        var parseItemObject = new parseClasses[className](),
            promise = new Parse.Promise();
        _.forIn(item, function(value, key) {
           parseItemObject.set(key, value);
        });
        parseItemObject.save(null).then(function(obj) {
            promise.resolve(obj.id);
        }, function(error) {
            logError(error);
            promise.reject();
        });
        return promise;
    }

    function addItems(items, className) {
        var promise = new Parse.Promise(),
            parseItemObjects = _.map(items, function(item){
            var obj =  new parseClasses[className]();
            _.forIn(item, function(value, key) {
                obj.set(key, value);
            });
            return obj;
        });
        Parse.Object.saveAll(parseItemObjects).then(function(objects){
            var ids = _.map(objects, function(obj) {
                return obj.id;
            });
            promise.resolve(ids);
        }, function(error){
            logError(error);
            promise.reject();
        });
        return promise;
    }
    function removeItem(itemID, className) {
        var query = new Parse.Query(parseClasses[className]);
        query.get(itemID).then(function(parseItemObject) {
            console.dir(parseItemObject);
            //parseItemObject.destroy();
            parseClasses[className].destroyAll([parseItemObject], {success: function(){console.log('success', arguments);}, error: logError});
        }, logError);
    }

    function setItemProperties(itemID, className, itemProperty) {
        var query = new Parse.Query(parseClasses[className]);
        query.get(itemID).then(function(parseItemObject) {
            _.forIn(itemProperty, function(value, key) {
                parseItemObject.set(key, value);
            });
            parseItemObject.save(null);
        }, logError);
    }

    function getItemByID(itemID, className) {
        var promise = new Parse.Promise(),
            query = new Parse.Query(parseClasses[className]);
        query.get(itemID).then(function(parseItemObject){
            promise.resolve(parseItemObject);
        }, function() {
            logError(arguments);
            promise.reject();
        });
        return promise;
    }

    function check() {
        var me = {name: 'Maria'},
            card = {
                description: 'parse',
                startDate: _.now(),
                state: 'submitted',
                points: 5},
            members = [
                {name: 'Tom E'},
                {name: 'Tom R'},
                {name: 'Tzabar'},
                {name: 'Itay'},
                {name: 'Maya'},
                {name: 'Nofar'},
                {name: 'David'}
            ];


        addItem(me, parseClassNames.memberClass).then(function(myID) {
            //setItemProperties(myID, parseClassNames.memberClass, {'asdasfdas': 'jhgdjhgdjsh', 'dhkfjh': 'jkdhfkjdhk'});
            removeItem(myID, parseClassNames.memberClass);
        });

        addItems(members, parseClassNames.memberClass).then(function(IDs) {
            // do something with IDs
        });
        //addItem(card, parseClassNames.cardClass);

    }

    return {
        init: init,
        addItem: addItem,
        addItems: addItems,
        removeItem: removeItem,
        setItemProperties: setItemProperties,
        getItemByID: getItemByID,
        check: check,
        parseClassNames: parseClassNames
    };
});
