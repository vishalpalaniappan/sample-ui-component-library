import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Editor from '@monaco-editor/react';

import "./MonacoInstance.scss"

function Gutter({ id }) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                height: 40,
                width: 1,
                background: isOver ? "white" : "#4da3ff33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        ></div>
    );
}

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
                fontSize:"12px",
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