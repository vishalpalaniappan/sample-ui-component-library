import { useEffect, useState, useMemo } from "react";

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
    const tabsList = useMemo(() => {
        if (state.parentTabGroupId == null) return [];

        const list = [];
        state.tabs.forEach((tab, index) => {
            list.push(
                <Gutter
                    key={tab.uid + "-gutter"}
                    id={state.parentTabGroupId + "-" + index}
                    index={index}
                    parentId={state.parentTabGroupId}
                />
            );
            list.push(
                <Tab
                    key={tab.uid}
                    isDirty={tab.isDirty}
                    id={state.parentTabGroupId + "-" + tab.uid}
                    parentId={state.parentTabGroupId}
                    node={tab}
                />
            );
        });
        list.push(
            <Gutter
                key="last-gutter"
                id={state.parentTabGroupId + "-" + state.tabs.length}
                index={state.tabs.length}
                parentId={state.parentTabGroupId}
            />
        );
        return list;
    }, [state.tabs, state.activeTab, state.parentTabGroupId]);

    return (
        <div className="tabs-container" style={{background: TABS_CONTAINER_BG_COLOR }}>{tabsList}</div>
    );
};

