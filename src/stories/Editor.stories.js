import { useEffect } from "react";
import { Editor } from "../components/Editor";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import fileTrees from "./data/filetree.json";

import "./EditorStories.scss"

export default {
    title: 'Editor', 
    component: Editor,
    argTypes: {}
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    const onFileSelect = (selectedFile) => {
        action('Selected Stack Position:')(selectedFile);
    }

    useEffect(() => {
        updateArgs({onFileSelect : onFileSelect});
    }, []);

    return (
        <div className="editorStoryWrapper">
            <Editor {...args} />
        </div>
    )
}

export const Default = Template.bind({});

Default.args = {
    systemTree: fileTrees.fileTrees
}