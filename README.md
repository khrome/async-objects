async-objects.js
===============

[![NPM version](https://img.shields.io/npm/v/async-objects.svg)]()
[![npm](https://img.shields.io/npm/dt/async-objects.svg)]()
[![Travis](https://img.shields.io/travis/khrome/async-objects.svg)]()

An object-based flow control library to use when I want something more lightweight. YMMV

common.js support is currently provided through a 1.0 shim.

Usage
-----
I find, most of the time, my asynchronous logic emerges from a list and I really just want to be able to control the completion of some job, and have a signal for all jobs.

you can either use the functions as returned:

    import * as objects from 'async-objects';
    objects.forEach(object, iteratorFn, callback);
    //or await objects.forEach(object, iteratorFn);
    
or you can add them to `Object`

    objects.on(Object);

forEachEmission : execute serially

    Object.forEach(object, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissions : execute all jobs in parallel

    Object.forAll(object, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAllEmissionsInPool : execute all jobs in parallel up to a maximum #, then queue for later

    Object.forEachBatch(object, poolSize, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
a cloner for recursively copying any object/array
    
    var copy = Object.clone(object);
    
a non-referencing interleaver(it clones as it interleaves)

    var combined = Object.interleave(object, anotherObject);
    
a shallow object merge
    
    var combined = Object.merge(objOne, objTwo);

a map, to process all object values

    var mappedObject = Object.map(object, mapFn[, excludeUndefinedValues]);

a filter to reduce the fields in an object

    var filteredObject = Object.filter(object, testFn);
    


That's just about it, and even better you can open up the source and check it out yourself. Super simple.

Testing
-------

Run the legacy commonjs test suite
```bash
npm run require-test
```
Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser with graphical results:

```bash
npm run browser-test
```
to run the same test headless in a browser with commandline results:
```bash
npm run headless-<browser>-test
```
where `<browser>` is one of `firefox`, `safari` or `chrome`
(add `-- --open --head` to open the browsers process for investigation)

Enjoy,

-Abbey Hawk Sparrow