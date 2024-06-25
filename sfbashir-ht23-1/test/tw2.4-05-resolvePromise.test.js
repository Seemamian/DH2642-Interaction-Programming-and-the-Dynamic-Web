import { expect } from 'chai';

import getModule from "./filesToTest.js";
const X= TEST_PREFIX;
const resolvePromise= (await getModule(`/src/${X}resolvePromise.js`))?.default;

function sleep(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}

describe('TW2.4 resolvePromise [test](/tw2.4.0.html)', function tw2_4_05() {
  this.timeout(200000);

  before(function tw2_4_05_before() {
    if (!resolvePromise) this.skip();
  });

    it('resolvePromise sets data after the promise resolves', async function tw2_4_05_2() {
        let promiseState = {};
        resolvePromise(sleep(10).then(function(){ return 42; }), promiseState);
        expect(promiseState.promise, "promiseState.promise should be set").to.be.ok;
        expect(promiseState.data, "promiseState.data should be null initially").to.be.null;
        expect(promiseState.error, "promiseState.data should be null initially").to.be.null;
        await sleep(15);
        expect(promiseState.promise, "promiseState.promise should be set").to.be.ok;
        expect(promiseState.data, "promiseState.data should be set when the promise resolves").to.equal(42);
        expect(promiseState.error, "promiseState.error should remain null when the promise resolves").to.be.null;
        
    });

    it('resolvePromise sets error after the promise rejects', async function tw2_4_05_3() {
        let promiseState = {};
        resolvePromise(sleep(10).then(function(){ throw 42; }), promiseState);
        expect(promiseState.promise, "promiseState.promise should be set").to.be.ok;
        expect(promiseState.data, "promiseState.data should be null initially").to.be.null;
        expect(promiseState.error, "promiseState.data should be null initially").to.be.null;
        await sleep(15);
        expect(promiseState.promise, "promiseState.promise should be set").to.be.ok;
        expect(promiseState.error, "promiseState.error should be set when the promise rejects").to.equal(42);
        expect(promiseState.data, "promiseState.data should remain null when the promise rejects ").to.be.null;
  });

    it('resolvePromise checks for null promise', async function tw2_4_05_1() {
        let promiseState = {};
        
        expect(function () {
            resolvePromise(null, promiseState);
        }, "Must check whether the promise is null, as in that case it makes no sense to invoke then() or catch()"
              ).to.not.throw();
  });
  it('resolvePromise check for race condition', async function tw2_4_05_4() {
    const promiseState = {};

    function makeCallback(ms) {
        function returnDataACB() {
            return 'resolved after ' + ms;
      }

        function tw2_4_05_4_laterACB(){
            const promise= sleep(ms).then(returnDataACB);
            promise.name="promiseToResolveAfter_"+ms;
            resolvePromise(promise, promiseState);
            return promise;
        }
        return tw2_4_05_4_laterACB;
    }

      await Promise.all([
          sleep(1).then(makeCallback(100)),
          sleep(3).then(makeCallback(2)),
      ]);
      expect(promiseState.promise).to.be.ok;
      expect(promiseState.promise.name).to.be.equal('promiseToResolveAfter_2', "latest promise should be set in promiseState.promise");
      expect(promiseState.data).to.be.equal('resolved after 2', "latest promise result should be set in promiseState.data");
  });
});
