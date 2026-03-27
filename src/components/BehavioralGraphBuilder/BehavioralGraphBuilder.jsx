import { useEffect } from "react";
import "./BehavioralGraphBuilder.scss";
import PropTypes from 'prop-types';

/**
 * Renders a behavioral graph builder component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = ({activeTool}) => {

    useEffect(() => {
        console.log("Active tool changed: ", activeTool);
    }, [activeTool]);
    
    return (
        <div></div>
    )
}

BehavioralGraphBuilder.propTypes = {
}
