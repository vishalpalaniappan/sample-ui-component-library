import { FileCode, ChevronRight, ChevronDown, Braces, FiletypeScss, FiletypeJs, FiletypePy } from "react-bootstrap-icons";
import PropTypes from 'prop-types';
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";

import { useFileBrowser } from "../FileBrowser";

const INDENT_WIDTH = 20;
const SELECTED_FILE_COLOR = "#00426b";

import "./TreeNode.scss";

/**
 * Renders a single node in the file tree.
 */
export const TreeNode = ({ id, node }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const { selectNode } = useFileBrowser();

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
        const style = {};
        if (node.selected) {
            style["backgroundColor"] = SELECTED_FILE_COLOR;
        }
        return style;
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


    const onSelectRow = () => {
        selectNode(node.uid);
    }

    return (
        <div className="file-node-row" ref={setNodeRef} {...listeners} {...attributes} 
            style={getRowStyle()} onClick={() => onSelectRow()}>
            <div className="indent" style={{ width: node.level * INDENT_WIDTH + "px" }} />
            {
                node.type === "folder" ?
                    <span className="center folder-icon">{getCollapsedIcon()}</span> :
                    <span className="center file-icon">{getFileIcon()}</span>
            }
            <span className="center file-name">{node.name}</span>
        </div>
    )
}