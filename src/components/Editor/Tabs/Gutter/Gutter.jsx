import { useDroppable } from "@dnd-kit/core";

import PropTypes from "prop-types";

import "./Gutter.scss";

const GUTTER_ACTIVE_COLOR = "#FFFFFF";
const GUTTER_INACTIVE_COLOR = "#222425";

export const Gutter = ({ id, index, parentId }) => {

    const dndId = parentId + "-gutter-" + id;
    
    // Droppable area used by dnd kit.
    const { setNodeRef, isOver } = useDroppable({
        dndId,
        data: {
            type: "tab-gutter",
            parentId: parentId,
            index: index,
        },
    });
    
    const style = {
        backgroundColor: isOver ? GUTTER_ACTIVE_COLOR : GUTTER_INACTIVE_COLOR,
    }

    return (
        <div className="gutter" ref={setNodeRef} style={style}></div>
    );
}

Gutter.propTypes = {
    id: PropTypes.number.isRequired,
    parentId: PropTypes.string.isRequired,
}
