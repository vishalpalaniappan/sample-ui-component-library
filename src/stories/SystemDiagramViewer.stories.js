import { useEffect } from "react";
import { useArgs } from "@storybook/preview-api";
import { SystemDiagramViewer } from "../components/SystemDiagramViewer/SystemDiagramViewer";

import diagramJSON from "./data/diagram.json";

import "./SystemDiagramViewer.scss"

export default {
    title: 'SystemDiagramViewer', 
    component: SystemDiagramViewer,
    argTypes: {}
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    useEffect(() => {
    }, []);

    return (
        <div className="systemDiagramViewerWrapper">
            <SystemDiagramViewer {...args} />
        </div>
    )
}

export const Default = Template.bind({})

Default.args = {
    diagramJSON: diagramJSON
}