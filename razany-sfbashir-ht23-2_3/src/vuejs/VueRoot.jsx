import SidebarPresenter from "./sidebarPresenter.jsx";
import SearchPresenter from "./searchPresenter.jsx";
import Summary from "./summaryPresenter.jsx";
import DetailsPresenter from "./detailsPresenter.jsx";
import "/src/style.css";

import { createRouter, createWebHashHistory, RouterView} from "vue-router";
import { reactive, KeepAlive } from "vue";

// This sends the data to the model presenter

export function makeRouter(model){
  const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
        path: "/",
        component: <SearchPresenter model={model} />,
    },
    {
        path: "/search",
        component: <SearchPresenter model={model} />,
    },
    {
      path: "/summary", 
      component: <Summary model={model} />
    },
    {
      path: "/details", 
      component: <DetailsPresenter model={model} />
    }
 
 ] , });

  return router;
}


export default
function VueRoot(props){
  console.log(props.model);

  if (props.model.ready){
    return (
      <div class="flexParent">
        <div class="sidebar debug">          
           <SidebarPresenter model={props.model} />
        </div>
      <div class="mainContent debug">
      <RouterView/>  
      </div>
    </div>
    );
  } else {
    return <img src="https://brfenergi.se/iprog/loading.gif"></img> // om modellen inte är redo än spegla loading image
  }
    
}

