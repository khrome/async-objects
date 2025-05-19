import { chai } from '@environment-safe/chai';
import { it } from '@open-automaton/moka';
import * as objects from '../src/index.mjs';
const should = chai.should();
const ob = {};
objects.on(ob);

var object = {
    aKey : 'some value',
    anotherKey : 'some other value',
    oneMoreKey : 'yet more'
}

var anotherObject = {
    someKey : 'a value'
}

var poolSize = 2;

const asyncTest = async (o, handler, fnName)=>{
    await ob[fnName](object, handler);
};

const asyncTests = {
    unpooled : async (o, handler, fnName)=>{
        await ob[fnName](o, handler);
    },
    pooled : async (o, poolsize, handler, fnName)=>{
        await ob[fnName](o, poolsize, handler);
    }
}

const callbackTests = {
    unpooled : async (o, handler, fnName)=>{
        await new Promise((resolve)=>{
            ob[fnName](o, handler, ()=>{
                resolve();
            });
        });
    },
    pooled : async (o, poolsize, handler, fnName)=>{
        await new Promise((resolve)=>{
            ob[fnName](o, poolsize, handler, ()=>{
                resolve();
            });
        });
    }
}

const sequentialHandler = (context)=>{
    return (key, value, done)=>{
        context.count++;
        setTimeout(function(){
            context.count--;
            done();
        }, 50);
    };
}

const parallelHandler = (context, size)=>{
    return (key, value, done)=>{
        context.count++;
        setTimeout(function(){
            if(context.count === size) context.seen = true;
            context.count--;
            done();
        }, 50);
    };
}

const describeType = (description, type, tester)=>{
    describe(description, ()=>{
        it(`forEach only performs one action at a time - ${type}`, async ()=>{
            let context = {count : 0};
            await tester.unpooled(object, sequentialHandler(context), 'forEach');
            context.count.should.equal(0);
        });
        
        it(`forAll performs all actions at once - ${type}`, async ()=>{
            let context = {count : 0};
            const size = Object.keys(object).length;
            await tester.unpooled(object, parallelHandler(context, size), 'forAll');
            context.count.should.equal(0);
            context.seen.should.equal(true);
        });
        
        it(`forEachBatch only performs 2 actions at a time - ${type}`, async ()=>{
            let context = {count : 0};
            await tester.pooled(object, 2, parallelHandler(context, 2), 'forEachBatch');
            context.count.should.equal(0);
            context.seen.should.equal(true);
        });
    });
}

describe('async-objects', function(){
    
    describeType('Uses callbacks', 'cb', callbackTests);
    
    describeType('Uses async/promises', 'async', asyncTests);
    
});