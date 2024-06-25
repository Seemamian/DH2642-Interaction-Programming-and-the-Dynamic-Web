export default function promiseNoData(promiseState) {
    if(!promiseState.promise) {
        return <div>No data</div>
    }

    if(!promiseState.data && !promiseState.error){
    return <img src="https://brfenergi.se/iprog/loading.gif"></img>
    }

    if(promiseState.promise && promiseState.error){
        return  <div>{promiseState.error.toString()}</div>
    }

    if(promiseState.promise && promiseState.data && !promiseState.error){
        return false; 
    } 
}
