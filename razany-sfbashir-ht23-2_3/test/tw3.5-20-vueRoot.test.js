import {testVue, testSuspense} from "./rootUtils";

describe("TW3.5 Vue root initial suspense [test](/vue.html)", function tw3_5_20() {
    this.timeout(200000);

    it("VueRoot displays app if the model is ready", async function tw3_5_20_1(){
        if(!await testVue(testSuspense)) this.skip();;
    });
});
