import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Editor } from "../components/Editor";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import WorkspaceSampleTree from "./data/FileBrowser/workspace_sample.json"

import "./EditorStories.scss"

export default {
    title: 'Editor', 
    component: Editor,
    argTypes: {}
};

/**
 * Preview for the div being dragged.
 * @returns 
 */
function DragPreview({ label }) {
    return (
        <div
        style={{
            padding: "6px 12px",
            background: "#2d2d2d",
            color: "white",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            opacity:0.3
        }}
        >
        {label}
        </div>
    );
}

/**
 * Offset for the drag overlay.
 * @returns 
 */
const offsetOverlay = ({ transform }) => {
  return {
    ...transform,
    x: transform.x + 20,
    y: transform.y + 20
  };
};

export const flattenTree = (tree, level = 0) =>
  tree.flatMap(node => [
    { ...node, level },
    ...(node.children ? flattenTree(node.children, level + 1) : [])
  ]);

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const [dragPreviewLabel, setDragPreviewLabel] = useState(<></>);

    const editorRef = useRef();

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId("tab-group-1");
        const flat = flattenTree(WorkspaceSampleTree.tree);

        flat.forEach((node, index) => {
            if (node.type === "file") {
                editorRef.current.addTab(node);
            }
        });
        setTimeout(() => {
            // editorRef.current.selectTab("tab3");
        }, 100);
    }, []);

    const onDragStart = (event) => {
        console.log("");
        console.log("Drag Started");
        const dragPreview = editorRef.current.getPreviewElement(event.active.data.current.node.uid);
        setDragPreviewLabel(dragPreview);
    }

    const handleDragEnd = (event) =>{
        const { active, over } = event;

        if (over) {
            console.log("Dragged item:", active);
            console.log("Dropped on:", over);
        } else {
            console.log("Dropped outside any droppable");
            return;
        }

        if (active.data.current.type === "tab-draggable" && over.data.current.type === "tab-gutter") {
            editorRef.current.moveTab(active.data.current.node.uid, over.data.current.index);
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="editorStoryWrapper">
                <Editor ref={editorRef}{...args} />
            </div>
            <DragOverlay modifiers={[offsetOverlay]} dropAnimation={null}>
                {dragPreviewLabel}
            </DragOverlay>
        </DndContext>
    )
}

export const Default = Template.bind({});

Default.args = {
}