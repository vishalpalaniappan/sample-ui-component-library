import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FileBrowserV2 } from "../components/FileBrowserV2";
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

import "./FileBrowserV2Stories.scss"

export default {
    title: 'FileBrowserV2', 
    component: FileBrowserV2,
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

    const onSelectFile = (selectedFile) => {
        action('Selected Node:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onSelectFile : onSelectFile});
    }, []);

    useLayoutEffect(() => {
        fileBrowserRef.current.addFileTree(args.tree);
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
            <div className="viewerStoryWrapper">
                <div className="file-browser">
                    <FileBrowserV2 ref={fileBrowserRef} {...args} />
                </div>
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

export const SampleTree = Template.bind({});

SampleTree.args = {
    tree: WorkspaceSampleTree.tree
}