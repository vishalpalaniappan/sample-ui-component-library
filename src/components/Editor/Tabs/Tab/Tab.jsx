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
export const Tab = ({ id, parentId, info }) => {
    const [tabStyle, setTabStyle] = useState();

    const { selectTab, closeTab, state } = useEditor();

    // Saves ID of tab and parent tab group for drag and drop context in dnd kit.
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: {
            type: "tab-draggable",
            parentId: parentId,
            tabId: id,
        },
    });

    useEffect(() => {
        renderTab(state.activeTab && state.activeTab.id === id);
    }, [state.activeTab]);

    const renderTab = (isActive) => {
        const bgColor = isActive ? ACTIVE_TAB_BG_COLOR : INACTIVE_TAB_BG_COLOR;
        const fgColor = isActive ? ACTIVE_TAB_FG_COLOR : INACTIVE_TAB_FG_COLOR;
        setTabStyle({ backgroundColor: bgColor, color: fgColor });
    }
    
    const clickTab = (e) => {
        e.stopPropagation();
        selectTab(id);
    }
    
    const clickClose = (e) => {
        e.stopPropagation();
        closeTab(id);
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
            <FileEarmark className="icon" style={{ pointerEvents: "none" }} />
            <span className="tab-name">{info.label}</span>
            <XLg onMouseDown={clickClose} className="close-icon"/>
        </div>
    );
}

Tab.propTypes = {
    id: PropTypes.string.isRequired,
    parentId: PropTypes.string.isRequired,
    info: PropTypes.shape({
        label: PropTypes.string.isRequired,
    }).isRequired
}


export const TabPreview = ({info}) => {
    return (
        <div className="tab" style={{ backgroundColor: ACTIVE_TAB_BG_COLOR, color: ACTIVE_TAB_FG_COLOR, opacity:0.5 }}>
            <FileEarmark className="icon" />{info.label}<XLg className="close-icon"/>
        </div>
    );
}