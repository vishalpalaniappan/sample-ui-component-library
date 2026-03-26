import { useCallback, useEffect, useState } from "react";
import {
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Background,
    Controls,
    useReactFlow,
    addEdge,
    BezierEdge ,
    applyNodeChanges,
    applyEdgeChanges 
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { getLayoutedElements } from "./DagreLayout.js";

const edgeTypes = {
  bezier: BezierEdge,
};

const initialNodes = [
    {
        id: "1",
        position: { x: 250, y: 150 },
        data: { label: "Behavior 1" },
        draggable: true,
        selectable: true,
    },
    {
        id: "2",
        position: { x: 250, y: 250 },
        data: { label: "Behavior 2" },
        draggable: true,
        selectable: true,
    },
];

const NODE_WIDTH = 150;
const NODE_HEIGHT = 40;
export const Flow = ({ activeTool, onBehaviorSelect, initialElements }) => {
    const { screenToFlowPosition } = useReactFlow();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [ghostNode, setGhostNode] = useState(null);

    useEffect(() => {
        if (!initialElements) return;
        const layouted = getLayoutedElements(
            initialElements.nodes,
            initialElements.edges,
            {direction:"TB"}
        );

        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
    }, [initialElements]);

    // Callbacks to apply node changes
    const onNodesChange = useCallback((changes) => {
        setNodes((nds) => applyNodeChanges(changes, nds));
    }, []);
    const onEdgesChange = useCallback((changes) => {
        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    // Console messages for debugging
    useEffect(() => {
        console.log("Active Tool:", activeTool);
    }, [activeTool]);

    // Callback for mouse pane move
    const onPaneMouseMove = useCallback( (event) => {
        const pos = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        if (activeTool === "drop") {
            setGhostNode({
                id: "ghost",
                position: {
                    x: pos.x - NODE_WIDTH / 2,
                    y: pos.y - NODE_HEIGHT / 2,
                },
                data: { label: "Behavior" },
                draggable: false,
                selectable: false,
                style: {
                    opacity: 0.5,
                    pointerEvents: "none",
                    width: NODE_WIDTH,
                    height: NODE_HEIGHT,
                },
            });
        } 
    }, [activeTool]);

    // Callback for when mouse leaves pane
    const onPaneMouseLeave = useCallback(() => {
        setGhostNode(null);
    }, []);

    // Callback for pane click
    const onPaneClick = useCallback((event, node) => {
        if (activeTool === "drop") {
            if (!ghostNode) return;
            setNodes((nds) => [
                ...nds,
                {
                    ...ghostNode,
                    draggable: true,
                    selectable: true,
                    id: crypto.randomUUID(),
                    style: {},
                },
            ]);
        }  
    }, [ghostNode, activeTool]);

    // Callback for node click to delete it (if tool is active)
    const onNodeClick = useCallback((event, node) => {
        if (activeTool === "delete") {
            setNodes((nds) => nds.filter((n) => n.id !== node.id));
            setEdges((eds) =>
                eds.filter((e) => e.source !== node.id && e.target !== node.id)
            );
        } else {
            onBehaviorSelect(node);
        }
    }, [activeTool]);

    // Callback for edge click to delete it (if tool is active)
    const onEdgeClick = useCallback((event, edge) => {
        if (activeTool === "delete") {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
    }, [activeTool]);

    // Callback for when edge is connected, nodesConnectable={activeTool === "connect"}
    // is used to determine connectability
    const onConnect = useCallback((connection) => {
        const edge = {
            ...connection,
            id: crypto.randomUUID(),
            type: "smoothstep",
            animated: true,
        };
        setEdges((eds) => [...eds, edge]);
    }, [activeTool]);

    return (
        <ReactFlow
            nodes={ghostNode ? [...nodes, ghostNode] : nodes}
            edges={edges}
            onPaneMouseMove={onPaneMouseMove}
            onPaneMouseLeave={onPaneMouseLeave}
            onPaneClick={onPaneClick}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            colorMode={"dark"}
            edgeTypes={edgeTypes}
            fitView
        >
            <Background />
            <Controls />
        </ReactFlow>
    );
};