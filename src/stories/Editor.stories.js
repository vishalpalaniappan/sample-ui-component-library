import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Editor } from "../components/Editor";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import fileTrees from "./data/filetree.json";

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

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const [dragPreviewLabel, setDragPreviewLabel] = useState(<></>);

    const editorRef = useRef();

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId("tab-group-1");
        editorRef.current.addTab({ id: "tab1", label: "Tab 1", content: "Content for Tab 1" });
        editorRef.current.addTab({ id: "tab2", label: "Tab 2", content: "Content for Tab 2" });
        editorRef.current.addTab({ id: "tab3", label: "Tab 3", content: "Content for Tab 3" });
        editorRef.current.addTab({ id: "tab4", label: "Tab 4", content: "Content for Tab 4" });
        editorRef.current.addTab({ id: "tab5", label: "Tab 5", content: "Content for Tab 5" });
        editorRef.current.addTab({ id: "tab6", label: "Tab 6", content: "Content for Tab 6" });
        setTimeout(() => {
            editorRef.current.selectTab("tab1");
        }, 100);
    }, []);

    const onDragStart = (event) => {
        console.log("");
        console.log("Drag Started");
        const dragPreview = editorRef.current.getPreviewElement(event.active.data.current.tabId);
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
            editorRef.current.moveTab(active.data.current.tabId, over.data.current.index);
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
    systemTree: fileTrees.fileTrees
}