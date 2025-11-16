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
 * Returns react flow nodes and edges from the given tree.
 * @param {Object} tree Layout tree object.
 * @param {boolean} animated Indicates if the edges should be animated.
 * @returns {Array} An object containing nodes and edges arrays.
 */
export const getLayoutInfoFromTree = (tree, animated) => {
    const edges = [];
    const nodes = [];
    Object.keys(tree).forEach((branchName, index1) => {
        tree[branchName].forEach((node, index) => {

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
                    id: prevNode.flowId + "-" + branchName + "-" + index + "-" + flowNode.flowId,
                    source: prevNode.flowId,
                    target: flowNode.flowId,
                    animated: animated,
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