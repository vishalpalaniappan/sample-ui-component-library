
/**
 * Converts a DAL design specification object into nodes and edges for reaflow.
 * @param {Object} engine - The engine instance containing the design specification.
 * @returns {Object} An object containing nodes and edges for React Flow
 */
export const designToNodes = (engine) => {
    let edges = [];
    let nodes = [];

    for (let i = 0; i < engine.graph.nodes.length; i++) {
        const node = engine.graph.nodes[i];
        nodes.push({
            id: node.getBehavior().getName(),
            text: node.getBehavior().getName(),
        });
    }
    
    for (let i = 0; i < engine.graph.nodes.length; i++) {
        const node = engine.graph.nodes[i];
        if (!node?.getGoToBehaviors()) {
            continue;
        }

        node.getGoToBehaviors().forEach((goTo) => {
            edges.push({
                id: `${node.getBehavior().getName()}->${goTo}`,
                from: node.getBehavior().getName(),
                to: goTo,
            });
        });
    }

    return {
        nodes: nodes,
        edges: edges
    };
}