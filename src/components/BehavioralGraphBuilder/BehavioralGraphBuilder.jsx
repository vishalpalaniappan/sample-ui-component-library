import { useEffect, useState, useRef } from "react";
import { Canvas } from 'reaflow';
import PropTypes from 'prop-types';

import { designToReactFlowElements } from "./helper";

import {DALEngine} from "dal-engine-core-js-lib-dev";

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
    const [engine, setEngine] = useState(null);

    const [edges, setEdges] = useState([]);
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        if (design) {
            const e = new DALEngine({});
            let behavior1 = e.createBehavior({name: "Behavior1"});
            const node1 = e.graph.addNode(behavior1);
            
            let behavior2 = e.createBehavior({name: "Behavior2"});
            const node2 = e.graph.addNode(behavior2);

            node1.goToBehaviors = [behavior2];
            
            let behavior3 = e.createBehavior({name: "Behavior3"});
            const node3 = e.graph.addNode(behavior3);
            
            node2.goToBehaviors = [behavior3];
            node3.goToBehaviors = [behavior1];
            
            setEngine(e);
        }
    }, []);


    useEffect(() => {
        if (engine) {
            const { nodes, edges } = designToReactFlowElements(engine);
            setNodes(nodes);
            setEdges(edges);
        }
    }, [engine]);

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
        if (engine) {
            let Behavior5 = engine.createBehavior({name: "Behavior5"});
            const node5 = engine.graph.addNode(Behavior5);
            node5.goToBehaviors = [engine.graph.nodes[0].behavior];
            const { nodes, edges } = designToReactFlowElements(engine);
            setNodes(nodes);
            setEdges(edges);
        }
    }, [activeTool, engine]);

    const onLayoutChange = (layout) => {
        console.log("Layout changed: ", layout);
    }

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
