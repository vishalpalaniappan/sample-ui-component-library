export const designToReactFlowElements = (design) => {

    let edges = [];
    let nodes = [];
    design.nodes.forEach((node) => {
        nodes.push({
            id: node.behavior.uid,
            type: 'default',
            data: { label: node.behavior.name },
            position: { x: 10, y: 10 },
        });

        node.goToBehaviors.forEach((goTo) => {
            edges.push({
                id: `${node.behavior.uid}->${goTo.uid}`,
                type: "bezier",
                source: node.behavior.uid,
                target: goTo.uid,
            });
        });
    });

    return {
        nodes: nodes,
        edges: edges
    };

}