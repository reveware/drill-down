import { UiState, UiActionTypes, UiActions, Toast } from '../types/ui.store.types';

const initialState: UiState = {
    toast: null,
};

export const uiReducer = (state = initialState, action: UiActionTypes): UiState => {

    switch (action.type) {
        case UiActions.SHOW_TOAST: {
            const toast = action.payload as Toast;
            state = { toast };
            break;
        }
    }

    return state;
};
