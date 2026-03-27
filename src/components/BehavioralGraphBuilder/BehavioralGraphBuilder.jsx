import { useEffect, useState, useRef } from "react";
import { Canvas } from 'reaflow';
import PropTypes from 'prop-types';

import "./BehavioralGraphBuilder.scss";

const nodes = [
    {
        id: '1',
        text: 'AcceptBookFromUser'
    },
    {
        id: '2',
        text: 'PlaceBookInBasket'
    }
];

const edges = [
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
