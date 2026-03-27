
/**
 * Converts a DAL design specification object into React Flow elements (nodes and edges).
 * @param {Object} design 
 * @returns {Object} An object containing nodes and edges for React Flow
 */
export const designToNodes = (engine) => {

    let edges = [];
    let nodes = [];

    for (let i = 0; i < engine.graph.nodes.length; i++) {
        const node = engine.graph.nodes[i];
        nodes.push({
            id: node.behavior.uid,
            text: node.behavior.name,
        });

        if (!node?.goToBehaviors) {
            continue;
        }

        node.goToBehaviors.forEach((goTo) => {
            edges.push({
                id: `${node.behavior.uid}->${goTo.uid}`,
                from: node.behavior.uid,
                to: goTo.uid,
            });
        });
    }

    return {
        nodes: nodes,
        edges: edges
    };
}