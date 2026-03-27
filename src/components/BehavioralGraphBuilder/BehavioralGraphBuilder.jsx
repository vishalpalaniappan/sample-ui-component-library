import { useEffect, useState, useRef } from "react";
import { Canvas } from 'reaflow';
import PropTypes from 'prop-types';

import "./BehavioralGraphBuilder.scss";

const nodes = [
    {
        id: '1',
        text: '1'
    },
    {
        id: '2',
        text: '2'
    }
];

const edges = [
    {
        id: '1-2',
        from: '1',
        to: '2'
    }
];

/**
 * Renders a behavioral graph builder component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = ({ activeTool }) => {

    const containerRef = useRef();
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
        });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        console.log("Active tool changed: ", activeTool);
    }, [activeTool]);

    return (
        <div ref={containerRef}  className="canvas-wrapper">
            <Canvas 
                nodes={nodes}
                edges={edges}
                width={size.width}
                height={size.height}
                fit
                center
            />
        </div>
    )
}

BehavioralGraphBuilder.propTypes = {
}
