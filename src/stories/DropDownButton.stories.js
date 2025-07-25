import { DropDownButton } from "../components/DropDownButton";
import "./DropDownButton.scss"

export default {
    title: 'DropDownButton', 
    component: DropDownButton,
    argTypes: {
    }
};

const Template = (args) => {

    return (
        <div className="rootButtonContainer">
            <div className="top">
                <DropDownButton  {...args}/> 
                <DropDownButton  {...args}/> 
                <DropDownButton  {...args}/> 
            </div>
            <div className="middle">
                <DropDownButton  {...args}/> 
                <DropDownButton  {...args}/> 
                <DropDownButton  {...args}/> 
            </div>
            <div className="bottom">
                <DropDownButton  {...args}/> 
                <DropDownButton  {...args}/> 
                <DropDownButton  {...args}/> 
            </div>
        </div>
    )
}

export const Default = Template.bind({})

Default.args = {
}