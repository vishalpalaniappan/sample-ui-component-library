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

const Flow = ({tree}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);  

  useEffect(() => {
    if (tree) {

        setNodes([]);
        setEdges([]);

        fitView();
    }
  }, [tree]);

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

export const SystemDiagramViewer = ({diagramJSON}) => {
  const [tree, setTree] = useState();

  useEffect(() => {
    console.log(diagramJSON);
  }, [diagramJSON])

  return (
    <ReactFlowProvider>
      <Flow tree={tree} />
    </ReactFlowProvider>
  );
}