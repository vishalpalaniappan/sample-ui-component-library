import { useEffect } from "react";
import { StackList } from "../components/StackList";
import { useArgs } from "@storybook/preview-api";
import { action } from "@storybook/addon-actions";

import {BehavioralGraphBuilder} from "../components/BehavioralGraphBuilder/BehavioralGraphBuilder";

import "./BehavioralGraphBuilder.scss"

export default {
    title: 'BehavioralGraphBuilder', 
    component: BehavioralGraphBuilder,
    argTypes: {
        traces: {
            type: 'array'
        }
    }
};

const Template = (args) => {
    const [, updateArgs] = useArgs();

    useEffect(() => {
        updateArgs({});
    }, []);

    return (
        <div className="rootContainer">
            <BehavioralGraphBuilder  {...args}/> 
        </div>
    )
}


export const Default = Template.bind({})

Default.args = {
}
