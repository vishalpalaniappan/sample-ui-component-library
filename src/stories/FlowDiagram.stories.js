import { FlowDiagram } from "../components/FlowDiagram";
import "./FlowDiagram.scss"

import sampleTree from "./data/flow/SampleTree.json";

export default {
    title: 'FlowDiagram', 
    component: FlowDiagram,
    argTypes: {
        treeInfo: {
            type: 'array'
        }
    }
};

const Template = (args) => {

    return (
        <div className="rootTraceContainer">
            <FlowDiagram  {...args}/> 
        </div>
    )
}

export const Default = Template.bind({})

Default.args = {
    treeInfo: sampleTree
}