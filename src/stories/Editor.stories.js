import { useEffect, useState } from "react";
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
    
    const [tabs, setTabs] = useState(
        {
            "id": "tab-group-1",
            "tabs": [
                { id: "tab1", label: "Tab 1" },
                { id: "tab2", label: "Tab 2" },
                { id: "tab3", label: "Tab 3" },
            ]
        }
    );

    // Storybook specific effect
    useEffect(() => {
        updateArgs({tabsInfo : tabs});
    }, [tabs]);

    
    const moveTab = (tabId, newIndex) => {
        setTabs(prev => {
            const oldIndex = prev.tabs.findIndex(t => t.id === tabId);
            if (oldIndex === -1) return prev;
            const newTabs = [...prev.tabs];
            const [tab] = newTabs.splice(oldIndex, 1);
            newTabs.splice(newIndex, 0, tab);
            return {...prev,tabs: newTabs};
        });
    }

    /**
     * Callback for when drag ends.
     */
    const handleDragEnd = (event) =>{
        const { active, over } = event;

        if (active.data.current.type === "tab-draggable" && over.data.current.type === "tab-gutter") {
            moveTab(active.id, over.data.current.index);
        }

        if (over) {
            console.log("Dragged item:", active);
            console.log("Dropped on:", over);
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