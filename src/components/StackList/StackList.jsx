import "./StackList.scss";
import PropTypes from 'prop-types';

const ROW_STYLE =  {
    SELECTED: "#184b2d",
    EXCEPTION: "#420b0e",
    SELECTED_TOP: "#4b4b18"
}

/**
 * Renders a row in the stack list component.
 * 
 * @param {Number} index 
 * @param {String} functionName 
 * @param {String} fileName 
 * @param {Number} lineNumber 
 * @param {Boolean} selected 
 * @param {Function} selectTraceItem 
 * @param {Boolean} hasException 
 * @return {JSX}
 */
const StackRow = ({index, functionName, fileName, lineNumber, selected, selectTraceItem, hasException}) => {

    let style = {};
    if (selected && index === 0) {
        // Style for top of stack
        style = {backgroundColor: hasException ? ROW_STYLE.EXCEPTION : ROW_STYLE.SELECTED_TOP};
    } else if (selected) {
        // Style for rest of stack
        style = {backgroundColor: hasException ? ROW_STYLE.EXCEPTION : ROW_STYLE.SELECTED};
    }

    return (
        <div className="stackRow" style={style} onClick={(e) => selectTraceItem(index)}>
            <div className="left">
                <span className="functionName">{functionName}</span>
            </div>
            <div className="right">
                <span className="fileName">{fileName}</span>
                <span className="lineNumber">{lineNumber}:1</span>
            </div>
        </div>
    )
}

StackRow.propTypes = {
    index: PropTypes.number,
    functionName: PropTypes.string,
    fileName: PropTypes.string,
    lineNumber: PropTypes.number,
    selected: PropTypes.bool,
    onSelectStackPos: PropTypes.func,
    hasException: PropTypes.bool,
}

/**
 * Renders the stack list component.
 * 
 * @param {Array} traces 
 * @param {Function} selectTraceItem 
 * @return {JSX}
 */
export const StackList = ({traces, selectTraceItem}) => {

    const generateStackList = () => {
        const traceList = traces.map((trace, index) => {
            return <StackRow 
                key={`${trace.fileName}-${trace.lineNumber}-${trace.functionName}`}
                functionName={trace.functionName}
                fileName={trace.fileName}
                lineNumber={trace.lineNumber}     
                selected={trace.selected}  
                hasException={trace.hasException}
                index={index}    
                selectTraceItem={selectTraceItem}
            />
        }
        );
        return traceList;
    }
    
    return (
        <div className="stackContainer">
            {generateStackList()}
        </div>
    );
}

StackList.propTypes = {
    traces: PropTypes.array,
    selectTraceItem: PropTypes.func,
}