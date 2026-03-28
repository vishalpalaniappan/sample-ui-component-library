import { useEffect, useState, useCallback, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import {BehavioralGraphBuilder} from "../components/BehavioralGraphBuilder/BehavioralGraphBuilder";
import { ToolBar } from "./components/ToolBar/ToolBar";

import { DALEngine } from "dal-engine-core-js-lib-dev";

import design from "./data/Designs/simple_designs_temp.json";

import "./BehavioralGraphBuilder.scss"
import { node } from "prop-types";

export default {
    title: 'BehavioralGraphBuilder', 
    component: BehavioralGraphBuilder,
    argTypes: {
    }
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const editorRef = useRef();

    const [engine, setEngine] = useState();

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
            const engine = new DALEngine({name:"testEngine"});
            engine.deserialize(JSON.stringify(design));
            editorRef.current.updateEngine(engine);
            setEngine(engine);
            setTimeout(() => {
                engine.addNode("testBehavior", []);
                engine.addNode("testBehavior2", []);
                editorRef.current.updateEngine(engine);
            }, 4000);
        }
    }, [design, editorRef]);

    const connectBehaviors = useCallback((from, to) => {
        if (!to) return;
        action("Connect Behaviors")(from, to);
        const node = engine.graph.findNode(from.id);
        node.addGoToBehavior(to.id);
        editorRef.current.updateEngine(engine);
    }, [editorRef, engine]);

    const deleteBehavior = useCallback((node) => {
        action("Delete Behavior")(node);
    }, [engine, editorRef]); 

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
