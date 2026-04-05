import React from "react";
import PropTypes from "prop-types";

import "./OverlayRow.scss";

export const OverlayRow =({ entry, top, bottom, onSelectAbstraction }) => {   
    // Set background color if it exists, otherwise transperant
    const style= {
        "top": top + "px",
        "height": (bottom - top) + "px",
        "backgroundColor": entry?.backgroundColor || "none"
    };

    // If entry doesn't have background color, add hover effect.
    let className = "line-block-overlay";
    if (!entry.backgroundColor) {
        className += " line-block-overlay-hover";
    }   

    const selectRow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectAbstraction(entry);
    }

    return (
        <div className={className} style={style} onClick={selectRow}></div>
    );
};

OverlayRow.propTypes = {
    entry: PropTypes.object.isRequired,
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    onSelectAbstraction: PropTypes.func.isRequired,
};
