import { useEffect, useState, useCallback, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import {BehavioralGraphBuilder} from "../components/BehavioralGraphBuilder/BehavioralGraphBuilder";
import { ToolBar } from "./components/ToolBar/ToolBar";

import { DALEngine } from "dal-engine-core-js-lib-dev";

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

    const editorRef = useRef();

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

    useEffect(() => {
        if (editorRef.current) {
            const engine = new DALEngine({});
            engine.deserialize(JSON.stringify(design));
            editorRef.current.updateEngine(engine);
        }
    }, [design, editorRef]);

    const connectBehaviors = useCallback((from, to) => {
        action("Connect Behaviors")(from, to);
    }, []);

    const deleteBehavior = useCallback((id) => {
        action("Delete Behavior")(id);
    }, []); 

    return (
        <div className="graphBuilderRootContainer">
            <div className="toolbar">
                <ToolBar onSelectTool={selectTool}/>
            </div>
            <div className="flow">
                <BehavioralGraphBuilder ref={editorRef} {...args} connectBehaviors={connectBehaviors} deleteBehavior={deleteBehavior}/> 
            </div>
        </div>
    )
}


export const Default = Template.bind({})

Default.args = {
    design: design
}
