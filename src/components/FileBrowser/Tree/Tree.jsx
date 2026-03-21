import {
    useEffect,
    useState,
    useRef
} from "react";

import { TreeNode } from "../TreeNode/TreeNode";

import { useFileBrowser } from "../FileBrowser";

import {
    setDefaultCollapsed,
    collapseTree,
    selectNode,
    flattenTree,
} from "../helper";

import "./Tree.scss";

/**
 * Renders a file tree.
 */
export const Tree = ({}) => {
    const [nodes, setNodes] = useState([]);
    const {state} = useFileBrowser();

    useEffect(() => {
        if(state.collapsedTree && state.collapsedTree.length > 0) {
            drawTree(state.collapsedTree);
        }
    }, [state.collapsedTree]);

    /**
     * Draws the tree given the nodes and the collapsed state of each node.
     */
    const drawTree = (collapsedTree) => {
        const rows = [];
        collapsedTree.forEach((node) => {
            rows.push(
                <TreeNode
                    key={node.uid}
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