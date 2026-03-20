import {
    forwardRef,
    useEffect,
    useReducer,
    useState,
    useRef,
    useLayoutEffect,
    useMemo,
    useCallback,
    useImperativeHandle
} from "react";
import "./FileBrowser.scss";

import { Tree } from "./Tree/Tree";

import { FileBrowserContext } from "./FileBrowserContext";

import { fileBrowserReducer, initialState } from "./FileBrowserReducer";

import {
    setDefaultCollapsed,
    collapseTree,
    selectNode,
    flattenTree,
} from "./helper";

/**
 * Renders a file browser.
 *
 * @return {JSX}
 */
export const FileBrowser = forwardRef(({ }, ref) => {
    const [state, dispatch] = useReducer(fileBrowserReducer, initialState);

    const addFileTree = useCallback((tree) => {
        console.log("Adding file tree");
        dispatch({ type: "ADD_FILE_TREE", payload: tree });
    }, []);

    const api = useMemo(() => {
        return {
            state,
            addFileTree,
        };
    }, [state, addFileTree]);

    useImperativeHandle(ref, () => api, [api]);

    return (
        <FileBrowserContext.Provider value={api}>
            <div className="file-browser">
                <Tree />
            </div>
        </FileBrowserContext.Provider>
    );
});
