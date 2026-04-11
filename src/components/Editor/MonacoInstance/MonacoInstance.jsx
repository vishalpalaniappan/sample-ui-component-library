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

import { OverlayRow } from "./OverlayRow/OverlayRow";

import Editor from "@monaco-editor/react";

import "./MonacoInstance.scss";

export const MonacoInstance = forwardRef(({ onSelectAbstraction, onContentChange }, ref) => {
        const { state, setUpdatedContent } = useEditor();
        const [showEditor, setShowEditor] = useState(false);
        const activeTabRef = useRef(state.activeTab);
        
        const [overlayDivs, setOverlayDivs] = useState();

        const editorRef = useRef(null);
        const modelsRef = useRef(new Map());
        const updateOverlaysRef = useRef(null);
        const shouldUpdateContentRef = useRef(null);

        // When active tab changes, update the editor content and add overlays for the new active tab.
        useEffect(() => {
            // Checking for updated conent is a band aid, i need to investiage why the active tab is {}
            if (state.activeTab && "content" in state.activeTab) {
                shouldUpdateContentRef.current = false;
                activeTabRef.current = state.activeTab;
                editorRef.current && editorRef.current.setModel(getModel(state.activeTab));
                updateOverlays();
                setShowEditor(true);
                shouldUpdateContentRef.current = true;
            } else {
                shouldUpdateContentRef.current = false;
                activeTabRef.current = null;
                setShowEditor(false);
                setOverlayDivs(null);
            }
        }, [state.activeTab, state.mode, editorRef]);

        // Update overlays for mapping mode.
        const updateOverlays = useCallback(() => {
            if (!editorRef.current ) return;
            if (state.mode !== EDITOR_MODES.MAPPING  || !activeTabRef?.current?.mapping) {
                editorRef.current.updateOptions({stickyScroll: { enabled: true }});
                setOverlayDivs(null);
                return;
            };
            const _editor = editorRef.current;
            if (_editor.getModel() === null) return;
            _editor.updateOptions({stickyScroll: { enabled: false }});
            const lineCount = _editor.getModel().getLineCount();
            const lineHeight = _editor.getOption(monaco.editor.EditorOption.lineHeight);        
            const divs = [];

            activeTabRef.current.mapping.forEach((entry) => {
                const top = _editor.getTopForLineNumber(entry.start_line) - _editor.getScrollTop();
                let bottom = _editor.getTopForLineNumber(entry.end_line + 1) - _editor.getScrollTop();
                if (entry.end_line >= lineCount) {
                    bottom = bottom + lineHeight;
                }
                divs.push(
                    <OverlayRow
                        key={entry.uid}
                        entry={entry}
                        top={top}
                        bottom={bottom}
                        onSelectAbstraction={onSelectAbstraction}
                    />
                );
            });
            setOverlayDivs(divs);
        }, [editorRef, state.activeTab, state.mode, onSelectAbstraction]);

        // Used to access update overlays in editor event listeners without causing re-subscription on every render.
        useEffect(() => {
            updateOverlaysRef.current = updateOverlays;
        }, [updateOverlays]);

        // Scroll the editor and update overlays on wheel event in mapping mode.
        const handleWheel = useCallback((e) => {
            if (!editorRef.current) return;
            const deltaY = e.deltaY;
            const currentScrollTop = editorRef.current.getScrollTop();
            editorRef.current.setScrollTop(currentScrollTop + deltaY);
            updateOverlaysRef.current?.();
        }, [state.activeTab, updateOverlays]);
        
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
                model.setValue(activeTabRef.current.updatedContent);
            } else {
                const uri = monaco.Uri.parse(`file:///${activeTab.uid}`);
                model = monaco.editor.createModel(activeTabRef.current.updatedContent, "python", uri);
                modelsRef.current.set(activeTab.uid, model);
                model.onDidChangeContent(() => {
                    if (onContentChange && shouldUpdateContentRef.current) {
                        onContentChange(activeTabRef.current, model.getValue());
                    }
                });
            }
            return model;
        }, [editorRef, modelsRef, state.activeTab, activeTabRef, onContentChange]);

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

            const d1 = editor.onDidScrollChange(() => {
                updateOverlaysRef.current?.();
            });

            const d2 = editor.onDidChangeCursorPosition(() => {
                updateOverlaysRef.current?.();
            });

            editor.onDidDispose(() => {
                d1.dispose();
                d2.dispose();
            });
        }, [getModel]);

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

        // Programatically trigger layout of editor and render overlays.
        const layoutModel = useCallback(() => {
            editorRef.current?.layout();
            updateOverlays();
        }, [editorRef, state.activeTab, state.mode, onSelectAbstraction]);

        /**
         * Programatically go to a line number.
         */
        const goToLine = useCallback((lineNumber) => {
            editorRef.current && editorRef.current.revealLineNearTop(lineNumber);
        }, []);

        const api = useMemo(() => {
            return {
                clearModel,
                layoutModel,
                goToLine,
            };
        }, [clearModel, layoutModel, goToLine]);

        useImperativeHandle(ref, () => api, [api]);

        return (
            <div className="editor-container" ref={containerRef}>
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
                />
                {
                    !showEditor ? 
                    <div className="no-tab">Select file or drag and drop to view.</div>:null
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
