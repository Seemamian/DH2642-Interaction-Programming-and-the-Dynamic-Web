import {testReact, testRoutes} from "./rootUtils";

describe("TW3.3 React navigation [test](/react.html)", function tw3_3_10() {
    this.timeout(200000);

    it("ReactRoot router", async function tw3_3_10_1(){
        if(!await testReact(testRoutes))
            this.skip();
    });
});
