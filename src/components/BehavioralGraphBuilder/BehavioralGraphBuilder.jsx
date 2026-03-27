import { useEffect, useState, useRef } from "react";
import { Canvas } from 'reaflow';
import PropTypes from 'prop-types';

import { designToReactFlowElements } from "./helper";

import "./BehavioralGraphBuilder.scss";

const exampleNodes = [
    {
        id: '1',
        text: 'AcceptBookFromUser'
    },
    {
        id: '2',
        text: 'PlaceBookInBasket'
    }
];

const exampleEdges = [
    {
        id: '1-2',
        from: '1',
        to: '2'
    },
    {
        id: '2-1',
        from: '2',
        to: '1'
    }
];

/**
 * Renders a behavioral graph builder component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = ({ activeTool , design}) => {

    const containerRef = useRef();
    const [size, setSize] = useState({ width: 0, height: 0 });

    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        if (design) {
            console.log(design);
            const { nodes, edges } = designToReactFlowElements(design);
            console.log("Converted nodes: ", nodes);
            console.log("Converted edges: ", edges);
            setNodes(nodes);
            setEdges(edges);
        }
    }, [design]);

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

    const onLayoutChange = (layout) => {
        console.log("Layout changed: ", layout);
    }

    return (
        <div ref={containerRef}  className="canvas-wrapper">
            <Canvas 
                nodes={nodes}
                edges={edges}
                width={size.width}
                height={size.height}
                onLayoutChange={onLayoutChange}
                panType="drag"
                fit
                center
            />
        </div>
    )
}

BehavioralGraphBuilder.propTypes = {
}
