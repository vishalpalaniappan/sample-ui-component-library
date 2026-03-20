import "./Editor.scss";
import PropTypes from 'prop-types';

import { MonacoInstance } from "./MonacoInstance/MonacoInstance";
import { Tabs } from "./Tabs/Tabs";
import { TabPreview } from "./Tabs/Tab/Tab";
import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState,
    useEffect,
} from "react";

import { EditorContext } from "./EditorContext";

/**
 * Renders the editor component with support for tabs.
 * 
 * @return {JSX}
 */
export const Editor = forwardRef(({ }, ref) => {
    const [activeTab, setActiveTab] = useState();
    const [tabGroupId, setTabGroupId] = useState();
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        // Default to the last tab if no active tab is set.
        if (tabs.length > 0 && !activeTab) {
            setActiveTab(tabs[tabs.length - 1]);
        }
    }, [tabs]);

    const selectTab = useCallback((id) => {
        // Select a tab by its id (if the tab exists).
        if (tabs.length > 0) {
            const tab = tabs.find(obj => obj.id === id);
            if (tab) {
                setActiveTab(tab);
            } else {
                console.error(`Tab with id ${id} not found.`);
            }
        }
    }, [tabs]);

    const closeTab = useCallback((id) => {
        // Close a tab by its id (if the tab exists) and update the active tab if necessary.
        const ind = tabs.findIndex(obj => obj.id === id);
        if (ind !== -1) {
            const newTabs = [...tabs];
            newTabs.splice(ind, 1);
            setTabs(newTabs);

            // If the closed tab is the active tab, set the active tab to the next available tab.
            setActiveTab(prev => {
                return (prev.id === id) ? ((newTabs.length > 0) ? newTabs[Math.max(0, ind - 1)] : null) : prev;
            });
        } else {
            console.warn(`Tab with id ${id} not found.`);
        }
    }, [tabs, setActiveTab]);

    const moveTab = useCallback((tabId, newIndex) => {
        // Move a tab to a new index within the same tab group.
        const prevTabs = [...tabs];
        const oldIndex = prevTabs.findIndex(t => t.id === tabId);
        if (newIndex - 1 === oldIndex || newIndex === oldIndex) return;

        // Remove the tab from its old position and insert it into the new position.
        const [tab] = prevTabs.splice(oldIndex, 1);
        newIndex = (oldIndex < newIndex) ? newIndex - 1 : newIndex;
        prevTabs.splice(newIndex, 0, tab);

        setTabs(prevTabs);
    }, [tabs, setTabs]);

    const addTab = useCallback((tab) => {
        // Add a new tab to the end of the tabs array.
        setTabs(prev => [...prev, tab]);
    }, [tabs, setTabs]);

    const getPreviewElement = useCallback((tabId) => {
        // Get the preview element for a tab by its id for use in drag-and-drop operations.
        const tab = tabs.find(t => t.id === tabId);
        return <TabPreview info={{ label: tab.label }} />;
    }, [tabs]);

    const api = useMemo(() => {
        return {
            addTab,
            tabs,
            setTabGroupId,
            tabGroupId,
            selectTab,
            closeTab,
            activeTab,
            moveTab,
            getPreviewElement
        };
    }, [addTab, tabs, tabGroupId, selectTab, closeTab, activeTab, moveTab, getPreviewElement, setTabGroupId]);

    useImperativeHandle(ref, () => api, [api]);

    return (
        <EditorContext.Provider value={api}>
            <div className="editorContainer">
                <div className="tabContainer">
                    <Tabs />
                </div>
                <div className="monacoContainer">
                    <MonacoInstance />
                </div>
            </div>
        </EditorContext.Provider>
    );
});

Editor.propTypes = {
    systemTree: PropTypes.object,
    onFileSelect: PropTypes.func
}