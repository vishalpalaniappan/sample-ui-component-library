import "./Editor.scss";
import PropTypes from 'prop-types';

import { MonacoInstance } from "./MonacoInstance/MonacoInstance";
import { Tabs } from "./Tabs/Tabs";

import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useReducer,
    useContext,
    useRef,
    useEffect
} from "react";

import { EditorContext } from "./EditorContext";

import { editorReducer, initialState } from "./EditorReducer";

const MODES = {
    MAPPING: 1,
    IMPLEMENTATION: 2
}

/**
 * Renders the editor component with support for tabs.
 * 
 * @return {JSX}
 */
export const Editor = forwardRef(({ onSelectAbstraction, onSelectTab, onUpdateContent }, ref) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);
    const editorRef = useRef();

    useEffect(() => {
        if (onSelectTab) {
            onSelectTab(state.activeTab);
        }
    }, [state.activeTab]);

    const selectTab = useCallback((id) => {
        dispatch({ type: "SELECT_TAB", payload: id });
    }, [onSelectTab]);

    const closeTab = useCallback((id) => {
        editorRef.current && editorRef.current.clearModel(id);
        dispatch({ type: "CLOSE_TAB", payload: id });
    }, []);

    const moveTab = useCallback((tabId, newIndex) => {
        dispatch({ type: "MOVE_TAB", payload: { tabId, newIndex } });
    }, []);

    const addTab = useCallback((tab, index) => {
        dispatch({ type: "ADD_TAB", payload: { tab, index } });
    }, []);

    const setTabGroupId = useCallback((id) => {
        dispatch({ type: "RESET_STATE"});
        dispatch({ type: "SET_PARENT_TAB_GROUP_ID", payload: id });
    }, []);
    
    const setMapping = useCallback((fileName, mapping) => {
        dispatch({ type: "SET_MAPPING", payload: { fileName, mapping } });
    }, []);
    
    const setMode = useCallback((mode) => {
        dispatch({ type: "SET_MODE", payload: mode });
    }, []);

    const setCurrentBehavior = useCallback((id) => {
        dispatch({ type: "SET_CURRENT_BEHAVIOR", payload: id });
    }, []);

    const getTabs = useCallback(() => {
        return state.tabs;
    }, [state.tabs]);

    const getTab = useCallback((id) => {
        return state.tabs.find((tab) => tab.uid === id);
    }, [state.tabs]);

    const getActiveTab = useCallback(() => {
        return state.tabs.find((tab) => tab.id === state.activeTabId);
    }, [state.tabs, state.activeTabId]);

    const setUpdatedContent = useCallback((tab, content) => {
        dispatch({ type: "SET_UPDATED_CONTENT", payload: {tab, content} });
        if (onUpdateContent) {
            onUpdateContent(tab, content);
        }
    }, [onUpdateContent]);

    const setContent = useCallback((tab, content) => {
        dispatch({ type: "SET_CONTENT", payload: {tab, content} });
    }, []);

    const saveAll = useCallback(() => {
        dispatch({ type: "SAVE_ALL", payload: {} });
    }, []);

    const layoutEditor = useCallback(() => {
        editorRef.current && editorRef.current.layoutModel();
    }, []);

    const goToLine = useCallback((lineNumber) => {
        editorRef.current && editorRef.current.goToLine(lineNumber);
    }, []);

    const api_entries = {
        state,
        addTab,
        setTabGroupId,
        selectTab,
        closeTab,
        moveTab,
        setMapping,
        setMode,
        setCurrentBehavior,
        getTab,
        getTabs,
        getActiveTab,
        setUpdatedContent,
        setContent,
        saveAll,
        layoutEditor,
        goToLine
    }

    const api = useMemo(() => {
        return api_entries;
    }, Object.values(api_entries));

    useImperativeHandle(ref, () => api, [api]);

    return (
        <EditorContext.Provider value={api}>
            <div className="editorContainer">
                <div className="tabContainer">
                    <Tabs />
                </div>
                <div className="monacoContainer">
                    <MonacoInstance 
                        ref={editorRef}
                        onSelectAbstraction={onSelectAbstraction}/>
                </div>
            </div>
        </EditorContext.Provider>
    );
});

Editor.displayName = "Editor";

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used inside <Editor>");
  }
  return ctx;
}