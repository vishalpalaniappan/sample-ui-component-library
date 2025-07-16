import "./Tab.scss";
import PropTypes from 'prop-types';

import { X } from "react-bootstrap-icons";

const tabColors = {
    active: "#1e1e1e",
    disabled: "#2d2d2d"
}

/**
 * Renders the tab component.
 * 
 * The tab component displays the file name and an option 
 * to close a tab. It also sets the style for the active tab.
 * 
 * @return {JSX}
 */
export const Tab = ({file, activeTab, selectTab, closeTab}) => {

    const getTabStyle = () => {
        return {
            backgroundColor: (activeTab == file.key)?tabColors.active:tabColors.disabled
        };
    }

    return (
        <div onClick={(e) => selectTab(e, file)} className="tab" style={getTabStyle()}>
            <div className="fileName">
                {file.fileName}
            </div>
            <div className="close" onClick={(e) => {
                e.stopPropagation();
                closeTab(e, file);
            }}>
                <X style={{color:"white"}}/>
            </div>
        </div>
    );
}

Tab.propTypes = {
    file: PropTypes.shape({
        key: PropTypes.string.isRequired,
        fileName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
        path: PropTypes.string
    }).isRequired,
    isActive: PropTypes.string.isRequired,
    selectTab: PropTypes.func.isRequired,
    closeTab: PropTypes.func.isRequired
}