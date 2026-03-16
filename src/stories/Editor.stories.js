import { useEffect } from "react";
import { Editor } from "../components/Editor";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
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

    const onFileSelect = (selectedFile) => {
        action('Selected Stack Position:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onFileSelect : onFileSelect});
    }, []);

    /**
     * Callback for when drag ends.
     */
    const handleDragEnd = (event) =>{
        const { active, over } = event;
        console.log("Drag Ended");
        const rect = event.activatorEvent;

        console.log(over );

        if (over) {
            console.log("Dragged item:", active.id);
            console.log("Dropped on:", over.id);
        } else {
            console.log("Dropped outside any droppable");
        }
    }

    /**
     * Callback for when drag is started.
     */
    const onDragStart = (event) => {
        console.log("Drag Started");
    }

    return (
        <DndContext onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="editorStoryWrapper">
                <Editor {...args} />
            </div>
            <DragOverlay modifiers={[offsetOverlay]} dropAnimation={null}>
                <DragPreview label={"preview"}/>
            </DragOverlay>
        </DndContext>
    )
}

export const Default = Template.bind({});

Default.args = {
    systemTree: fileTrees.fileTrees
}