import {
    useEffect,
    useState,
    useRef
} from "react";

import { TreeNode } from "../TreeNode/TreeNode";

import "./Tree.scss";

/**
 * Renders a file tree.
 */
export const Tree = ({}) => {
    const [nodes, setNodes] = useState([]);
    const treeRef = useRef();

    useEffect(() => {
        // treeRef.current = flattenTree(tree);
        // setDefaultCollapsed(treeRef.current);
        // drawTree();
    }, []);

    /**
     * Draws the tree given the nodes and the collapsed state of each node.
     */
    const drawTree = () => {
        const nodes = collapseTree(treeRef.current);
        const rows = [];
        nodes.forEach((node) => {
            rows.push(
                <TreeNode
                    key={node.id}
                    node={node}
                    id={node.name}
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