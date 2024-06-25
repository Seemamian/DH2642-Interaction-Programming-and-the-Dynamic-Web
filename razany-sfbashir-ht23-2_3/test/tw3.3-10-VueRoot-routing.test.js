import {testVue, testRoutes} from "./rootUtils";

describe("TW3.3 Vue navigation [test](/vue.html)", function tw3_3_10() {
    this.timeout(200000);

    it("VueRoot router", async function tw3_3_10_1(){
        if(!await testVue(testRoutes)) this.skip();;
    });
});
