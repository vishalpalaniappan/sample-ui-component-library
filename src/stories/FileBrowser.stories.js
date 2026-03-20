import { useEffect } from "react";
import { FileBrowser } from "../components/FileBrowser";
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

import FileTree1 from "./data/FileBrowser/Tree1.json"
import FileTree2 from "./data/FileBrowser/Tree2.json"
import WorkspaceSampleTree from "./data/FileBrowser/workspace_sample.json"

import "./FileBrowserStories.scss"

export default {
    title: 'FileBrowser', 
    component: FileBrowser,
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

    const onNodeSelect = (selectedFile) => {
        action('Selected Node:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onNodeSelect : onNodeSelect});
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="viewerStoryWrapper">
                <div className="file-browser">
                    <FileBrowser {...args} />
                </div>
            </div>
            <DragOverlay modifiers={[offsetOverlay]} dropAnimation={null}>
                <DragPreview label={"preview"}/>
            </DragOverlay>
        </DndContext>
    )
}

export const Default = Template.bind({});

Default.args = {
    tree: FileTree1.tree
}

export const Tree2 = Template.bind({});

Tree2.args = {
    tree: FileTree2.tree
}

export const SampleTree = Template.bind({});

SampleTree.args = {
    tree: WorkspaceSampleTree.tree
}