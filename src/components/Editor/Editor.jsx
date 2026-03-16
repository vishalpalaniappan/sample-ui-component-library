import "./Editor.scss";
import PropTypes from 'prop-types';

import { MonacoInstance } from "./MonacoInstance/MonacoInstance";
import { EditorTabs } from "./EditorTabs/EditorTabs";
import { useEffect, useState } from "react";

/**
 * Renders the editor component with support for tabs.
 * 
 * @return {JSX}
 */
export const Editor = ({systemTree, onFileSelect}) => {

    const [editorContent, setEditorContent] = useState("asdf");
    
    const [activeTab, setActiveTab] = useState();
    const [tabs, setTabs] = useState([
        { id: "tab1", label: "Tab 1" },
        { id: "tab2", label: "Tab 2" },
        { id: "tab3", label: "Tab 3" },
    ]);

    useEffect(() => {
        if (activeTab) {
            setEditorContent(tabs[activeTab - 1].label);
        }
    }, [activeTab]);

    
    useEffect(() => {
        if (tabs) {
            if ((activeTab && activeTab > tabs.length) || activeTab == null) {
                setActiveTab(tabs.length);
            }
        }
    }, [tabs]);

    const onTabClick = (event) => {
        const tabIndex = tabs.findIndex(obj => obj.id === event.target.id);
        setActiveTab(tabIndex + 1);
    }
    
    return (
        <div className="editorContainer">
            <div className="tabContainer">
                <EditorTabs activeTab={1} tabs={tabs} selectTab={onTabClick} />
            </div>
            <div className="monacoContainer">
                <MonacoInstance editorContent={editorContent}/>
            </div>
        </div>
    );
}

Editor.propTypes = {
    systemTree: PropTypes.object,
    onFileSelect: PropTypes.func
}