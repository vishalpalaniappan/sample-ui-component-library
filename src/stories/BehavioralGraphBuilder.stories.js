import { useCallback, useState, useEffect } from "react";
import { BehavioralGraphBuilder } from "../components/BehavioralGraphBuilder";
import { ToolBar } from "./components/ToolBar/ToolBar";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import design from "./data/Designs/simple_design_temp.json";
import "./BehavioralGraphBuilderStories.scss"

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

    const onBehaviorSelect = useCallback((behavior) => {
        action('Selected Behavior:')(behavior);
    }, []);
    
    useEffect(() => {
        updateArgs(
            {
                activeTool: activeTool,
                design: design,
                onBehaviorSelect: onBehaviorSelect
            }
        );
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