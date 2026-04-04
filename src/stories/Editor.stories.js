import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import { Editor } from "../components/Editor";
import { useArgs } from "@storybook/preview-api";
import EDITOR_MODES from "../components/Editor/EDITOR_MODES";
import { action } from "@storybook/addon-actions";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import WorkspaceSampleTree from "./data/FileBrowser/workspace_sample.json"
import transactiondb_mapping from "./data/Mapping/TransactionDB_mapping.json"
import { ToolBarEditor } from "./components/ToolBarEditor/ToolBarEditor";
import translator_mapping from "./data/Mapping/FrenchTranslator_mapping.json"

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
    const [selectTool, setSelectTool] = useState("select");
    const [mappedIds, setMappedIds] = useState([
        "c4f43010-71ef-46e6-bf38-0548d3a34012",
        "8bf2605a-1940-49de-9b2f-0efa22bf658c"
    ]);

    const editorRef = useRef();

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId("tab-group-1");
        flattenTree(WorkspaceSampleTree.tree).slice(1,5).forEach((node, index) => {
            if (node.type === "file") {
                editorRef.current.addTab(node);
            }
        });

        // const result = flattenTree(WorkspaceSampleTree.tree).find(
        //     (obj) => obj.name === "TransactionDB.py"
        // );
        // editorRef.current.addTab(result);translator_mapping
        // editorRef.current.setMapping("TransactionDB.py", transactiondb_mapping);
        // editorRef.current.setMapping("FrenchTranslator.py", translator_mapping);
        // editorRef.current.setMappedIds(mappedIds);

        // setTimeout(() => {
        //     console.log(editorRef.current.getTabs());
        //     console.log(editorRef.current.getActiveTab());
        // }, 5000);
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

        const handleKeyDown = (event) => {
            console.log("KEY DOWN");
            if (event.code === "KeyA") {
                editorRef.current.setMode(EDITOR_MODES.DESIGN);
            } else if (event.code === "KeyB") {
                editorRef.current.setMode(EDITOR_MODES.MAPPING);
            }
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("pointermove", handleMove);
        };
    }, [dragging, editorRef]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );

    const onSelectTool = useCallback((tool) => {
        if (tool === "mapping-mode") {
            editorRef.current.addTab(
                flattenTree(WorkspaceSampleTree.tree).slice(2,2)
            );
        } else if (tool === "implementation-mode") {
            editorRef.current.setMode(EDITOR_MODES.DESIGN);
        }
    }, [editorRef]);

    const onSelectAbstraction = useCallback((entry) => {
        action("Abstraction Selected")(entry);
        const found = mappedIds.find((id) => id === entry.uid);
        const newMap = (found)?
            mappedIds.filter((id) => id !== found):
            [...mappedIds, entry.uid];
        setMappedIds(newMap);
        editorRef.current.setMappedIds(newMap);
    }, [mappedIds, setMappedIds, editorRef]);

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={handleDragEnd}>

            <div className="editorRootContainer">
                <div className="toolbar">
                    <ToolBarEditor onSelectTool={onSelectTool} />
                </div>
                <div className="flow">
                    <Editor ref={editorRef} onSelectAbstraction={onSelectAbstraction} {...args} />
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
                </div>
            </div>
            
        </DndContext>
    )
}

export const Default = Template.bind({});

Default.args = {}