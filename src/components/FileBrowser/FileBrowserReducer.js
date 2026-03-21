import {
    setDefaultCollapsed,
    collapseTree,
    flattenTree,
} from "./helper";

export const initialState = {
    tree: {},
    flattenedTree: {},
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
                collapsedTree: collapsedTree
            }
        }

        case "SELECT_NODE": {
            const tree = [...state.flattenedTree];
            let selectedNode;
            tree.forEach((n) => {
                if (n.uid === action.payload) {
                    selectedNode = n;
                    n.selected = true;
                    n.collapsed = !n.collapsed;
                } else {
                    n.selected = false;
                }
            });
            const collapsedTree = collapseTree(tree);
            return {
                ...state,
                flattenedTree: tree,
                collapsedTree: collapsedTree,
                selectedNode: selectedNode
            }
        }
    }
}