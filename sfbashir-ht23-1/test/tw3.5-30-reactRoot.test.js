import {testReact, testSuspense} from "./rootUtils";

describe("TW3.5 React root initial suspense [test](/react.html)", function tw3_5_30() {
    this.timeout(200000);

    it("ReactRoot displays app if the model is ready", async function tw3_5_30_1(){
        if(!await testReact(testSuspense))
            this.skip();
    });
});

