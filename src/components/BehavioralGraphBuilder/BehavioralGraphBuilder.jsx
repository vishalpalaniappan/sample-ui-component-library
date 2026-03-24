import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const Flow = ({}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);  

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      colorMode={"dark"}
      fitView
    >
      <Controls />
    </ReactFlow>
  );
};

export const BehavioralGraphBuilder = ({}) => {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}