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
export const Editor = ({tabsInfo}) => {

    const [editorContent, setEditorContent] = useState("asdf");
    
    const [activeTab, setActiveTab] = useState();

    useEffect(() => {
        if (activeTab) {
            setEditorContent(activeTab.label);
        }
    }, [activeTab]);

    
    useEffect(() => {
        if (tabsInfo) {
            if ((activeTab && activeTab > tabsInfo.tabs.length) || activeTab == null) {
                setActiveTab(tabsInfo.tabs[tabsInfo.tabs.length - 1]);
            }
        }
    }, [tabsInfo]);

    const onTabClick = (event) => {
        const tab = tabsInfo.tabs.find(obj => obj.id === event.target.id);
        setActiveTab(tab);
    }
    
    return (
        <div className="editorContainer">
            <div className="tabContainer">
                <EditorTabs activeTab={activeTab} tabsInfo={tabsInfo} selectTab={onTabClick} />
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