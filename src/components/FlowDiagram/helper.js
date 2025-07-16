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
export const getNodesFromTrace = (trace) => {
    const edges = [];
    const nodes = [];

    trace.forEach((node, index) => {
        node.flowId = String(index) + node.adliExecutionId;
        const flowNode = {
            id: node.flowId,
            position: { x: 250, y: index * 200 },
            data: { label: node.programName }
        }

        if (index == 0) {
            flowNode.type = "input";
        }

        if (index > 0) {
            const prevNode = trace[index - 1];
            const edge = {
                id: prevNode.flowId + "-" + node.flowId,
                source: prevNode.flowId,
                target: node.flowId,
                animated: true,
                markerEnd: marker,
                style: arrowStyle
            }
            edges.push(edge);
        }

        nodes.push(flowNode);
    });

    return {
        nodes: nodes,
        edges: edges
    }
}