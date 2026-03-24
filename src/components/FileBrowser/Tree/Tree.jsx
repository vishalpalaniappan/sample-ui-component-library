import {
    useEffect,
    useState
} from "react";

import { TreeNode } from "../TreeNode/TreeNode";

import { useFileBrowser } from "../FileBrowser";

import "./Tree.scss";

/**
 * Renders a file tree.
 */
export const Tree = ({}) => {
    const [nodes, setNodes] = useState([]);
    const {state} = useFileBrowser();

    useEffect(() => {
        drawTree(state.collapsedTree ?? []);
    }, [state.collapsedTree]);

    /**
     * Draws the tree given the nodes and the collapsed state of each node.
     */
    const drawTree = (collapsedTree, parentId) => {
        const rows = [];
        collapsedTree.forEach((node) => {
            rows.push(
                <TreeNode
                    key={parentId + "-" + node.uid}
                    parentId={parentId}
                    node={node}
                    id={"tree-node-" + node.uid}
                />,
            );
        });
        setNodes(rows);
    };

    return (
        <>
            {nodes}
        </>
    )
}