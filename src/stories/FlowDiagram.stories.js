import { FlowDiagram } from "../components/FlowDiagram";
import "./FlowDiagram.scss"

import systemtrace from "./data/flow/flowDiagramSample.json";

export default {
    title: 'FlowDiagram', 
    component: FlowDiagram,
    argTypes: {
        traces: {
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
    traces: [systemtrace]
}