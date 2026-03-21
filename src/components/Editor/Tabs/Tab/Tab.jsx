import { useEffect, useState } from "react";
import { FileEarmark, XLg } from "react-bootstrap-icons";
import { useDraggable } from "@dnd-kit/core";
import PropTypes from "prop-types";

import { useEditor } from "../../Editor";

import "./Tab.scss";

const ACTIVE_TAB_BG_COLOR = "#1e1e1e";
const INACTIVE_TAB_BG_COLOR = "#2d2d2d";
const ACTIVE_TAB_FG_COLOR = "#FFFFFF";
const INACTIVE_TAB_FG_COLOR = "#969690";

/**
 * Tab Component. Renders a single tab with the provided id and label. 
 * Also handles the click events for selecting and closing the tab.
 * @param {String} id
 * @param {String} label
 * @returns
 */
export const Tab = ({ id, parentId, node }) => {
    const [tabStyle, setTabStyle] = useState();

    const { selectTab, closeTab, state } = useEditor();

    // Saves ID of tab and parent tab group for drag and drop context in dnd kit.
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            type: "EditorTab",
            parentId: parentId,
            node: node,
            preview: <TabPreview node={node} />
        },
    });

    useEffect(() => {
        renderTab(state.activeTab && state.activeTab.uid === node.uid);
    }, [state.activeTab]);

    const renderTab = (isActive) => {
        const bgColor = isActive ? ACTIVE_TAB_BG_COLOR : INACTIVE_TAB_BG_COLOR;
        const fgColor = isActive ? ACTIVE_TAB_FG_COLOR : INACTIVE_TAB_FG_COLOR;
        setTabStyle({ backgroundColor: bgColor, color: fgColor });
    }
    
    const clickTab = (e) => {
        e.stopPropagation();
        selectTab(node.uid);
    }
    
    const clickClose = (e) => {
        e.stopPropagation();
        closeTab(node.uid);
    }

    return (
        <div
            ref={setNodeRef}
            style={tabStyle}
            id={id}
            onMouseDown={clickTab}
            className="tab"
            {...listeners}
            {...attributes}
        >
            <div className="tab-content">
                <div className="icon">
                    <FileEarmark size={14} style={{ pointerEvents: "none" }} />
                </div>
                <div className="tab-name">
                    <span>{node.name}</span>
                </div>
                <div className="close-icon">
                    <XLg size={18} onMouseDown={clickClose}/>
                </div>
                
            </div>
        </div>
    );
}

Tab.propTypes = {
    id: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    node: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired
}


export const TabPreview = ({node}) => {
    return (
        <div className="tab" style={{ backgroundColor: ACTIVE_TAB_BG_COLOR, color: ACTIVE_TAB_FG_COLOR, opacity:0.5 }}>
            <FileEarmark className="icon" />
            <span className="tab-name">{node.name}</span>
            <X className="close-icon"/>
        </div>
    );
}