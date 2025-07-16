import React, { useEffect, useRef, useState } from 'react';

import Editor from '@monaco-editor/react';

import "./MonacoInstance.scss"

export const MonacoInstance = ({editorContent}) => {
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
                fontSize:"12px"
            }}
        />
    );
}