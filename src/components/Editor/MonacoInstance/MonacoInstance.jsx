import React, { useCallback, useLayoutEffect, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import EDITOR_MODES from '../EDITOR_MODES';

import Editor from '@monaco-editor/react';

import "./MonacoInstance.scss"

import { useEditor } from "../Editor";

export const MonacoInstance = ({ }) => {
    const { state } = useEditor();
    const [editorContent, setEditorContent] = useState("Loading content...");
    const [showEditor, setShowEditor] = useState(false);

    const editorRef = useRef(null);
    const content = useRef();
    const containerRef = useRef(null);
    const frameRef = useRef(0);

    const [overlayDivs, setOverlayDivs] = useState();

    useLayoutEffect(() => {
        if (state.activeTab) {
            setEditorContent(state.activeTab.content);
            setShowEditor(true);
            addOverlays();
        } else {
            setShowEditor(false);
        }
    }, [state.activeTab, editorRef]);

    useEffect(() => {
        content.current = editorContent;
        if (editorRef?.current && content.current !== undefined && content.current !== null) {  
            editorRef.current.setValue(content.current);
        }
    }, [editorContent]);

    /**
     * Callback for when the Monaco Editor is mounted. 
     * @param {Object} editor 
     * @param {Object} monaco 
     */
    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        if (content?.current) {
            editorRef.current.setValue(content.current);
        }
        editorRef.current.layout();
        addOverlays();
    }, [state.activeTab]);

    // Add overlays to editor for the given line ranges.
    const addOverlays = useCallback(() => {
        if (!editorRef.current) return;

        if (state.mode !== EDITOR_MODES.MAPPING || !state.activeTab?.mapping) {
            setOverlayDivs([]);
            return;
        }

        const ranges = state.activeTab.mapping;
        const lineCount = editorRef.current.getModel().getLineCount();
        const lineHeight = editorRef.current.getOption(monaco.editor.EditorOption.lineHeight);        
        const divs = [];

        ranges.forEach((entry) => {
             const top = editorRef.current.getTopForLineNumber(entry.start_line) - editorRef.current.getScrollTop();
             let bottom = editorRef.current.getTopForLineNumber(entry.end_line + 1) - editorRef.current.getScrollTop();
            if (entry.end_line >= lineCount) {
                bottom = bottom + lineHeight;
            }
             const overlayDiv = <div className="line-block-overlay" style={{ top: top + "px", height: (bottom - top) + "px" }}></div>;
             divs.push(overlayDiv);
        });
        setOverlayDivs(divs);
    }, [editorRef?.current, state]);

    // Scroll the editor and update overlays on wheel event.
    const handleWheel = useCallback((e) => {
        if (!editorRef.current) return;
        const deltaY = e.deltaY;
        const currentScrollTop = editorRef.current.getScrollTop();
        editorRef.current.setScrollTop(currentScrollTop + deltaY);
        addOverlays();
    }, [state.activeTab, addOverlays]);

    // Editor options for Monaco Editor.
    const editorOptions = {
        fontSize: "13px",
        minimap: {
            enabled: false
        },
        padding: {
            top: 10
        },
        renderWhitespace: "none",
        wordWrap: "on",
        scrollBeyondLastLine: false,
        readOnly: true,
        automaticLayout: false
    }

    // Disable automatic layout and Manually layout the editor to avoid resize observer loops
    useEffect(() => {
        if (!containerRef.current) return;

        const ro = new ResizeObserver(() => {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = requestAnimationFrame(() => {
                editorRef.current?.layout();
                addOverlays(); 
            });
        });

        ro.observe(containerRef.current);

        return () => {
            cancelAnimationFrame(frameRef.current);
            ro.disconnect();
        };
    }, [state.activeTab, addOverlays]);

    /**
     * Render the editor if there is an active tab, otherwise render a placeholder message.
     * @returns JSX
     */
    const renderEditor = () => {
        if (showEditor) {
            return (
                <Editor
                    defaultLanguage="python"
                    defaultValue={editorContent}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={editorOptions}
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
                state.mode === EDITOR_MODES.MAPPING && state.activeTab?.mapping && overlayDivs &&
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