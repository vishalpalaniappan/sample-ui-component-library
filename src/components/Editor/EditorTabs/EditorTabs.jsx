import "./EditorTabs.scss";
import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import { FileEarmark } from "react-bootstrap-icons";
import {
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";

/**
 * Tab Component
 * @param {String} id 
 * @param {String} label 
 * @returns 
 */
function Tab({id, label, onSelectTab, parentId, activeTab}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable(
        {
            id,
            data: {
                type: "tab-draggable",
                parentId: parentId,
                index: id
            }
        }
    );

    const [tabStyle, setTabStyle] = useState();

    useEffect(() => {
        const bc = (activeTab && activeTab.id === id) ? "#1e1e1e": "#2d2d2d";
        const fc = (activeTab && activeTab.id === id) ? "#FFFFFF": "#969690";
        setTabStyle( {"backgroundColor": bc, "color": fc})
    }, [activeTab]);
    
    return (
        <div ref={setNodeRef} style={tabStyle} id={id} onMouseDown={onSelectTab} className="tab" {...listeners} {...attributes}>
            <FileEarmark className="icon" style={{ pointerEvents: "none" }}/>{label}
        </div>
    );
}

/**
 * Tab Gutter Component
 * @param {String} id 
 * @returns 
 */
function Gutter({id, parentId}) {
    const { setNodeRef, isOver } = useDroppable(
        {
            id,
            data: {
                type: "tab-gutter",
                parentId: parentId,
                index: id
            }
        }
    );
    return (
        <div
            className="gutter"
            ref={setNodeRef}
            style={{background: isOver ? "white" : "#222425"}}
        ></div>
    );
}

/**
 * Tabs component.
 * @param {Object} activeTab 
 * @param {Array} tabs 
 * @returns 
 */
export const EditorTabs = ({activeTab, tabsInfo, selectTab}) => {

    const [tabsList, setTabsList] = useState();

    useEffect(() => {
        if (tabsInfo) {
            drawTabs();
        }
    }, [tabsInfo]);

    useEffect(() => {
        if (activeTab) {
            drawTabs();
        }
    }, [activeTab]);

    const drawTabs = () => {
        const list = [];
        tabsInfo.tabs.forEach((tab, index) => {
            list.push(<Gutter id={index} parentId={tabsInfo.id} />);
            list.push(
                <Tab activeTab={activeTab} 
                    parentId={tabsInfo.id} 
                    onSelectTab={selectTab} 
                    key={tab.id} 
                    {...tab} />
            );
        })
        list.push(<Gutter id={tabsInfo.tabs.length} />);
        setTabsList(list);
    }   

    return (
        <div style={{ display: "flex", background: "#222425" }}>
            {tabsList}
        </div>
    );
};

EditorTabs.propTypes = {};
