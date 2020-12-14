import { UiState, UiActionTypes, UiActions, Toast } from '../../types';

const initialState: UiState = {
    toast: null,
    postForDetailsModal: null,
};

export const uiReducer = (state = initialState, action: UiActionTypes): UiState => {
    switch (action.type) {
        case UiActions.SET_TOAST: {
            const toast = action.payload as Toast;
            state = { ...state, toast };
            break;
        }

        case UiActions.SET_POST_FOR_DETAILS_MODAL:  {
            const post = action.payload;
            state = {...state, postForDetailsModal: post}
        }
    }

    return state;
};
