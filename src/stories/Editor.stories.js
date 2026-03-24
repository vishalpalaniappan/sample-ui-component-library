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

const flattenTree = (tree, level = 0) =>
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
        flattenTree(WorkspaceSampleTree.tree).forEach((node, index) => {
            if (node.type === "file") {
                editorRef.current.addTab(node);
            }
        });


        const node = {
            "name": "SAMPLE",
            "type": "file",
            "uid": "dissr-f6459410-1634-4dbc-8d76-35896822158d",
            "content": "1234"
        }

        editorRef.current.addTab(node,2);
    }, []);

const [dragging, setDragging] = useState(false);
  
    /**
     * Callback for when drag ends.
     */
    const handleDragEnd = (event) =>{
        const { active, over } = event;
        console.log("Drag Ended");
        const rect = event.activatorEvent;

        console.log(active, over);

        if (over) {
            console.log("Dragged item:", active.id);
            console.log("Dropped on:", over.id);
        } else {
            console.log("Dropped outside any droppable");
        }
        setDragging(false);
    }

    /**
     * Callback for when drag is started.
     */
    const onDragStart = (event) => {
        console.log("Drag Started");
        console.log(event.active.data);
        setDragPreviewLabel(event.active.data.current.preview);
        setDragging(true);
    }

    // Manually track the drag position.
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (!dragging) return;

        const handleMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("pointermove", handleMove);

        return () => {
            window.removeEventListener("pointermove", handleMove);
        };
    }, [dragging]);

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
            {dragging && (
                <div
                    style={{
                        position: "fixed",
                        left: pos.x,
                        top: pos.y,
                        pointerEvents: "none",
                        zIndex: 9999,
                    }}>
                    {dragPreviewLabel}
                </div>
            )}  
        </DndContext>
    )
}

export const Default = Template.bind({});

Default.args = {}