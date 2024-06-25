import {render} from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";

import getModule from "/test/filesToTest.js";
import getType from "/test/componentType.js";

const X= TEST_PREFIX;

const SidebarView= !window.location.toString().includes("react") && (await getModule(`/src/views/${X}sidebarView.vue`))?.default ||
      (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;

if(!SidebarView)
    render(<div>Please define /src/views/sidebarView.jsx</div>,  document.getElementById('root'));

if(SidebarView)    
    render(
        <div>
          <div>This page tests TW1.2 Basic Rendering for a SidebarView {getType(SidebarView)}. We render SidebarView twice. The first rendering sets the number prop to 5. The second rendering checks whether the - button gets disabled when the number prop is 1.
            <p>Note: the rendering tests are not interactive. You will listen to events at TW1.4, and make the interface fully interactive at TW1.5</p>
          </div>
          <hr/>
          <SidebarView number={5} dishes={[]} />
          <hr/>
          <SidebarView number={1} dishes={[]} />
        </div>,
        document.getElementById('root')
    );

    
