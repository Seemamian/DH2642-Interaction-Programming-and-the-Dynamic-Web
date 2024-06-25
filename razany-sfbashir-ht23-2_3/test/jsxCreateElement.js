export default function installOwnCreateElement(){
    const h= window.React?.createElement;
    window.React={createElement: function(tag, props, ...children){
        return {tag, props, children};
    }};
    return h;
}
