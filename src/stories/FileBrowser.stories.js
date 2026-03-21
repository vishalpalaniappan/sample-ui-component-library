import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FileBrowser } from "../components/FileBrowser";
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

import "./FileBrowserStories.scss"

export default {
    title: 'FileBrowser', 
    component: FileBrowser,
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


const Template = (args) => {
    const [, updateArgs] = useArgs();
    const fileBrowserRef = useRef();
    
    const [dragPreviewLabel, setDragPreviewLabel] = useState(<></>);

    const onNodeSelect = (selectedFile) => {
        action('Selected Node:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onNodeSelect : onNodeSelect});
    }, []);


    useLayoutEffect(() => {
        fileBrowserRef.current.addFileTree(args.tree);

        setTimeout(() => {
            fileBrowserRef.current.selectNode("dir-f6459410-1634-4dbc-8d76-35896822158d");
        }, 3000);
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
        const dragPreview = fileBrowserRef.current.getPreviewElement(event.active.data.current.node.uid);
        setDragPreviewLabel(dragPreview);
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
                    <FileBrowser ref={fileBrowserRef} {...args} />
                </div>
            </div>
            <DragOverlay modifiers={[offsetOverlay]} dropAnimation={null}>
                {dragPreviewLabel}
            </DragOverlay>
        </DndContext>
    )
}

export const SampleTree = Template.bind({});

SampleTree.args = {
    tree: WorkspaceSampleTree.tree
}