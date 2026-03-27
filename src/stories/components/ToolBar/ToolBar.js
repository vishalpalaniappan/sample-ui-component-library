import React, { useState } from "react";

import {
  Cursor,
  Square,
  NodePlus,
  Trash
} from "react-bootstrap-icons";

import "./ToolBar.scss";

ToolBar.propTypes = {};

/**
 * Toolbar Component
 * @return {JSX.Element}
 */
export function ToolBar({ onSelectTool }) {
  const [selectedTool, setSelectedTool] = useState("select");

  const selectTool = (tool) => {
    setSelectedTool(tool);
    onSelectTool(tool);
  };

  return (
    <div className="toolbarWrapper">
      <div className="toolbarContainer">
        <Cursor
          onClick={(e) => selectTool("select")}
          style={{color: selectedTool === "select" ? "white": "grey"}}
          title="Select"
          className="icon"
        />
        <Square
          onClick={(e) => selectTool("drop")}
          style={{color: selectedTool === "drop" ? "white": "grey"}}
          title="Add Node"
          className="icon"
        />
        <NodePlus
          onClick={(e) => selectTool("connect")}
          style={{color: selectedTool === "connect" ? "white": "grey"}}
          title="Connect Node"
          className="icon"
        />
        <Trash
          onClick={(e) => selectTool("delete")}
          style={{color: selectedTool === "delete" ? "white": "grey"}}
          title="Delete Node"
          className="icon"
        />
      </div>
      <div className="toolbarContainer bottom"></div>
    </div>
  );
}
