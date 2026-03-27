import { useEffect, useState, useRef, useImperativeHandle, useMemo, useCallback } from "react";
import { Canvas } from 'reaflow';
import PropTypes from 'prop-types';

import { designToNodes } from "./helper";

import "./BehavioralGraphBuilder.scss";

/**
 * Renders a behavioral graph editor component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = forwardRef(({connectBehaviors, deleteBehavior}, ref) => {

    // Resizer to set canvas size to match container
    // TODO: Issues with zooming and resizing, need to explore.
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


    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    const onNodeLink =(_event, from, to) => {
        connectBehaviors(from, to);
    }

    const onNodeRemove = (id) => {
        deleteBehavior(id);
    }

    const setDesign = useCallback((design) => {
        if (design) {
            const { nodes, edges } = designToNodes(design);
            setNodes(nodes);
            setEdges(edges);
        }
    }, [setNodes, setEdges]);

    const api = useMemo(() => {
        return {
            setDesign
        };
    }, [setDesign]);
    
    useImperativeHandle(ref, () => api, [api]);

    return (
        <div ref={containerRef}  className="canvas-wrapper">
            <Canvas 
                nodes={nodes}
                edges={edges}
                width={size.width}
                height={size.height}
                onLayoutChange={onLayoutChange}
                onNodeLink={onNodeLink}
                onNodeRemove={onNodeRemove}
                panType="drag"
                fit
                center
            />
        </div>
    )
});

BehavioralGraphBuilder.propTypes = {
    connectBehaviors: PropTypes.func.isRequired,
    deleteBehavior: PropTypes.func.isRequired
}
