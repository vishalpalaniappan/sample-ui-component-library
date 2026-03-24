import { setDefaultCollapsed, collapseTree, flattenTree } from "./helper";

export const initialState = {
    uid: crypto.randomUUID(),
    tree: {},
    flattenedTree: [],
    selectedNode: null,
    collapsedTree: [],
};

export const fileBrowserReducer = (state, action) => {
    switch (action.type) {
        case "ADD_FILE_TREE": {
            let flattenedTree = setDefaultCollapsed(flattenTree(action.payload));
            const collapsedTree = collapseTree(flattenedTree);
            return {
                ...state,
                tree: action.payload,
                flattenedTree: flattenedTree,
                collapsedTree: collapsedTree,
            };
        }

        case "SELECT_NODE": {
            const tree = state.flattenedTree.map((n) => {
                if (n.uid === action.payload.uid) {
                    return {
                        ...n,
                        selected: true,
                        collapsed: !n.collapsed,
                    };
                }
                return {
                    ...n,
                    selected: false,
                };
            });
            return {
                ...state,
                flattenedTree: tree,
                collapsedTree: collapseTree(tree),
                selectedNode: action.payload,
            };
        }

        case "RESET_STATE": {
            return initialState;
        }
    }
};
