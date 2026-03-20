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
    useReducer,
    useContext
} from "react";

import { EditorContext } from "./EditorContext";

import { editorReducer, initialState } from "./EditorReducer";

/**
 * Renders the editor component with support for tabs.
 * 
 * @return {JSX}
 */
export const Editor = forwardRef(({ }, ref) => {
    // TODO: Use reducer to improve state management.
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

    const addTab = useCallback((tab) => {
        dispatch({ type: "ADD_TAB", payload: tab });
    }, []);

    const setTabGroupId = useCallback((id) => {
        dispatch({ type: "SET_PARENT_TAB_GROUP_ID", payload: id });
    }, []);

    const getPreviewElement = useCallback((tabId) => {
        // Get the preview element for a tab by its id for use in drag-and-drop operations.
        const tab = state.tabs.find(t => t.id === tabId);
        return <TabPreview info={{ label: tab.label }} />;
    }, [state]);

    const api = useMemo(() => {
        return {
            state,
            addTab,
            setTabGroupId,
            selectTab,
            closeTab,
            moveTab,
            getPreviewElement
        };
    }, [state, addTab, selectTab, closeTab, moveTab, getPreviewElement, setTabGroupId]);

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

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditor must be used inside <Editor>");
  }
  return ctx;
}