
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
            id: node.getBehavior().name,
            text: node.getBehavior().name,
        });
    }
    
    for (let i = 0; i < engine.graph.nodes.length; i++) {
        const node = engine.graph.nodes[i];
        if (!node?.getGoToBehaviors()) {
            continue;
        }

        console.log(node);

        node.getGoToBehaviors().forEach((goTo) => {
            edges.push({
                id: `${node.getBehavior().name}->${goTo}`,
                from: node.getBehavior().name,
                to: goTo,
            });
        });
    }

    return {
        nodes: nodes,
        edges: edges
    };
}