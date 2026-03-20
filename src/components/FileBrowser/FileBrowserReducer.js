export const initialState = {
    tree: {},
    flattenedTree: {},
    collapsedTree: {},
};

export const fileBrowserReducer = (state, action) => {

    switch (action.type) {

        case "ADD_FILE_TREE": {
            return {
                ...state,
                tree: tree,
                flattenedTree: flattenedTree,
                collapsedTree: collapsedTree
            }
        }

        case "SELECT_NODE": {
            return {
                ...state,
                collapsedTree: collapsedTree
            }
        }

        case "COLLAPSE_TREE": {
            return {
                ...state,
                collapsedTree: collapsedTree
            }
        }
    }
}