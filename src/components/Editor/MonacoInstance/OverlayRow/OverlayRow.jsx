import React from "react";
import PropTypes from "prop-types";

import "./OverlayRow.scss";

export const OverlayRow =({ entry, top, bottom, onSelectAbstraction }) => {   
    // Set background color if it exists, otherwise transperant
    const style= {
        "top": top + "px",
        "height": (bottom - top) + "px",
    };

    let className = "line-block-overlay";
    if (entry.isMappedCurrent) {
        style["backgroundColor"] = "rgba(189, 56, 56, 0.3)";
    } else if (entry.isMappedOther) {
        style["backgroundColor"] = "rgba(138, 138, 138, 0.1)";
    }

    // If entry is not mapped, add hover effect.
    if (!entry.isMappedCurrent && !entry.isMappedOther) {
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
