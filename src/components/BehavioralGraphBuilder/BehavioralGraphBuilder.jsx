import { useEffect, useState, useRef, useImperativeHandle, forwardRef, useMemo, useCallback } from "react";
import { Canvas, Node, Edge } from 'reaflow';
import PropTypes from 'prop-types';

import { designToNodes } from "./helper";

import "./BehavioralGraphBuilder.scss";

/**
 * Renders a behavioral graph editor component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = forwardRef(({connectBehaviors, deleteTransition, deleteBehavior, selectBehavior}, ref) => {
    const canvasRef = useRef();

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

    // States
    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [selections, setSelections] = useState([]);

    // API Methods and Imperative Handle
    const updateEngine = useCallback((engine) => {
        if (engine) {
            const { nodes, edges } = designToNodes(engine);
            setNodes(nodes);
            setEdges(edges);
        }
    }, [setNodes, setEdges]);

    const api = useMemo(() => {
        return {
            updateEngine
        };
    }, [updateEngine]);
    
    useImperativeHandle(ref, () => api, [api]);


    // Callbacks
    const handleWheel = useCallback((e) => {
        (e.deltaY < 0)?canvasRef.current.zoomIn():canvasRef.current.zoomOut();
    }, [canvasRef]);

    const nodeClick = useCallback((e, node) => {
        setSelections([node.id]);
        selectBehavior(node.id);
    }, [selectBehavior]);
    
    const nodeRemove = useCallback((e, node) => {
        deleteBehavior(node);
        setSelections([]);
    }, [deleteBehavior]);

    const edgeClick = useCallback((e, edge) => {
        setSelections([edge.id]);
    }, []);

    const edgeRemove = useCallback((e, edge) => {
        deleteTransition(edge);
        setSelections([]);
    }, [deleteTransition]);

    const canvasClick = useCallback((e) => {
        selectBehavior(null);
        setSelections([]);
    }, [selectBehavior]);

    const nodeLink = useCallback((e, from, to) => {
        if (!to) return;
        connectBehaviors(from, to);
    }, [connectBehaviors]);

    return (
        <div onWheel={handleWheel} ref={containerRef}  className="canvas-wrapper">
            <Canvas 
                panType="drag"
                fit
                center
                ref={canvasRef}
                nodes={nodes}
                edges={edges}
                width={size.width}
                height={size.height}
                selections={selections}
                onNodeLink={nodeLink}
                node={ <Node onClick={nodeClick} onRemove={nodeRemove} /> }
                edge={ <Edge onClick={edgeClick} onRemove={edgeRemove}/> }
                onCanvasClick={canvasClick}
            />
        </div>
    )
});

BehavioralGraphBuilder.propTypes = {
    connectBehaviors: PropTypes.func.isRequired,
    deleteTransition: PropTypes.func.isRequired,
    deleteBehavior: PropTypes.func.isRequired,
    selectBehavior: PropTypes.func.isRequired,
}
