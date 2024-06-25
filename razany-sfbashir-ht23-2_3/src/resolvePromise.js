export default function resolvePromise(prms, promiseState) {
    promiseState.promise= prms;
    promiseState.data= null;
    promiseState.error= null;

    function resolvedDataACB(resolveData){
        if (promiseState.promise === prms) {
            promiseState.data = resolveData;
        }
    }

    function failedErrorACB(errorData) {
        if (promiseState.promise === prms) {
            promiseState.error = errorData;
        }
    }

    if (!promiseState.promise) {
        return null;
    }    

    //HOW TO SHOW LOADING PICTURE ?? 
    
    prms.then(resolvedDataACB).catch(failedErrorACB);

}