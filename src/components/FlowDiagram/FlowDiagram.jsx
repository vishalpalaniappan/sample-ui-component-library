import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  Controls,
  Panel,
  useReactFlow
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { getLayoutedElements } from "./DagreLayout.js";
import { getNodesFromTrace } from "./helper.js"

import sample from "./SampleNodes.json"

const Flow = ({trace}) => {
  const { fitView } = useReactFlow();
  const [colorMode, setColorMode] = useState("dark");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onChange = (evt) =>
    setColorMode(evt.target.value);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });
 
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
 
      fitView();
    },
    [nodes, edges],
  );

  useEffect(() => {
    if (sample) {
      const flowInfo = getNodesFromTrace(sample);
      
      const layouted = getLayoutedElements(
        flowInfo.nodes,
        flowInfo.edges,
        {direction:"TB"}
      );

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
 
      fitView();
    }
  }, [sample]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      colorMode={colorMode}
      fitView
    >
      <Controls />
    </ReactFlow>
  );
};

export const FlowDiagram = ({traces}) => {
  const [traceList, setTraceList] = useState();

  useEffect(() => {
    setTraceList(traces[0])
  }, [traces])

  return (
    <ReactFlowProvider>
      <Flow trace={traceList} />
    </ReactFlowProvider>
  );
}