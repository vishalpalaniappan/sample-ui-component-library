import { useEffect, useState, useRef } from "react";
import { Canvas } from 'reaflow';
import PropTypes from 'prop-types';

import { designToNodes } from "./helper";

import "./BehavioralGraphBuilder.scss";

/**
 * Renders a behavioral graph builder component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = ({}) => {

    const containerRef = useRef();
    const [size, setSize] = useState({ width: 0, height: 0 });

    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
            setSize({ width, height });
        });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const onNodeLink =(_event, from, to) => {
        const id = `${from.id}-${to.id}`;
        setEdges([
            ...edges,
            {
                id,
                from: from.id,
                to: to.id
            }
        ]);
    }

    return (
        <div ref={containerRef}  className="canvas-wrapper">
            <Canvas 
                nodes={nodes}
                edges={edges}
                width={size.width}
                height={size.height}
                onLayoutChange={onLayoutChange}
                onNodeLink={onNodeLink}
                panType="drag"
                fit
                center
            />
        </div>
    )
}

BehavioralGraphBuilder.propTypes = {
}
