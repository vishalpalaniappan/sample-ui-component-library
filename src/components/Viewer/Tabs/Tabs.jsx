import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';

import {ChevronDown} from "react-bootstrap-icons";
import {Tab} from "./Tab/Tab"

import Dropdown from 'react-bootstrap/Dropdown';

import 'bootstrap/dist/css/bootstrap.css';
import "./Tabs.scss";

// Dropdown needs access to the DOM node in order to position the Menu
const SelectFileToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a ref={ref} onClick={(e) => { e.preventDefault(); onClick(e); }}>
        {children}
    </a>
));

/**
 * Renders the tabs component.
 * 
 * The tabs component accepts a list of files which have been flattened from
 * its system tree structure with a unique id. 
 * 
 * It allows you to add a tab, close a tab and select add new tabs using the 
 * file drop down.
 * 
 * @return {JSX}
 */
export const Tabs = ({files, selectFile, systemTree}) => {

    const [activeTab, setActiveTab] = useState(null);
    const [tabsList, setTabsList] = useState([]);

    const selectTab = (e, file) => {
        setActiveTab(file.key);
        selectFile(file.key)
    }

    const addTab = (key) => {
        const currTabsList = [...tabsList];

        let hasKey = currTabsList.find((tab) => tab.key == key)

        if (hasKey) {
            // Set the active tab and select the file.
            setActiveTab(key);
            selectFile(key);
        } else {
            // Add tab to the tabs list.
            files.forEach((file, index) => {
                if (file.key == key) {
                    currTabsList.push(file);
                    setActiveTab(file.key);
                    selectFile(file.key);
                    setTabsList(currTabsList);
                }
            });
        }
    }

    const closeTab = (e, file) => {
        e.stopPropagation();

        // Get index of file in tabs list
        const index = tabsList.indexOf(file);

        // Remove the closed tab
        const currTabsList = [...tabsList];
        currTabsList.splice(index, 1);
        setTabsList(currTabsList);

        // Select new tab
        if (currTabsList.length == 0) {
            selectFile(null);
            setActiveTab(null);
        } else {
            // If its the last tab, use the last tab in the new tabs list.
            const newIndex = (index >= currTabsList.length)?currTabsList.length - 1:index;
            setActiveTab(currTabsList[newIndex].key);
            selectFile(currTabsList[newIndex].key);
        }
    }

    const generateDropdown = () => {
        const items = [];

        if (!systemTree) {
            return items;
        }

        // Build files list from system
        for (const program in systemTree) {
            items.push(<Dropdown.Header>{program}</Dropdown.Header>);
            for (const fileName in systemTree[program]) {
                const key = program + "_" + fileName;
                items.push(
                    <Dropdown.Item key={key} onClick={() => addTab(key)}>{fileName}</Dropdown.Item>
                );
            }
            items.push(<Dropdown.Divider />);
        }

        // Remove last divider
        items.pop();

        return items;
    }

    useEffect(() => {
        if (files && files.length > 0) {    
            setTabsList(files);
            setActiveTab(files[0].key);
            selectFile(files[0].key);
        }
    }, [files]);
    
    return (

        <div className="tabsGutter">

            <div className="tabsContainer">
                {tabsList.map(function(file) {
                    return <Tab 
                        file={file} 
                        key={file.key} 
                        activeTab={activeTab} 
                        selectTab={selectTab}
                        closeTab={closeTab}
                    />
                })}
            </div>

            <div className="tabsDropdown">
                {
                    (files && files.length > 0) &&
                    <Dropdown data-bs-theme="dark">
                        <Dropdown.Toggle as={SelectFileToggle}>
                            <ChevronDown className="chevron" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {generateDropdown()}
                        </Dropdown.Menu>
                    </Dropdown>
                }
            </div>

        </div>
    );
}

Tabs.propTypes = {
    files: PropTypes.array,
    selectFile: PropTypes.func,
    systemTree: PropTypes.object
}