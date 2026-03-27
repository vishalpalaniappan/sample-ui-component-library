import { useEffect, useState, useCallback } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import {BehavioralGraphBuilder} from "../components/BehavioralGraphBuilder/BehavioralGraphBuilder";
import { ToolBar } from "./components/ToolBar/ToolBar";

import "./BehavioralGraphBuilder.scss"

export default {
    title: 'BehavioralGraphBuilder', 
    component: BehavioralGraphBuilder,
    argTypes: {
        traces: {
            type: 'array'
        }
    }
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const [activeTool, setActiveTool] = useState("select");

    const selectTool = useCallback((tool) => {
        updateArgs({activeTool : tool});
    }, [activeTool, setActiveTool]);

    useEffect(() => {
        updateArgs({});
    }, []);

    return (
        <div className="graphBuilderRootContainer">
            <div className="toolbar">
                <ToolBar onSelectTool={selectTool}/>
            </div>
            <div className="flow">
                <BehavioralGraphBuilder activeTool={activeTool} {...args}/> 
            </div>
        </div>
    )
}


export const Default = Template.bind({})

Default.args = {
}
