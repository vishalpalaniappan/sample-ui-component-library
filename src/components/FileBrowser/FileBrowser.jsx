import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import "./FileBrowser.scss";

import { TreeNode } from "./TreeNode/TreeNode";

import { setDefaultCollapsed, collapseTree, selectNode, flattenTree } from "./helper";

/**
 * Used for creating a stable callback function.
 */
function useEvent(fn) {
    const fnRef = useRef(fn);

    useLayoutEffect(() => {
        fnRef.current = fn;
    });

    return useCallback((...args) => {
        return fnRef.current(...args);
    }, []);
}

/**
 * Renders a file browser.
 * 
 * @return {JSX}
 */
export const FileBrowser = ({tree, onNodeSelect}) => {

    const [nodes, setNodes] = useState([]);
    const treeRef = useRef();

    const handleFileClick = useEvent((node) => {
        selectNode(treeRef.current, node);
        drawTree();
        if (onNodeSelect) {
            onNodeSelect(node);
        }
    });

    useEffect(() => {
        treeRef.current = flattenTree(tree);
        setDefaultCollapsed(treeRef.current);
        drawTree();
    }, []);

    /**
     * Draws the tree given the nodes and the collapsed state of each node.
     */
    const drawTree = () => {
        const nodes = collapseTree(treeRef.current);
        const rows = [];
        nodes.forEach((node) => {
            rows.push(<TreeNode key={node.id} node={node} id={node.name} onRowClick={handleFileClick}/>);
        });
        setNodes(rows);
    }
    return (
        <div className="file-browser">
            {nodes}
        </div>
    )
}