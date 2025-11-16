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

import { getLayoutedElements } from "./DagreLayout.js";
import { getLayoutInfoFromTree } from "./helper.js"

const Flow = ({tree}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);  

  useEffect(() => {
    if (tree) {
        const flowInfo = getLayoutInfoFromTree(tree.data, tree.animated ?? false);
        
        //direction: TB, BT, LR, or RL, where T = top, B = bottom, L = left, and R = right.
        const layouted = getLayoutedElements(
            flowInfo.nodes,
            flowInfo.edges,
            {direction:tree.orientation}
        );

        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);

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

export const FlowDiagram = ({treeInfo}) => {
  const [tree, setTree] = useState();

  useEffect(() => {
    setTree(treeInfo)
  }, [treeInfo])

  return (
    <ReactFlowProvider>
      <Flow tree={tree} />
    </ReactFlowProvider>
  );
}