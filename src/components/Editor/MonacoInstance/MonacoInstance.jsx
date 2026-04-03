import React, {
    useCallback,
    forwardRef,
    useLayoutEffect,
    useEffect,
    useRef,
    useState,
    useMemo,
    useImperativeHandle
} from "react";
import PropTypes from "prop-types";

import { useEditor } from "../Editor";

import EDITOR_MODES from "../EDITOR_MODES";

import Editor from "@monaco-editor/react";

import "./MonacoInstance.scss";

export const MonacoInstance = forwardRef(({ onSelectAbstraction }, ref) => {
        const { state, setUpdatedContent } = useEditor();
        const [showEditor, setShowEditor] = useState(false);
        const activeTabRef = useRef(state.activeTab);

        const editorRef = useRef(null);
        const modelsRef = useRef(new Map());

        // When active tab changes, update the editor content and add overlays for the new active tab.
        useEffect(() => {
            if (state.activeTab) {
                activeTabRef.current = state.activeTab;
                editorRef.current && editorRef.current.setModel(getModel(state.activeTab));
                setShowEditor(true);
            } else {
                activeTabRef.current = null;
                setShowEditor(false);
            }
        }, [state.activeTab, editorRef]);

        useEffect(() => {
            return () => {
                // Dispose all models on unmount to prevent memory leaks.
                modelsRef.current.forEach((model) => model.dispose());
                modelsRef.current.clear();
            }
        }, []); 

        // Get the model given the tab.
        const getModel = useCallback((activeTab) => {
            let model;
            if (modelsRef.current.has(activeTab.uid)) {
                model = modelsRef.current.get(activeTab.uid);
            } else {
                const uri = monaco.Uri.parse(`file:///${activeTab.uid}`);
                model = monaco.editor.createModel(activeTab.content, "python", uri);
                modelsRef.current.set(activeTab.uid, model);
            }
            model.onDidChangeContent((content) => {
                setUpdatedContent(activeTabRef.current, editorRef.current.getValue());
            });
            return model;
        }, [editorRef, modelsRef, setUpdatedContent]);

        // Setup editor ref, and clear existing models on mount to prevent mem leak from old models.
        const handleEditorDidMount = useCallback((editor, monaco) => {
            editorRef.current = editor;
            editor.layout();
            modelsRef.current = new Map();
            monaco.editor.getModels().forEach((model) => model.dispose());

            if (activeTabRef.current) {
                editorRef.current.setModel(getModel(activeTabRef.current));
                setShowEditor(true);
            }
        }, []);

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

        // Setup imperative handle to clear model when tab is closed to prevent mem leak
        const clearModel = useCallback((id) => {
            if (modelsRef.current.has(id)) {
                const model = modelsRef.current.get(id);
                model.dispose();
                modelsRef.current.delete(id);
            }
        }, []);

        const api = useMemo(() => {
            return {
                clearModel,
            };
        }, [clearModel]);

        useImperativeHandle(ref, () => api, [api]);

        return (
            <div className="editor-container" ref={containerRef}>
                {
                    showEditor ? 
                    <Editor
                        defaultLanguage="python"
                        defaultValue={"Loading content..."}
                        onMount={handleEditorDidMount}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            padding: { top: 10 },
                            renderWhitespace: "none",
                            wordWrap: "on",
                            scrollBeyondLastLine: false,
                            automaticLayout: false,
                        }}
                    />: 
                    <div className="no-tab">Select file or drag and drop to view.</div>
                }
                {state.mode === EDITOR_MODES.MAPPING && (
                    <div className="overlay-layer" onWheel={handleWheel}>
                        {overlayDivs}
                    </div>
                )}
            </div>
        );
    },
);

MonacoInstance.propTypes = {
    editorContent: PropTypes.string,
};
