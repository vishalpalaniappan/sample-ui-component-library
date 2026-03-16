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
            setEditorContent(activeTab.label);
        }
    }, [activeTab]);

    
    useEffect(() => {
        if (tabs) {
            if ((activeTab && activeTab > tabs.length) || activeTab == null) {
                setActiveTab(tabs[tabs.length - 1]);
            }
        }
    }, [tabs]);

    const onTabClick = (event) => {
        const tab = tabs.find(obj => obj.id === event.target.id);
        setActiveTab(tab);
    }
    
    return (
        <div className="editorContainer">
            <div className="tabContainer">
                <EditorTabs activeTab={activeTab} tabs={tabs} selectTab={onTabClick} />
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