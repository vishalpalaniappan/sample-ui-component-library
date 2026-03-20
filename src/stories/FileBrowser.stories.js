import { useEffect } from "react";
import { FileBrowser } from "../components/FileBrowser";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import FileTree1 from "./data/FileBrowser/Tree1.json"
import FileTree2 from "./data/FileBrowser/Tree2.json"
import WorkspaceSampleTree from "./data/FileBrowser/workspace_sample.json"

import "./FileBrowserStories.scss"

export default {
    title: 'FileBrowser', 
    component: FileBrowser,
    argTypes: {}
};


const Template = (args) => {
    const [, updateArgs] = useArgs();

    const onNodeSelect = (selectedFile) => {
        action('Selected Node:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onNodeSelect : onNodeSelect});
    }, []);

    return (
        <div className="viewerStoryWrapper">
            <div className="file-browser">
                <FileBrowser {...args} />
            </div>
        </div>
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