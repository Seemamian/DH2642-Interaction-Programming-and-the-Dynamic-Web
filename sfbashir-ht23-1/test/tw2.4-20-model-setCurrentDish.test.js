import { expect } from "chai";
import {withMyFetch, myDetailsFetch} from "./mockFetch.js";
import getModule from "./filesToTest.js";
import cloneModel from "./cloneModel.js";

const X = TEST_PREFIX;
const modelTemplate= cloneModel((await getModule(`/src/${X}DinnerModel.js`))?.default);

const VueDetailsPresenter= (await getModule(`/src/vuejs/${X}detailsPresenter.jsx`))?.default;
const ReactDetailsPresenter= (await getModule(`/src/reactjs/${X}detailsPresenter.jsx`))?.default;

describe("TW2.4 Promise state in Model: current dish [test](/tw2.4.html)", function tw_2_4_20() {
  this.timeout(200000);

    let model;
    before(function(){
        try{
            model = cloneModel(modelTemplate);
        }catch(e) { console.error(e); }
        if(model && !model.currentDishPromiseState) this.skip();
    });
  this.beforeEach(function tw_2_4_20_beforeEach() {
      try{
          model= cloneModel(modelTemplate);
      }catch(e){console.error(e);}
  });
    it("Model initializes currentDishPromiseState (needed to enable test)", function tw_2_4_20_1() {
      this._runnable.title= "Model initializes currentDishPromiseState correctly";      
        expect(model, "Model could not be imported, please check the top of your Console!").to.be.ok;
    expect(
      model,
      "model must have currentDishPromiseState property"
    ).to.have.property("currentDishPromiseState");
      expect(JSON.stringify(model.currentDishPromiseState), "currentDishPromiseState expected to be initially an empty object").to.equal(
      JSON.stringify({})
    );
  });

    it("setCurrentDish sets currentDishPromiseState if it gets a valid dish id", async function tw_2_4_20_2() {

    expect(model).to.have.property("currentDishPromiseState");
    let dishId = 601651;
    withMyFetch(myDetailsFetch, ()=>model.setCurrentDish(dishId));
    expect(
      model.currentDishPromiseState,
      "currentDishPromiseState must have a property called promise"
    ).to.have.property("promise");
    expect(
      model.currentDishPromiseState.data,
      "currentDishPromiseState must have a property called data which is initially null"
    ).to.be.null;
    expect(
      model.currentDishPromiseState.error,
      "currentDishPromiseState must have a property called error which is initially null"
    ).to.be.null;
    expect(
      model.currentDishPromiseState.promise,
      "currentDishPromiseState must have a property called promise which is initially null"
    ).to.not.be.null;
    await model.currentDishPromiseState.promise;
    expect(
      model.currentDishPromiseState.data,
      "current data in currentDishPromiseState must have the property of id after a promise result"
    ).to.have.property("id");
    expect(
      model.currentDishPromiseState.data.id,
      "current data in currentDishPromiseState must have the correct dish id of: " +
        dishId
    ).to.equal(dishId);
  });

  it("setCurrentDish does not initiate a new promise when its id argument is falsy", function tw_2_4_20_3() {
    model.setCurrentDish(undefined);
    expect(model).to.have.property("currentDishPromiseState");
    expect(
      JSON.stringify(model.currentDishPromiseState),
      "What should be done when you receive an undefined id in setCurrentDish?"
    ).to.equal(JSON.stringify({}));
  });

  it("setCurrentDish does not initiate a new promise if the id argument is the same as before", function tw_2_4_20_4() {
    let dishId = 601651;
    model.currentDish = dishId;
    model.setCurrentDish(dishId);
    expect(model).to.have.property("currentDishPromiseState");
    expect(
      JSON.stringify(model.currentDishPromiseState),
      "What should be done when you receive an id that is the same as the currentDishId in setCurrentDish?"
    ).to.equal(JSON.stringify({}));
  });
});
