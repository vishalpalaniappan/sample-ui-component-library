import React, { useCallback, forwardRef, useLayoutEffect, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import EDITOR_MODES from '../EDITOR_MODES';

import Editor from '@monaco-editor/react';

import "./MonacoInstance.scss"

import { useEditor } from "../Editor";

export const MonacoInstance = ({onSelectAbstraction, updateContent}) => {
    const { state } = useEditor();
    const [editorContent, setEditorContent] = useState("Loading content...");
    const [showEditor, setShowEditor] = useState(false);
    const activeTabRef = useRef(state.activeTab);

    const editorRef = useRef(null);
    const modelsRef = useRef(new Map());
    const content = useRef();

    // When active tab changes, update the editor content and add overlays for the new active tab.
    useLayoutEffect(() => {
        if (state.activeTab) {
            (editorRef.current) && editorRef.current.setModel(getModel(state.activeTab));
            setShowEditor(true);
        } else {
            setShowEditor(false);
        }
    }, [state.activeTab, editorRef]);

    // Get the model given the tab.
    const getModel = useCallback((activeTab) => {
        if (modelsRef.current.has(activeTab.name)) {
            return modelsRef.current.get(activeTab.name);
        }
        const uri = monaco.Uri.parse(`file:///${activeTab.name}`);
        const model = monaco.editor.createModel(activeTab.content, "python", uri);
        modelsRef.current.set(activeTab.name, model);
        return model;
    }, []);

    // When the editor content changes, update the content in the context for the active tab.
    // Setup content change listener for the editor to update the content in the context 
    // and track dirty state of the tab.
    useEffect(() => {
        content.current = editorContent;
        if (editorRef?.current && content.current !== undefined && content.current !== null) {  
            editorRef.current.setValue(content.current);
            editorRef.current.getModel().onDidChangeContent((content) => {
                updateContent(activeTabRef.current, editorRef.current.getValue());
            });
        }
    }, [editorContent]);

    
    // Editor mounted callback to setup editor reference and initial content.
    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        // Clear existing models to prevent duplicates and memory leaks.
        modelsRef.current = new Map();
        monaco.editor.getModels().forEach(model => model.dispose());

        if (state.activeTab) {
            editorRef.current.setModel(getModel(state.activeTab));
            setShowEditor(true);
        }
    }, [state.activeTab, modelsRef]);

    // Disable automatic layout and Manually layout the editor to avoid resize observer loops
    const containerRef = useRef(null);
    const frameRef = useRef(0);
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
                editorRef.current?.layout();
            });
        });
        ro.observe(containerRef.current);
        return () => {
            cancelAnimationFrame(frameRef.current);
            ro.disconnect();
        };
    }, [state.activeTab]);

    /**
     * Render the editor if there is an active tab, otherwise render a placeholder message.
     * @returns JSX
     */
    const renderEditor = () => {
        if (showEditor) {
            return (
                <Editor
                    defaultLanguage="python"
                    defaultValue={"Loading content..."}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false},
                        padding: {top: 10},
                        renderWhitespace: "none",
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: false
                    }}
                />
            );
        } else {
            return <div className="no-tab">Select file or drag and drop to view.</div>;
        }
    }

    return (
        <div className="editor-container" ref={containerRef}>
            {renderEditor()}
            {
                state.mode === EDITOR_MODES.MAPPING &&
                <div className="overlay-layer" onWheel={handleWheel}>
                    {overlayDivs}
                </div>
            }
        </div>
    )
}

MonacoInstance.propTypes = {
    editorContent: PropTypes.string,
}