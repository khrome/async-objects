var should = require("should");
var art = require('./async-arrays');

describe('async-objects', function(){
    
    describe('uses forEachEmission', function(){
        
        it('to only perform one action at a time', function(complete){
            complete();
        });
    
    });
    
    describe('uses forAllEmissions', function(){
        
        it('to perform all actions in parallel', function(complete){
            complete();
        });
    
    });
    
    describe('uses forAllEmissionsInPool', function(){
        
        it('to perform N actions in parallel', function(complete){
            complete();
        });
    
    });
});