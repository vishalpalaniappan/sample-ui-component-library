import { string } from "prop-types";

export const drawioToReactFlow = (diagram) => {

    const nodes = [];
    const edges = [];
    const graphModel = diagram.mxfile.diagram.mxGraphModel;
    const diagramRoot = graphModel.root.mxCell;

    for (let i = 0; i < diagramRoot.length; i++) {
        const elem = diagramRoot[i];
        const isEdge = "_edge" in elem;

        if (!isEdge && "mxGeometry" in elem ) {
            const geo = elem.mxGeometry;
            const width = geo["_width"];
            const height = geo["_height"];
            const x = geo["_x"];
            const y = geo["_y"];

            const node = {
                id: elem["_id"],
                data: { label: 'Node 1' },
                position: { x: x, y: y },
            }
            nodes.push(node);
        } else if (isEdge) {
            const source = elem["_source"];
            const target = elem["_target"];
            const edge = {
                id: i.toString(),
                source: source,
                target: target
            }
            edges.push(edge);
        }
    }

    return {
        nodes: nodes,
        edges: edges
    }
}

/**
 * 
 * {
    id: 'e1-3',
    source: '1-1',
    target: '1-3',
    animated: true,
    label: 'animated edge',
  },
 * 
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