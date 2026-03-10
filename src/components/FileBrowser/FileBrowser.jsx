import { useEffect, useState } from "react";
import "./FileBrowser.scss";
import PropTypes from 'prop-types';


const INDENT_WIDTH = 20;


const TreeNode = ({node, onRowClick}) => {
    return (
        <div className="node-row" onClick={() => onRowClick(node)}>
            <div className="indent" style={{ width: node.level * INDENT_WIDTH + "px"}} />
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
        console.log("Selected file:", node.name);
        if (onFileSelect) {
            onFileSelect(node);
        }
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

    useEffect(() => {
        const rows = [];
        tree.forEach((node) => {
            rows.push(<TreeNode node={node} onRowClick={handleFileClick}/>);
        });
        setNodes(rows);
    }, []);

    return (
        <div className="file-browser">
            {nodes}
        </div>
    )
}