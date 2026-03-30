import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

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
    const [overlayStyle, setOverlayStyle] = useState();

    useEffect(() => {
        if (state.activeTab) {
            setEditorContent(state.activeTab.content);
            setShowEditor(true);
        } else {
            setShowEditor(false);
        }
    }, [state.activeTab]);

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
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        if (content?.current) {
            editorRef.current.setValue(content.current);
        }
        editorRef.current.layout();

        addOverlay(10,13);
    }

    const addOverlay = (startLine, endLine) => {
        if (!editorRef.current) return;

        const top = editorRef.current.getTopForLineNumber(startLine) - editorRef.current.getScrollTop();
        const bottom = editorRef.current.getTopForLineNumber(endLine + 1) - editorRef.current.getScrollTop();

        console.log(top, bottom);

        setOverlayStyle({
            top: top + "px",
            height: (bottom - top) + "px"
        });
    }

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
            });
        });

        ro.observe(containerRef.current);

        return () => {
            cancelAnimationFrame(frameRef.current);
            ro.disconnect();
        };
    }, []);

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
            <div className="overlay-layer">
                <div style={overlayStyle}  className="line-block-overlay"></div>
            </div>
        </div>
    )
}

MonacoInstance.propTypes = {
    editorContent: PropTypes.string,
}