import { MarkerType } from "@xyflow/react";

const marker = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072',
}

const arrowStyle = {
  strokeWidth: 2,
  stroke: '#FF0072',
}

/**
 * Returns react flow nodes and edges from the given trace.
 * @param {Object} trace 
 * @returns {Array} An array co
 */
export const getNodesFromTrace = (variableTree) => {
    const edges = [];
    const nodes = [];
    Object.keys(variableTree).forEach((branchName, index1) => {
        variableTree[branchName].forEach((node, index) => {

            // Position doesn't matter, it will be set by layout algorithm
            const flowNode = {
                id: node,
                flowId: node,
                position: { x: 250, y: index * 200 },
                data: { label: String(node) }
            }

            if (index == 0) {
                flowNode.type = "input"
            }

            if (index > 0) {
                const prevNode = nodes[nodes.length-1]
                const edge = {
                    id: prevNode.id + "-" + flowNode.id,
                    source: prevNode.flowId,
                    target: flowNode.flowId,
                    animated: true,
                    markerEnd: marker,
                    style: arrowStyle
                }
                edges.push(edge);
            }

            nodes.push(flowNode);
        });
    });

    return {
        nodes: nodes,
        edges: edges
    }
}