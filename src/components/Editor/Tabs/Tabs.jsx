import { useEffect, useState } from "react";

import { Gutter } from "./Gutter/Gutter";
import { Tab } from "./Tab/Tab";

import { useEditor } from "../Editor";

import "./Tabs.scss";

const TABS_CONTAINER_BG_COLOR = "#222425";

/**
 * Tabs component. Renders the tabs based on the tabs info provided in the context. 
 * Also renders gutters between the tabs and on the sides for dropping tabs into empty spaces.
 * @returns
 */
export const Tabs = () => {
    const { state } = useEditor();
    const [tabsList, setTabsList] = useState();

    useEffect(() => {
        if (state.tabs?.length >= 0 && state.parentTabGroupId != null) {
            drawTabs(state.tabs, state.parentTabGroupId);
        }
    }, [state.tabs, state.parentTabGroupId]);

    /**
     * Draw the tabs provided in the tabs info. This includes the gutters
     * between the tabs and on the sides for dropping tabs into empty spaces.
     * @param {Object} tabs 
     * @returns 
     */
    const drawTabs = (tabs, tabGroupId) => {
        const list = [];
        tabs.forEach((tab, index) => {
            list.push(<Gutter key={tab.uid + "-gutter"} id={tabGroupId + "-" + index} index={index} parentId={tabGroupId} />);
            list.push(<Tab key={tab.uid} id={tab.uid} parentId={tabGroupId} node={tab} />);
        });
        list.push(<Gutter key="last-gutter" id={tabGroupId + "-" + tabs.length} index={tabs.length} parentId={tabGroupId} />);
        setTabsList(list);
    };

    return (
        <div className="tabs" style={{background: TABS_CONTAINER_BG_COLOR }}>{tabsList}</div>
    );
};

