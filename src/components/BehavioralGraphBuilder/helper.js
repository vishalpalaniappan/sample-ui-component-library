
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
            id: node.behavior.name,
            text: node.behavior.name,
        });
    }
    
    for (let i = 0; i < engine.graph.nodes.length; i++) {
        const node = engine.graph.nodes[i];
        if (!node?.goToBehaviorsIds) {
            continue;
        }

        console.log(node);

        node.goToBehaviorsIds.forEach((goTo) => {
            edges.push({
                id: `${node.behavior.name}->${goTo}`,
                from: node.behavior.name,
                to: goTo,
            });
        });
    }

    return {
        nodes: nodes,
        edges: edges
    };
}