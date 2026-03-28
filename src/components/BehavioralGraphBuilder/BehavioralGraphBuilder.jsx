import { useEffect, useState, useRef, useImperativeHandle, forwardRef, useMemo, useCallback } from "react";
import { Canvas, Node, Edge, removeAndUpsertNodes  } from 'reaflow';
import PropTypes from 'prop-types';

import { designToNodes } from "./helper";

import "./BehavioralGraphBuilder.scss";

/**
 * Renders a behavioral graph editor component using reaflow.
 * 
 * @return {JSX}
 */
export const BehavioralGraphBuilder = forwardRef(({connectBehaviors, deleteTransition, deleteBehavior}, ref) => {

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
    const [selections, setSelections] = useState([]);
'1'
    const onNodeLink =(_event, from, to) => {
        connectBehaviors(from, to);
    }

    const onNodeRemove = (id) => {
        deleteBehavior(id);
    }

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

    return (
        <div ref={containerRef}  className="canvas-wrapper">
            <Canvas 
                nodes={nodes}
                edges={edges}
                width={size.width}
                height={size.height}
                onNodeLink={onNodeLink}
                onNodeRemove={onNodeRemove}
                panType="drag"
                selections={selections}node={
                <Node
                    onClick={(event, node) => {
                        console.log('Selecting Node', event, node);
                        setSelections([node.id]);
                    }}
                    onRemove={(event, node) => {
                        console.log('Removing Node', event, node);
                        deleteBehavior(node);
                        setSelections([]);
                    }}
                />
                }
                edge={
                <Edge
                    onClick={(event, edge) => {
                        console.log('Selecting Edge', event, edge);
                        setSelections([edge.id]);
                    }}
                    onRemove={(event, edge) => {
                        console.log('Removing Edge', event, edge);
                        deleteTransition(edge);
                        setSelections([]);
                    }}
                />
                }
                onCanvasClick={(event) => {
                    console.log('Canvas Clicked', event);
                    setSelections([]);
                }}
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
