export const designToReactFlowElements = (design) => {

    /*
        Temporary reference:

        Flow Node
        {
            id: '1',
            type: 'input',
            data: { label: 'Start here...' },
            position: { x: -150, y: 0 },
        }

        Flow Edge
        { id: '1->3', source: '1', target: '3' },
            
        Design Node
        {
            "uid": "08a4e18c-f293-4ba1-be0a-c8451b50e819",
            "type": 6,
            "goToBehaviors": [
                {
                    "uid": "35a2759b-e0df-47db-93b7-1f18c216922d",
                    "type": 1,
                    "participants": [],
                    "abstractionIds": [],
                    "invalidWorldState": false,
                    "name": "AcceptBookFromUser"
                }
            ],
            "behavior": {
                "uid": "a873c4ba-3a63-4097-80df-46ed361f2e26",
                "type": 1,
                "participants": [],
                "abstractionIds": [],
                "invalidWorldState": false,
                "name": "AcceptChoiceToAddBookToBasket"
            }
        }
     */

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
                source: node.behavior.uid,
                target: goTo.uid,
            });
        });
    });

    console.log("Generated nodes:", nodes);
    console.log("Generated edges:", edges); 

    return {
        nodes: nodes,
        edges: edges
    };

}