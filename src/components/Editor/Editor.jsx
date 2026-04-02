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
    useContext
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
export const Editor = forwardRef(({ onSelectAbstraction }, ref) => {
    const [state, dispatch] = useReducer(editorReducer, initialState);

    const selectTab = useCallback((id) => {
        dispatch({ type: "SELECT_TAB", payload: id });
    }, []);

    const closeTab = useCallback((id) => {
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

    const setMappedIds = useCallback((ids) => {
        dispatch({ type: "SET_MAPPED_IDS", payload: ids });
    }, []);

    const api = useMemo(() => {
        return {
            state,
            addTab,
            setTabGroupId,
            selectTab,
            closeTab,
            moveTab,
            setMapping,
            setMode,
            setMappedIds
        };
    }, [state, addTab, selectTab, closeTab, moveTab, setTabGroupId, setMapping, setMode, setMappedIds]);

    useImperativeHandle(ref, () => api, [api]);

    return (
        <EditorContext.Provider value={api}>
            <div className="editorContainer">
                <div className="tabContainer">
                    <Tabs />
                </div>
                <div className="monacoContainer">
                    <MonacoInstance onSelectAbstraction={onSelectAbstraction}/>
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