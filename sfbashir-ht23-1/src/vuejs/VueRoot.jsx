import Summary from "./summaryPresenter.jsx";

export default
function VueRoot(props){
    return (<div>
                {/* TODO TW1.5 Sidebar will be added here, inside a DIV, like Summary below */}
                <div><Summary model={props.model} /></div>
            </div>
           );
}

