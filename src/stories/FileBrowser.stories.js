import { useEffect } from "react";
import { FileBrowser } from "../components/FileBrowser";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import FileTree1 from "./data/FileBrowser/Tree1.json"
import FileTree2 from "./data/FileBrowser/Tree2.json"

import "./FileBrowserStories.scss"

export default {
    title: 'FileBrowser', 
    component: FileBrowser,
    argTypes: {}
};


const Template = (args) => {
    const [, updateArgs] = useArgs();

    const onFileSelect = (selectedFile) => {
        action('Selected File:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onFileSelect : onFileSelect});
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