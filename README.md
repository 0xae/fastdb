# fastdb

Fastdb brings indexedDB to angularJS on the cool, concise and fast promise way.

The library is designed to be as simple and fast as possible.

## Live Features

* Total integration with angularJS

* $q compatible

* plug and play (i mean inject and keep going)

* Drop in replacement for mozilla [$localForage](https://github.com/localForage/localForage)

## Getting Started

Download the minified version.
Specify the dependency:

        angular.module('mymodule', [... , 'fastDbModule', ...])

Inject the fastdb service:

        angular.controller('mycontroller', function($fastdb) {
                ...
                $fastdb.setItem('key1', 'some value')
                .then(function (){ console.log('set'); }, function (error) { // handle the error });
        });

## API

All methods of $fastdb return promises.

Set an item:

        $fastdb.setItem(key, value)

Get an item:

        $fastdb.getItem(key)
        .then(function (val){ // deal with value here}, function (error) { // handle the error here });

Clear the table:

        $fastdb.clear()

Remove an item from the store:

        $fastdb.removeItem(key)

Count entries on table:
        
        $fastdb.length()

Set of keys on the table:

        $fastdb.keys()



## TESTS

Comming soon...

