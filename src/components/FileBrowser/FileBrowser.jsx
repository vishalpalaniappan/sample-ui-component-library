import {
    forwardRef,
    useReducer,
    useMemo,
    useCallback,
    useContext,
    useImperativeHandle,
    useEffect,
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
export const FileBrowser = forwardRef(({onSelectFile}, ref) => {
    const [state, dispatch] = useReducer(fileBrowserReducer, initialState);

    const addFileTree = useCallback((tree) => {
        dispatch({ type: "ADD_FILE_TREE", payload: tree });
    }, []);

    useEffect(() => {
        if (state.selectedNode && state.selectedNode.type === "file") {
            onSelectFile(state.selectedNode);
        }
    }, [state.selectedNode]);

    const selectNode = useCallback((node) => {
        dispatch({ type: "SELECT_NODE", payload: node });
    }, []);

    const api = useMemo(() => {
        return {
            state,
            addFileTree,
            selectNode
        };
    }, [state, addFileTree, selectNode]);

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
