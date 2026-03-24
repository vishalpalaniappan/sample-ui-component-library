import { BehavioralGraphBuilder } from "../components/BehavioralGraphBuilder";
import "./BehavioralGraphBuilderStories.scss"

export default {
    title: 'BehavioralGraphBuilder', 
    component: BehavioralGraphBuilder,
    argTypes: {
    }
};

const Template = (args) => {

    return (
        <div className="graphBuilderRootContainer">
            <BehavioralGraphBuilder  {...args}/> 
        </div>
    )
}

export const Default = Template.bind({})

Default.args = {
}