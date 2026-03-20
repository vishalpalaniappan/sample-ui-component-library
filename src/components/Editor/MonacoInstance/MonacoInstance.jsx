import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Editor from '@monaco-editor/react';

import "./MonacoInstance.scss"

import { useEditor } from "../Editor";

export const MonacoInstance = ({}) => {
    const {state} = useEditor();
    const [editorContent, setEditorContent] = useState("Loading content...");
    const [showEditor, setShowEditor] = useState(false);
    
    useEffect(() => {
        if (state.activeTab) {
            setEditorContent(state.activeTab.content);
            setShowEditor(true);
        } else {
            setShowEditor(false);
        }
    }, [state.activeTab]);

    const editorRef = useRef(null);

    const content = useRef();

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        if(content?.current) {
            editorRef.current.setValue(content.current);
        }
    }

    useEffect(() => {
        content.current = editorContent;
        if (editorRef?.current && content.current) {
            editorRef.current.setValue(content.current);
        }
    }, [editorContent]);

    const renderEditor = () => {
        return (
            <Editor
                defaultLanguage="python"
                defaultValue={editorContent}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                    scrollBeyondLastLine:false,
                    fontSize:"13px",
                    minimap: {
                        enabled: false  
                    },
                    padding: {
                        top: 20,
                        bottom: 10
                    }
                }}
            />
        );
    }

    return (
        <>
            {showEditor ? renderEditor() : <div className="no-tab">Select file or drag and drop to view.</div>}
        </>
    )
}

MonacoInstance.propTypes = {
    editorContent: PropTypes.string,
}