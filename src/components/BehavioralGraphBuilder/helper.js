
/**
 * Converts a DAL design specification object into React Flow elements (nodes and edges).
 * @param {Object} design 
 * @returns {Object} An object containing nodes and edges for React Flow
 */
export const designToReactFlowElements = (design) => {

    let edges = [];
    let nodes = [];
    design.nodes.forEach((node) => {
        const id = node.behavior.uid;
        nodes.push({
            id: id,
            text: node.behavior.name,
        });

        node.goToBehaviors.forEach((goTo) => {
            const exists = nodes.some(n => n.id === goTo.uid);
            if (!exists) {
                nodes.push({
                    id: goTo.uid,
                    text: goTo.name,
                });
            }

            edges.push({
                id: `${node.behavior.uid}->${goTo.uid}`,
                from: node.behavior.uid,
                to: goTo.uid,
            });
        });
    });

    return {
        nodes: nodes,
        edges: edges
    };
}