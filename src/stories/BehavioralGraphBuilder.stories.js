import { useEffect, useState, useCallback, useRef } from "react";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import { BehavioralGraphBuilder } from "../components/BehavioralGraphBuilder/BehavioralGraphBuilder";
import { ToolBar } from "./components/ToolBar/ToolBar";

import { DALEngine } from "dal-engine-core-js-lib-dev";

import design from "./data/Designs/simple_designs_temp.json";

import "./BehavioralGraphBuilder.scss";

export default {
    title: "BehavioralGraphBuilder",
    component: BehavioralGraphBuilder,
    argTypes: {},
};

let count = 0;

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const editorRef = useRef();

    const [engine, setEngine] = useState();

    const [activeTool, setActiveTool] = useState("select");

    const selectTool = useCallback(
        (tool) => {
            updateArgs({ activeTool: tool });
            setActiveTool(tool);

            if (tool === "add-node") {
                engine.addNode("node-" + count++, []);
                editorRef.current.updateEngine(engine);
            }
        },
        [activeTool, setActiveTool, engine],
    );

    useEffect(() => {
        updateArgs({
            activeTool: activeTool,
            design: design,
        });
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            const engine = new DALEngine({ name: "testEngine" });
            setEngine(engine);
            editorRef.current.updateEngine(engine);
            setTimeout(() => {
                engine.addNode("testBehavior", []);
                engine.addNode("testBehavior2", []);
                editorRef.current.updateEngine(engine);
            }, 4000);
        }
    }, [design, editorRef]);

    const connectBehaviors = useCallback(
        (from, to) => {
            if (!to) return;
            action("Connect Behaviors")(from, to);
            engine.getNode(from.id).addGoToBehavior(to.id);
            editorRef.current.updateEngine(engine);
        },
        [editorRef, engine],
    );

    const deleteBehavior = useCallback(
        (node) => {
            action("Delete Behavior")(node);
            engine.removeNode(node.id);
            editorRef.current.updateEngine(engine);
        },
        [engine, editorRef],
    );

    const deleteTransition = useCallback(
        (edge) => {
            action("Delete Transition")(edge);
            const fromNode = engine.getNode(edge.from);
            fromNode.removeGoToBehavior(edge.to);
            editorRef.current.updateEngine(engine);
        },
        [engine, editorRef],
    );

    const selectBehavior = useCallback(
        (nodeId) => {
            action("Select Behavior")(nodeId);
        },
        [],
    );

    return (
        <div className="graphBuilderRootContainer">
            <div className="toolbar">
                <ToolBar onSelectTool={selectTool} />
            </div>
            <div className="flow">
                <BehavioralGraphBuilder
                    ref={editorRef}
                    {...args}
                    connectBehaviors={connectBehaviors}
                    deleteTransition={deleteTransition}
                    deleteBehavior={deleteBehavior}
                    selectBehavior={selectBehavior}
                />
            </div>
        </div>
    );
};

export const Default = Template.bind({});

Default.args = {
    design: design,
};
