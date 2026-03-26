import { Flow } from "./Flow";
import { ReactFlowProvider } from "@xyflow/react";
import { useEffect, useState } from "react";
import { designToReactFlowElements } from "./helper";

export const BehavioralGraphBuilder = ({
    activeTool,
    onBehaviorSelect,
    onAddBehavior,
    onAddEdge,
    design,
}) => {
    const [initialElements, setInitialElements] = useState(null);

    useEffect(() => {
        if (design) {
            setInitialElements(designToReactFlowElements(design));
        }
    }, [design]);

    return (
        <ReactFlowProvider>
            <Flow
                initialElements={initialElements}
                activeTool={activeTool}
                onBehaviorSelect={onBehaviorSelect}
                onAddBehavior={onAddBehavior}
                onAddEdge={onAddEdge}
            />
        </ReactFlowProvider>
    );
};
