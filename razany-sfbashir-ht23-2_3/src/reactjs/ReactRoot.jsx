import Summary from "./summaryPresenter.jsx";
import SidebarPresenter from "./sidebarPresenter.jsx";
import DetailsPresenter from "./detailsPresenter.jsx";
import SearchPresenter from "./searchPresenter.jsx";
import {  createHashRouter,  RouterProvider} from "react-router-dom";
import { observer } from "mobx-react-lite";


export default
observer(    
function ReactRoot(props){
  const routes= [
    {
      path: "/",
      element: <SearchPresenter model={props.model} />,
    },
    {
      path: "/search",
      element: <SearchPresenter model={props.model} />,
    },
    {
      path: "/summary", 
      element: <Summary model={props.model} />
    },
    {
      path: "/details", 
      element: <DetailsPresenter model={props.model} />
    }];

    console.log(props.model.ready);

 
    if (props.model.ready){
      return (
      <div class="flexParent">
        <div class="sidebar debug">          
          <SidebarPresenter model={props.model} />
        </div>
      
        <div class="mainContent debug">
            <RouterProvider router={createHashRouter(routes)} />
        </div>
      </div>
      );
    } else {
      return <img src="https://brfenergi.se/iprog/loading.gif"></img>
    }
}
)
