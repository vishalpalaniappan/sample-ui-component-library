export const designToReactFlowElements = (design) => {

    /*
        {
            id: '1',
            type: 'input',
            data: { label: 'Start here...' },
            position: { x: -150, y: 0 },
        }
    */

    const nodes = design.nodes.map((node) => ({
        id: node.uid,
        type: 'default',
        data: { label: node.behavior.name },
        position: { x: 10, y: 10 },
    }));

    console.log(nodes);

    return {
        nodes:nodes,
        edges: []
    };

}