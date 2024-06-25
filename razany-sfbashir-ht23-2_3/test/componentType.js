export default function getType(component){
    if(!component) return "";
    if(typeof component == "function")
        return "";
    if(component.setup && component.template)
        return "(composition API, template)";
    if(component.__file?.indexOf(".vue")!=-1)
        return "(SFC)";
    if(component.setup && !component.template)
        return "(composition API)";
    return "";
}
