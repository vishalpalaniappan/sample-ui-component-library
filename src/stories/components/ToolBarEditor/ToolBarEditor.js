import React, { useState } from "react";

import { Alt, Crosshair } from "react-bootstrap-icons";

import "./ToolBarEditor.scss";

ToolBarEditor.propTypes = {};

/**
 * ToolBarEditor Component
 * @return {JSX.Element}
 */
export function ToolBarEditor({ onSelectTool }) {
    const [selectedTool, setSelectedTool] = useState("select");

    const selectTool = (tool) => {
        setSelectedTool(tool);
        onSelectTool(tool);
    };

    return (
        <div className="toolbarWrapper">
            <div className="toolbarContainer">
                <Alt
                    onClick={(e) => selectTool("implementation-mode")}
                    title="Implementation Mode"
                    className="icon"
                />
                <Crosshair
                    onClick={(e) => selectTool("mapping-mode")}
                    title="Mapping Mode"
                    className="icon"
                />
            </div>
            <div className="toolbarContainer bottom"></div>
        </div>
    );
}
