import {
    forAllEmissionsInPool,
    forAllEmissions,
    forEachEmission
} from 'async-arrays/async-arrays.mjs';

export const forEach = function(object, callback, complete){
    let completeFn = complete;
    let result = null;
    if(!completeFn) result = new Promise((resolve)=> completeFn = resolve);
    forEachEmission(Object.keys(object), function(key, index, done){
        callback(object[key], key, done);
    }, completeFn);
    return result;
};
export const forAll = function(object, callback, complete){
    let completeFn = complete;
    let result = null;
    if(!completeFn) result = new Promise((resolve)=> completeFn = resolve);
    forAllEmissions(Object.keys(object), function(key, index, done){
        callback(object[key], key, done);
    }, completeFn);
    return result;
};
export const forEachBatch = function(object, poolSize, callback, complete){
    let completeFn = complete;
    let result = null;
    if(!completeFn) result = new Promise((resolve)=> completeFn = resolve);
    forAllEmissionsInPool(Object.keys(object), poolSize, function(key, index, done){
        callback(object[key], key, done);
    }, completeFn);
    return result;
};
export const interleave = function(data, ob){
    ob = ob.clone(ob);
    ob.forEach(data, function(item, key){
        if(type(item) == 'object' && type(ob[key]) == 'object') ob[key] = ob.interleave(item, ob[key]);
        else{
            if((!ob[key])) ob[key] = item;
        }
    });
    return ob;
};
export const map = function(obj, callback, excludeUndefined){
    var result = {}
    ob.forEach(obj, function(item, index){
        var res = callback(item, index, result);
        if(excludeUndefined && res === undefined) return;
        result[index] = res;
    });
    return result;
};

export const random = function(object, callback){
    var keys = Object.keys(object);
    var randomIndex = Math.floor(Math.random()*Object.keys(object).length);
    callback(object[keys[randomIndex]], keys[randomIndex]);
};
export const merge = function(objOne, objTwo){
    var result = {};
    forEach(objOne, function(item, key){
        result[key] = item;
    });
    forEach(objTwo, function(item, key){
        if(!result[key]) result[key] = item;
    });
    return result;
};
export const clone = function(obj){
    if(!obj) return;
    var result;
    if(obj.clone && type(obj.clone) == 'function') return obj.clone();
    else 
    switch(type(obj)){
        case 'object':
            result = {};
            for(var key in obj){
                result[key] = clone(obj[key]);
            }
            break;
        case 'array':
            result = obj.map(function(item){return ob.clone(item); });
            break;
        default : result = obj;
    }
    return result;
};
export const filter = function(data, test, callback){
    var results = {};
    ob.forEach(data, function(item, key){
        if(test(key, item)) results[key] = item;
    });
    return results;
};

export const on = function(ob){
    ob = ob || {};
    if(!ob.clone) ob.clone = function(obj){
        return clone(obj);
    };

    // allows you to act on each member in an array one at a time 
    // (while being able to perform asynchronous tasks internally)
    if(!ob.forEach) ob.forEach = function(object, callback, complete){
        return forEach(object, callback, complete);
    };

    //allows you to act on each member in a chain in parallel
    if(!ob.forAll) ob.forAll = function(object, callback, complete){
        return forAll(object, callback, complete);
    };

    //allows you to act on each member in a pool, with a maximum number of active jobs until complete
    if(!ob.forEachBatch) ob.forEachBatch = function(object, poolSize, callback, complete){
        return forEachBatch(object, poolSize, callback, complete);
    };

    if(!ob.interleave) ob.interleave = function(data, ob){
        return interleave(data, ob);
    };
    
    if(!ob.random) ob.random = function(object, callback){
        return random(object, callback);
    }

    if(!ob.merge) ob.merge = function(objOne, objTwo){
        return merge(objOne, objTwo);
    };

    if(!ob.map) ob.map = function(obj, callback, excludeUndefined){
        return map(obj, callback, excludeUndefined);
    };

    if(!ob.filter) ob.filter = function(data, test, callback){
        return filter(data, test, callback);
    };
    
    return ob;
}