export const initialState = {
    tree: {},
    flattenedTree: {},
    collapsedTree: {},
};

export const fileBrowserReducer = (state, action) => {

    switch (action.type) {

        case "ADD_FILE_TREE": {
            return {
                ...state
            }
        }

        case "SELECT_NODE": {
            return {
                ...state
            }
        }

        case "COLLAPSE_TREE": {
            return {
                ...state
            }
        }
    }
}