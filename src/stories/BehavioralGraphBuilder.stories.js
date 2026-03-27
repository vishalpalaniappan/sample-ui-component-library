import { useEffect, useState, useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import {BehavioralGraphBuilder} from "../components/BehavioralGraphBuilder/BehavioralGraphBuilder";
import { ToolBar } from "./components/ToolBar/ToolBar";

import design from "./data/Designs/simple_designs_temp.json";

import "./BehavioralGraphBuilder.scss"

export default {
    title: 'BehavioralGraphBuilder', 
    component: BehavioralGraphBuilder,
    argTypes: {
    }
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const [activeTool, setActiveTool] = useState("select");

    const selectTool = useCallback((tool) => {
        updateArgs({activeTool : tool});
    }, [activeTool, setActiveTool]);

    useEffect(() => {
        updateArgs(
            {
                activeTool: activeTool,
                design: design
            });
    }, []);

    return (
        <div className="graphBuilderRootContainer">
            <div className="toolbar">
                <ToolBar onSelectTool={selectTool}/>
            </div>
            <div className="flow">
                <BehavioralGraphBuilder {...args}/> 
            </div>
        </div>
    )
}


export const Default = Template.bind({})

Default.args = {
    design: design
}
