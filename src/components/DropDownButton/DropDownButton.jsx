import "./DropDownButton.scss";
import PropTypes from 'prop-types';

import { List } from "react-bootstrap-icons";


/**
 * Renders a button with a dropdown menu.
 * 
 * @return {JSX}
 */
export const DropDownButton = ({}) => {
    
    return (
        <div className="buttonContainer"> 
            <List className="button" />
        </div>
    );
}

DropDownButton.propTypes = {
}