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
    if (trace) {
      const flowInfo = getNodesFromTrace(trace);
      
      const layouted = getLayoutedElements(
        flowInfo.nodes,
        flowInfo.edges,
        {direction:"TB"}
      );

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
 
      fitView();
    }
  }, [trace]);

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

      <Panel position="top-right">
        <select onChange={onChange} data-testid="colormode-select">
          <option value="dark">dark</option>
          <option value="light">light</option>
          <option value="system">system</option>
        </select>
      </Panel>

      <Panel position="top-left">
        <button onClick={() => onLayout('TB')}>vertical layout</button>
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </Panel>
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