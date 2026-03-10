import { useEffect, useState } from "react";
import "./FileBrowser.scss";

import { setDefaultCollapsed, collapseTree } from "./helper";

import { FileCode, ChevronRight, ChevronDown } from "react-bootstrap-icons";
import PropTypes from 'prop-types';


const INDENT_WIDTH = 20;


const TreeNode = ({node, onRowClick}) => {

    const getCollapsedIcon = () => {
        if (node.collapsed) {
            return <ChevronRight />;
        } else {
            return <ChevronDown />;
        }
    }
    return (
        <div className="node-row" onClick={() => onRowClick(node)}>
            <div className="indent" style={{ width: node.level * INDENT_WIDTH + "px"}} />
            {
                node.type === "folder" ? 
                <span className="folder-icon">{getCollapsedIcon()}</span> :
                <span className="file-icon"><FileCode /></span>
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
export const FileBrowser = ({onFileSelect}) => {

    const [nodes, setNodes] = useState([]);

    function handleFileClick(node) {
        console.log("Selected file:", node.name, node.collapsible);
        node.collapsed = !node.collapsed;
        if (onFileSelect) {
            onFileSelect(node);
        }
        drawTree();
    }

    const tree = [
        {"id": 1, "level": 0, "name": "root", "type": "folder"},
        {"id": 2, "level": 1, "name": "folder1", "type": "folder"},
        {"id": 3, "level": 2, "name": "file1.txt", "type": "file"},
        {"id": 4, "level": 2, "name": "file2.txt", "type": "file"},
        {"id": 5, "level": 1, "name": "folder2", "type": "folder"},
        {"id": 6, "level": 2, "name": "file3.txt", "type": "file"},
        {"id": 7, "level": 0, "name": "file4.txt", "type": "file"},
        {"id": 8, "level": 0, "name": "folder3", "type": "folder"},
        {"id": 9, "level": 1, "name": "file5.txt", "type": "file"},
    ];

    /**
     * Draws the tree given the nodes and the collapsed state of each node.
     */
    const drawTree = () => {
        const nodes = collapseTree(tree);
        const rows = [];
        nodes.forEach((node) => {
            rows.push(<TreeNode key={node.id} node={node} onRowClick={handleFileClick}/>);
        });
        setNodes(rows);
    }

    useEffect(() => {
        setDefaultCollapsed(tree);
        drawTree();
    }, []);

    return (
        <div className="file-browser">
            {nodes}
        </div>
    )
}