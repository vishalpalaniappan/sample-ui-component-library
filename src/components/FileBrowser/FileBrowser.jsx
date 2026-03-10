import { useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import "./FileBrowser.scss";

import { setDefaultCollapsed, collapseTree, selectNode, flattenTree } from "./helper";

import { FileCode, ChevronRight, ChevronDown, Braces, FiletypeScss, FiletypeJs, FiletypePy} from "react-bootstrap-icons";
import PropTypes from 'prop-types';

const INDENT_WIDTH = 20;
const SELECTED_FILE_COLOR = "#00426b";

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
 * Renders a single node in the file tree.
 */
const TreeNode = ({node, onRowClick}) => {
    /**
     * Gets the appropriate icon for the node based on its type and collapsed state.
     * @returns <JSX>
     */
    const getCollapsedIcon = () => {
        if (node.collapsed) {
            return <ChevronRight />;
        } else {
            return <ChevronDown />;
        }
    }

    /**
     * Sets the background color of the row if the node is selected.
     */
    const getRowStyle = () => {
        if (node.selected) {
            return {"backgroundColor": SELECTED_FILE_COLOR};
        }
    }


    /**
     * Get the file icon based on the extension.
     * 
     * TODO: This can be improved by having a mapping of extensions to icons and color.
     */
    const getFileIcon = () => {
        const extension = node.name.split('.').pop();
        switch (extension) {
            case "js":
                return <FiletypeJs color="#f1e05a" />;
            case "json":
                return <Braces color="#fffb00" />;
            case "scss":
                return <FiletypeScss color="#f12727" />;
            case "py":
                return <FiletypePy color="#686affbd" />;
            default:
                return <FileCode color="#ffffff" />;
        }
    }

    return (
        <div className="node-row" style={getRowStyle()} onClick={() => onRowClick(node)}>
            <div className="indent" style={{ width: node.level * INDENT_WIDTH + "px"}} />
            {
                node.type === "folder" ? 
                <span className="folder-icon">{getCollapsedIcon()}</span> :
                <span className="file-icon">{getFileIcon()}</span>
            }
            {node.name}
        </div>
    )
}

/**
 * Renders a file browser.
 * 
 * @return {JSX}
 */
export const FileBrowser = ({tree, onFileSelect}) => {

    const [nodes, setNodes] = useState([]);
    const treeRef = useRef();

    const handleFileClick = useEvent((node) => {
        selectNode(treeRef.current, node);
        drawTree();
        if (onFileSelect) {
            onFileSelect(node);
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
            rows.push(<TreeNode key={node.id} node={node} onRowClick={handleFileClick}/>);
        });
        setNodes(rows);
    }
    return (
        <div className="file-browser">
            {nodes}
        </div>
    )
}