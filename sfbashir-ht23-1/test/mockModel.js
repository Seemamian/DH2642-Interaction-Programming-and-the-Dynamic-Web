function dummyMethod(){
    throw new Error("unexpected Model method invocation. Check your stacktrace! A presenter is only expected to call certain methods of the model");
}
const mock= {
    numberOfGuests:2,
    setNumberOfGuests:dummyMethod,
    dishes:[],
    addToMenu:dummyMethod,
    removeFromMenu:dummyMethod,
    currentDish: undefined,
    setCurrentDish:dummyMethod,
    searchParams:dummyMethod,
    setSearchQuery:dummyMethod,
    setSearchType:dummyMethod,
    searchResultsPromiseState:{},
    doSearch:dummyMethod,
    currentDishPromiseState:{},
};

export default function (context="") {
    return {
        get(model, prop){
            model.a_DH2642_note="This is a dummy model that we use to test your Presenter. We do not test Presenters with your own DinnerModel in order to ensure that whatever problems we detect come from the Presenter and not from the model";
            if(typeof prop=="symbol")
                return model[prop];
            if(prop.startsWith("__v"))
                return model[prop];
            if(model[prop]!==undefined)
                return model[prop];
	    if(prop.startsWith("isMobX"))
	        return model[prop];
            console.error("Warning: unexpected access to Model "+prop+". A default value will be returned "+(context&&"(in: "+context+")"));
            return mock[prop];
        },
        set(model, prop, value){
            throw new Error("You are never expected to change Model properties directly. Use a method. Attempting to change "+prop+(context&&" from "+context));
        }
    };
}
