/**
 * Sets the default collapsed state to false.
 */
export const setDefaultCollapsed = (tree) => {
    tree.forEach((node) => {
        node.collapsed = false;
    });
}

/**
 * Draws the tree given the nodes and the collapsed state of each node.
 */
export const collapseTree = (tree) => {
    const rows = [];

    let collapsing, collapseLevel;
    for (let i = 0; i < tree.length; i++) {

        if (collapsing) {
            if (tree[i].level <= collapseLevel) {
                collapsing = false;
            } else {
                continue;
            }
        }

        if (tree[i].collapsed) {
            collapsing = true;
            collapseLevel = tree[i].level;
        }

        rows.push(tree[i]);
    }
    return rows;
}

/**
 * Selects the given node and deselects all other nodes in the tree.
 */
export const selectNode = (tree, node) => {
    tree.forEach((n) => {
        n.selected = false;
    });
    node.selected = true;
    node.collapsed = !node.collapsed;
}