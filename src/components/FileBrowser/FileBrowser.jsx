import {
    forwardRef,
    useReducer,
    useMemo,
    useCallback,
    useContext,
    useImperativeHandle,
} from "react";
import "./FileBrowser.scss";

import { Tree } from "./Tree/Tree";
import { TreeNodePreview } from "./TreeNode/TreeNode";

import { FileBrowserContext } from "./FileBrowserContext";

import { fileBrowserReducer, initialState } from "./FileBrowserReducer";

/**
 * Renders a file browser.
 *
 * @return {JSX}
 */
export const FileBrowser = forwardRef(({ }, ref) => {
    const [state, dispatch] = useReducer(fileBrowserReducer, initialState);

    const addFileTree = useCallback((tree) => {
        dispatch({ type: "ADD_FILE_TREE", payload: tree });
    }, []);


    const selectNode = useCallback((node) => {
        dispatch({ type: "SELECT_NODE", payload: node });
    }, []);
    
    const getPreviewElement = useCallback((tabId) => {
        // Get the preview element for a tab by its id for use in drag-and-drop operations.
        const tab = state.flattenedTree.find(t => t.uid === tabId);
        if (!tab) {
            console.error(`getPreviewElement: tab with id ${tabId} not found.`);
            return null;
        }
        return <TreeNodePreview node={tab} />;
    }, [state]);

    const api = useMemo(() => {
        return {
            state,
            addFileTree,
            selectNode,
            getPreviewElement
        };
    }, [state, addFileTree, selectNode, getPreviewElement]);

    useImperativeHandle(ref, () => api, [api]);

    return (
        <FileBrowserContext.Provider value={api}>
            <div className="file-browser">
                <Tree />
            </div>
        </FileBrowserContext.Provider>
    );
});

FileBrowser.displayName = "FileBrowser";

export function useFileBrowser() {
    const ctx = useContext(FileBrowserContext);
    if (!ctx) {
        throw new Error("useFileBrowser must be used inside <FileBrowser>");
    }
    return ctx;
}
