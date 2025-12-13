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
import { drawioToReactFlow } from "./helper";

const Flow = ({diagram}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);  

  useEffect(() => {
    if (diagram) {
      
        console.log(diagram);
        const nodes = drawioToReactFlow(diagram);

        console.log(nodes);

        setNodes([...nodes]);
        setEdges([]);

        fitView();
    }
  }, [diagram]);

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
  const [diagram, setDiagram] = useState();

  useEffect(() => {
    setDiagram(diagramJSON);
  }, [diagramJSON])

  return (
    <ReactFlowProvider>
      <Flow diagram={diagram} />
    </ReactFlowProvider>
  );
}