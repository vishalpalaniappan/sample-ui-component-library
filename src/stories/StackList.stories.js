import { useEffect } from "react";
import { StackList } from "../components/StackList";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import "./StackListStories.scss"

export default {
    title: 'CallStack', 
    component: StackList,
    argTypes: {
        traces: {
            type: 'array'
        }
    }
};

const Template = (args) => {
    const [, updateArgs] = useArgs();
    
    const selectTraceItem = (selectedIndex) => {
        action('Selected Stack Position:')(selectedIndex);
        const newTraces = [];
        args.traces.forEach((value, index) => {
            value.selected = (selectedIndex == index);
            newTraces.push(value);
        });
        updateArgs({traces : newTraces});
    };

    useEffect(() => {
        updateArgs({selectTraceItem : selectTraceItem});
    }, []);

    return (
        <div className="rootContainer">
            <div className="stackContainer">
                <StackList  {...args}/> 
            </div>
        </div>
    )
}


export const Default = Template.bind({})

Default.args = {
    traces: [
        {functionName:"visit_arg", fileName: "helper.py", lineNumber: 3},
        {functionName:"__init__", fileName: "helper.py", lineNumber: 65},
        {functionName:"injectLogTypesA", fileName: "LogInjector.py", lineNumber: 3, selected: true},
        {functionName:"visit_import", fileName: "LogInjector.py", lineNumber: 3},
        {functionName:"__init__", fileName: "LogInjector.py", lineNumber: 65},
        {functionName:"run", fileName: "ProgramProcessor.py", lineNumber: 3},
        {functionName:"main", fileName: "main.py", lineNumber: 3},
        {functionName:"<module>", fileName: "main.py", lineNumber: 65}
    ]
}


export const StackTopSelected = Template.bind({})

StackTopSelected.args = {
    traces: [
        {functionName:"visit_arg", fileName: "helper.py", lineNumber: 3, selected: true},
        {functionName:"__init__", fileName: "helper.py", lineNumber: 65},
        {functionName:"injectLogTypesA", fileName: "LogInjector.py", lineNumber: 3},
        {functionName:"visit_import", fileName: "LogInjector.py", lineNumber: 3},
        {functionName:"__init__", fileName: "LogInjector.py", lineNumber: 65},
        {functionName:"run", fileName: "ProgramProcessor.py", lineNumber: 3},
        {functionName:"main", fileName: "main.py", lineNumber: 3},
        {functionName:"<module>", fileName: "main.py", lineNumber: 65}
    ]
}

export const WithException = Template.bind({})

WithException.args = {
    traces: [
        {functionName:"visit_arg", fileName: "helper.py", hasException: true,  lineNumber: 3, selected: true},
        {functionName:"__init__", fileName: "helper.py", lineNumber: 65},
        {functionName:"injectLogTypesA", fileName: "LogInjector.py", lineNumber: 3},
        {functionName:"visit_import", fileName: "LogInjector.py", lineNumber: 3},
        {functionName:"__init__", fileName: "LogInjector.py", lineNumber: 65},
        {functionName:"run", fileName: "ProgramProcessor.py", lineNumber: 3},
        {functionName:"main", fileName: "main.py", lineNumber: 3},
        {functionName:"<module>", fileName: "main.py", lineNumber: 65}
    ]
}