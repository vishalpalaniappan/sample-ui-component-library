import EDITOR_MODES from "./EDITOR_MODES";

export const initialState = {
    uid: crypto.randomUUID(),
    tabs: [],
    activeTab: null,
    mode: EDITOR_MODES.DESIGN,
    parentTabGroupId: null
};

export const editorReducer = (state, action) => {
    switch (action.type) {

        case "ADD_TAB": {
            const { tab, index } = action.payload;

            const tabInfo = state.tabs.find(obj => obj.uid === tab.uid);
            if (tabInfo) {
                console.warn(`Tab with id ${tabInfo.uid} already exists`);
                return {
                    ...state,
                    activeTab: tabInfo
                };
            }
            
            // Insert tab at specific location if it was provided.
            let tabs =  [...state.tabs];
            if (index !== undefined && index < state.tabs.length) {
                tabs.splice(index, 0, tab);
            } else {
                tabs.push(tab);
            }

            return {
                ...state,
                tabs: tabs,
                activeTab: tab
            };
        }

        case "SET_PARENT_TAB_GROUP_ID": {
            return {
                ...state,
                parentTabGroupId: action.payload
            };
        }

        case "SELECT_TAB": {
            const tab = state.tabs.find(obj => obj.uid === action.payload);
            if (!tab) {
                console.error(`Tab with id ${action.payload} not found.`);
                return state;
            }
            return {
                ...state,
                activeTab: tab
            };
        }

        case "CLOSE_TAB": {
            const ind = state.tabs.findIndex(obj => obj.uid === action.payload);
            if (ind === -1) {
                console.warn(`Tab with id ${action.payload} not found.`);
                return state;
            }
            const newTabs = [...state.tabs];
            newTabs.splice(ind, 1);

            // If active tab is closed, select the next tab if it exists, otherwise select the previous tab.
            let activeTab = state.activeTab;
            const isActiveTabClosed = state.activeTab && state.activeTab.uid === action.payload;
            if (isActiveTabClosed && ind < newTabs.length) {
                activeTab = newTabs[Math.max(0, ind)];
            } else if (isActiveTabClosed && ind >= newTabs.length) {
                activeTab = newTabs.length > 0 ? newTabs[newTabs.length - 1] : null;
            }

            return {
                ...state,
                tabs: newTabs,
                activeTab: activeTab
            };
        }

        case "MOVE_TAB": {
            const prevTabs = [...state.tabs];
            const { tabId, newIndex } = action.payload;
            const oldIndex = prevTabs.findIndex(t => t.uid === tabId);
            if (oldIndex === -1) {
                console.warn(`Tab with id ${tabId} not found.`);
                return state;
            }
            if (newIndex - 1 === oldIndex || newIndex === oldIndex) return state;

            // Remove the tab from its old position and insert it into the new position.
            const [tabToMove] = prevTabs.splice(oldIndex, 1);
            const adjustedNewIndex = (oldIndex < newIndex) ? newIndex - 1 : newIndex;
            prevTabs.splice(adjustedNewIndex, 0, tabToMove);

            return {
                ...state,
                tabs: prevTabs
            };
        }

        case "SET_MAPPING": {
            const { mapping, fileName } = action.payload;
            console.log(state);
            for (let i = 0; i < state.tabs.length; i++) {
                const tab = state.tabs[i];
                if (tab.name === fileName) {
                    const updatedTab = { ...tab, mapping: mapping };
                    const newTabs = [...state.tabs];
                    newTabs[i] = updatedTab;
                    return {
                        ...state,
                        tabs: newTabs,
                        activeTab: updatedTab
                    };
                }
            }
            return state;
        }

        case "SET_MODE": {
            return {
                ...state,
                mode: action.payload
            };
        }

        case "RESET_STATE": {
            return initialState;
        }

        default: {
            return state;
        }
    }
}