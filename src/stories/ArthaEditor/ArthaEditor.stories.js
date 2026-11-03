import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Editor } from "../../components/Editor";
import { FileBrowser } from "../../components/FileBrowser";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";


import WorkspaceSampleTree from "../data/Artha/coffee_shop/designFiles.json"

import "./ArthaEditor.scss"

export default {
    title: 'ArthaEditor', 
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
    const fileBrowserRef = useRef();

    useLayoutEffect(() => {
        fileBrowserRef.current.addFileTree(args.tree);
    }, []);

    const onSelectFile = (selectedFile) => {
        action('Selected Node:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onSelectFile : onSelectFile});
    }, []);

    const onDragStart = (event) => {

    }

    const handleDragEnd = (event) => {

    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8
            }
        })
    );


    const editorRef = useRef();

    useLayoutEffect(() => {
        editorRef.current.setTabGroupId("tab-group-1");
        flattenTree(WorkspaceSampleTree).forEach((node, index) => {
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

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={handleDragEnd}>
            <div className="editorStoryWrapper">
                <div className="fileBrowserWrapper">
                    <FileBrowser ref={fileBrowserRef} {...args}/>
                </div>
                <div className="editorWrapper">
                    <div className="editorStoryWrapper">
                        <Editor ref={editorRef}{...args} />
                    </div>
                </div>
            </div>
        </DndContext>
    )
}

export const Default = Template.bind({});

Default.args = {
    tree: WorkspaceSampleTree
}