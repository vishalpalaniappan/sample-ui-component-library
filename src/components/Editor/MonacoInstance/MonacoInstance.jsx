import React, { useEffect, useRef, useState, useContext } from 'react';
import PropTypes from 'prop-types';

import Editor from '@monaco-editor/react';

import "./MonacoInstance.scss"

import { EditorContext } from "../EditorContext";

export const MonacoInstance = ({}) => {
    const {activeTab, tabsInfo} = useContext(EditorContext);
    const [editorContent, setEditorContent] = useState("Loading content...");
    
    useEffect(() => {
        if (activeTab) {
            setEditorContent(activeTab.content);
        } 
    }, [activeTab, tabsInfo]);

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

    return (
        <Editor
            defaultLanguage="python"
            defaultValue=""
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
                scrollBeyondLastLine:false,
                fontSize:"13px",
                minimap: {
                    enabled: false  
                }
            }}
        />
    );
}

MonacoInstance.propTypes = {
    editorContent: PropTypes.string,
}