import {Flow} from "./Flow";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect } from "react";

export const BehavioralGraphBuilder = ({ activeTool, design }) => {

    useEffect(() => {
        if (design) {
            console.log("Design loaded in BehavioralGraphBuilder:", design);
        }
    }, [design]);

    return (
        <ReactFlowProvider>
            <Flow activeTool={activeTool} />
        </ReactFlowProvider>
    );
};
