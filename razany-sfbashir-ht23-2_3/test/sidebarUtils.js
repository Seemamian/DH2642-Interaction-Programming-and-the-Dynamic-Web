import { assert, expect } from "chai";
import {findTag, prepareViewWithCustomEvents} from "./jsxUtilities.js";
import {dishInformation} from "./mockFetch.js";
import getModule from "./filesToTest.js";

const X= TEST_PREFIX;

const SidebarView= (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;


function plusMinusEventName(){
    const{customEventNames, customEventParams}= prepareViewWithCustomEvents(
        SidebarView,
        {
            number:5,
            dishes:[dishInformation]

        },
        function collectControls(rendering){
            const buttons=findTag("button", rendering);
            expect(buttons[0].children[0], "Sidebar first button should have the label -").to.equal("-");
            expect(buttons[1].children[0], "Sidebar second button should have the label +").to.equal("+");
            return [buttons[0], buttons[1]];
        });

    
    const[minus, plus] = customEventNames;
    const[minusParam, plusParam]= customEventParams;
    expect(plus, "+ and - buttons should fire the same custom event").to.equal(minus);
    
    expect(plusParam.length, "expected custom event "+plus+" to be fired with one parameter").to.equal(1);
    expect(plusParam[0], "expected custom event "+plus+" to have a number parameter, number prop plus 1 for the plus button").to.equal(6);
    
    expect(minusParam.length, "expected custom event "+plus+" to be fired with one parameter").to.equal(1);
    expect(minusParam[0], "expected custom event "+plus+" to have a number parameter, number prop minus 1 for the minus button").to.equal(4);
    return minus;
}

function removeEventName(lenient){
    const dishes= [dishInformation, {...dishInformation, id:42}, {...dishInformation, id:43}];
    const{customEventNames, customEventParams}= prepareViewWithCustomEvents(
        SidebarView,
        {
            number:5,
            dishes
        },
        function collectControls(rendering){
            const buttons=findTag("button", rendering);
            expect(buttons.length, "Sidebar view expected to have 5 buttons when there are three dishes").to.equal(5);
            expect(buttons[0].children[0], "Sidebar first button should have the label -").to.equal("-");
            expect(buttons[1].children[0], "Sidebar second button should have the label +").to.equal("+");
            expect(buttons[2].children[0].toLowerCase(), "Sidebar third button should have the label x").to.equal("x");
            return [buttons[2], buttons[3], buttons[4]];
        });
    const[xButton1, xButton2, xButton3] = customEventNames;
    expect(xButton1, "custom events fired by all x buttons should have the same name").to.equal(xButton2);
    expect(xButton2, "custom events fired by all x buttons should have the same name").to.equal(xButton3);

    if(!lenient){
        const[removeParam1, removeParam2, removeParam3]= customEventParams;
        expect(removeParam1.length, "expected custom event "+xButton1+" to be fired with one parameter").to.equal(1);
        expect(removeParam1[0], "expected custom event "+xButton1+" fired on the first x button to have the first dish as parameter").to.deep.equal(dishInformation);
        
        expect(removeParam3.length, "expected custom event "+xButton1+" to be fired with one parameter").to.equal(1);
        expect(removeParam3[0], "expected custom event "+xButton1+" fired on the thrid x button to have the third dish as parameter").to.deep.equal(dishes[2]);
    }
    return xButton1;
}


function currentDishEventName(lenient){
    const dishes= [dishInformation, {...dishInformation, id:42}, {...dishInformation, id:43}];
    const{customEventNames, customEventParams}= prepareViewWithCustomEvents(
        SidebarView,
        {
            number:5,
            dishes
        },
        function collectControls(rendering){
            const links=findTag("a", rendering);
            expect(links.length, "Sidebar view expected to have 5 buttons when there are three dishes").to.equal(3);
            return links;
            
        });
    const[setCurrent1, setCurrent2, setCurrent3] = customEventNames;

    expect(setCurrent1, "custom events fired by all x buttons should have the same name").to.equal(setCurrent2);
    expect(setCurrent2, "custom events fired by all x buttons should have the same name").to.equal(setCurrent3);

    
    const[currentParam1, currentParam2, currentParam3]= customEventParams;
    if(!lenient){
        expect(currentParam1.length, "expected custom event "+setCurrent1+" to be fired with one parameter").to.equal(1);
        expect(currentParam1[0], "expected custom event "+setCurrent1+" fired on the first link to have the first dish as parameter").to.deep.equal(dishInformation);
        expect(currentParam2[0], "expected custom event "+setCurrent1+" fired on the second link to have the second dish as parameter").to.deep.equal(dishes[1]);
    }
    return setCurrent1;
}

export {plusMinusEventName, removeEventName, currentDishEventName};
