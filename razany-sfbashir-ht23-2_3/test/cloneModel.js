// one-level cloning
export default function(model){
    const ret= {...model};
    Object.entries(model).forEach(function(e){
	if(e[1]  && typeof(e[1])=='object')
	    ret[e[0]]=Array.isArray(e[1])?[...e[1]]:{...e[1]};
    });
    return ret;
}
