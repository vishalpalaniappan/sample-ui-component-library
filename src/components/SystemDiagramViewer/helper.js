export const drawioToReactFlow = (diagram) => {

    const nodes = [];
    const graphModel = diagram.mxGraphModel;
    const diagramRoot = graphModel.root;

    for (let i = 0; i < diagramRoot.length; i++) {
        const elem = diagramRoot[i];
        const isEdge = "mxCell@edge" in elem;

        if (!isEdge && "mxCell" in elem ) {
            const geo = elem.mxCell;
            const width = geo["mxGeometry@width"];
            const height = geo["mxGeometry@height"];
            const x = geo["mxGeometry@x"];
            const y = geo["mxGeometry@y"];

            console.log(x, y, width, height);
            const node = {
                id: elem["mxCell@id"],
                type: "input",
                data: { label: 'Node 1' },
                position: { x: x, y: y },
            }
            nodes.push(node);
        }
    }

    return nodes;
}

/**
 * {
      id: '1',
      type: 'input',
      data: { label: 'Node 1' },
      position: { x: 0, y: 25 },
      sourcePosition: Position.Right,
    },
    {
      id: '2',
      type: 'custom',
      data: {},
      position: { x: 250, y: 50 },
    },
    {
      id: '3',
      type: 'input',
      data: { label: 'Node 2' },
      position: { x: 0, y: 100 },
      sourcePosition: Position.Right,
    },
 */