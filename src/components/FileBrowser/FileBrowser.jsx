import { useEffect, useState } from "react";
import "./FileBrowser.scss";
import PropTypes from 'prop-types';


const INDENT_WIDTH = 20;


const TreeNode = ({node}) => {
    console.log(node.name);
    return (
        <div className="node-row">
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
export const FileBrowser = ({}) => {

    const [nodes, setNodes] = useState([]);

    const tree = [
        {"level": 0, "name": "root", "type": "folder"},
        {"level": 1, "name": "folder1", "type": "folder"},
        {"level": 2, "name": "file1.txt", "type": "file"},
        {"level": 2, "name": "file2.txt", "type": "file"},
        {"level": 1, "name": "folder2", "type": "folder"},
        {"level": 2, "name": "file3.txt", "type": "file"},
        {"level": 0, "name": "file4.txt", "type": "file"},
        {"level": 0, "name": "folder3", "type": "folder"},
        {"level": 1, "name": "file5.txt", "type": "file"},
    ];

    useEffect(() => {
        const rows = [];
        tree.forEach((node) => {
            rows.push(<TreeNode node={node} />);
        });
        setNodes(rows);
    }, []);

    return (
        <div className="file-browser">
            {nodes}
        </div>
    )
}