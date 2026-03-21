/**
 * Sets the default collapsed state to false.
 */
export const setDefaultCollapsed = (tree) => {
    tree.forEach((node) => {
        node.collapsed = false;
    });
    return tree;
}


/**
 * Given a file tree, it flattens the tree into a list of nodes with the level of each node in the tree.
 * 
 * @param {Array} tree - The file tree to flatten.
 * @param {number} level - The current level of the tree (used for indentation).
 * @return {Array} - The flattened tree with level information.
 */
export const flattenTree = (tree, level) => {
    if (!level) {
        level = 0;
    }
    let rows = [];
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        node.level = level;
        rows.push(node);
        if (node?.children) {
            rows = rows.concat(flattenTree(node.children, level + 1));
        }
    }
    return rows;
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