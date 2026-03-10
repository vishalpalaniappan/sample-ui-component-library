import { useEffect } from "react";
import { FileBrowser } from "../components/FileBrowser";
import { useArgs } from "@storybook/preview-api";

import FileTree1 from "./data/FileBrowser/Tree1.json"

import "./FileBrowserStories.scss"

export default {
    title: 'FileBrowser', 
    component: FileBrowser,
    argTypes: {}
};


const Template = (args) => {
    const [, updateArgs] = useArgs();

    const onFileSelect = (selectedFile) => {
        console.log("Selected sdffile: ", selectedFile);
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