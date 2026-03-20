import { useEffect, useState, useContext } from "react";

import { Gutter } from "./Gutter/Gutter";
import { Tab } from "./Tab/Tab";
import { EditorContext } from "../EditorContext";

import "./Tabs.scss";

const TABS_CONTAINER_BG_COLOR = "#222425";

/**
 * Tabs component. Renders the tabs based on the tabs info provided in the context. 
 * Also renders gutters between the tabs and on the sides for dropping tabs into empty spaces.
 * @returns
 */
export const Tabs = () => {
    const { tabs, tabGroupId } = useContext(EditorContext);
    const [tabsList, setTabsList] = useState();

    useEffect(() => {
        if (tabs?.length >= 0 && tabGroupId) {
            drawTabs(tabs);
        }
    }, [tabs, tabGroupId]);

    /**
     * Draw the tabs provided in the tabs info. This includes the gutters
     * between the tabs and on the sides for dropping tabs into empty spaces.
     * @param {Object} tabs 
     * @returns 
     */
    const drawTabs = (tabs) => {
        const list = [];
        tabs.forEach((tab, index) => {
            list.push(<Gutter key={tab.id + "-gutter"} id={index} index={index} parentId={tabGroupId} />);
            list.push(<Tab key={tab.id} id={tab.id} parentId={tabGroupId} info={tab} />);
        });
        list.push(<Gutter key="last-gutter" id={tabs.length} index={tabs.length} parentId={tabGroupId} />);
        setTabsList(list);
    };

    return (
        <div style={{ display: "flex", background: TABS_CONTAINER_BG_COLOR }}>{tabsList}</div>
    );
};

