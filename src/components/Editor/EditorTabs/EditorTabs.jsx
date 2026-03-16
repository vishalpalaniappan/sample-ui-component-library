import "./EditorTabs.scss";
import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";

/**
 * Tab Component
 * @param {String} id 
 * @param {String} label 
 * @returns 
 */
function Tab({id, label, onSelectTab}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({id});
    
    return (
        <div ref={setNodeRef} id={id} onClick={onSelectTab} className="tab" {...listeners} {...attributes}>
            {label}
        </div>
    );
}

/**
 * Tab Gutter Component
 * @param {String} id 
 * @returns 
 */
function Gutter({id}) {
    const { setNodeRef, isOver } = useDroppable({id});
    return (
        <div
            className="gutter"
            ref={setNodeRef}
            style={{background: isOver ? "white" : "#4da3ff33"}}
        ></div>
    );
}

/**
 * Tabs component.
 * @param {Object} activeTab 
 * @param {Array} tabs 
 * @returns 
 */
export const EditorTabs = ({activeTab, tabs, selectTab}) => {

    const [tabsList, setTabsList] = useState();

    useEffect(() => {
        if (tabs) {
            const list = [];
            tabs.forEach((tab, index) => {
                list.push(
                    <>
                        <Gutter id={tab.id} />
                        <Tab onSelectTab={selectTab} key={tab.id} {...tab} />
                    </>
                );
            })
            setTabsList(list);
        }
    }, [tabs]);

    return (
        <div style={{ display: "flex", background: "#222425" }}>
            {tabsList}
        </div>
    );
};

EditorTabs.propTypes = {};
