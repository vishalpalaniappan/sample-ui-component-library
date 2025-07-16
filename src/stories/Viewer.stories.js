import { useEffect } from "react";
import { Viewer } from "../components/Viewer";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import fileTrees from "./data/filetree.json";

import "./ViewerStories.scss"

export default {
    title: 'Viewer', 
    component: Viewer,
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
        <div className="viewerContainer">
            <Viewer {...args} />
        </div>
    )
}

export const Default = Template.bind({})

console.log(fileTrees);

Default.args = {
    systemTree: fileTrees.fileTrees
}