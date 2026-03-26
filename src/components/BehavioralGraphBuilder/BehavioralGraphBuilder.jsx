import {Flow} from "./Flow";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState } from "react";
import { designToReactFlowElements } from "./helper";

export const BehavioralGraphBuilder = ({ activeTool, onBehaviorSelect, design }) => {

    const [initialElements, setInitialElements] = useState(null); 

    useEffect(() => {
        if (design) {
            console.log("Design loaded in BehavioralGraphBuilder");
            setInitialElements(designToReactFlowElements(design));
        }
    }, [design]);

    return (
        <ReactFlowProvider>
            <Flow initialElements={initialElements} activeTool={activeTool} onBehaviorSelect={onBehaviorSelect} />
        </ReactFlowProvider>
    );
};
