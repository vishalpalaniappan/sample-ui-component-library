import { useEffect } from "react";
import { FileBrowser } from "../components/FileBrowser";
import { useArgs } from "@storybook/preview-api";

import fileTrees from "./data/filetree.json";

import "./FileBrowserStories.scss"

export default {
    title: 'FileBrowser', 
    component: FileBrowser,
    argTypes: {}
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    useEffect(() => {
        updateArgs({});
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
    systemTree: fileTrees.fileTrees
}