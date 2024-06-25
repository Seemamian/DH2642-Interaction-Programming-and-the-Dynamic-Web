function compressHistory(arr){
    return arr.reduce(function(acc, elem, index){
        if(index==0)
            return [elem];
        if(elem==acc.slice(-1)[0]  || JSON.stringify(elem)==JSON.stringify(acc.slice(-1)[0]))
            return acc;
        return [...acc, elem];
    }, []);
}


export {compressHistory};
