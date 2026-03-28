import React, { useState } from "react";

import {
  PlusSquare,
  Floppy
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
        <PlusSquare
          onClick={(e) => selectTool("add-node")}
          title="Add Node"
          className="icon"
        />
      </div>
      <div className="toolbarContainer bottom"></div>
        <Floppy
          onClick={(e) => selectTool("save")}
          title="Save Design"
          className="icon"
        />
    </div>
  );
}
