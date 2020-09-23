import {isValidEmailAddress, isValidImageType} from "../../utils";
import moment from "moment";
import {CreateUserDTO} from "../../types/dtos.types";

export type RegisterFormState = {
    user: CreateUserDTO;
    errors: {
        username: string | null;
        avatar: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        password: string | null;
        tagLine: string | null;
        dateOfBirth: string | null;
    };
};

export const initialRegisterFormState = {
    user: {
        avatar: null,
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        tagLine: '',
        dateOfBirth: new Date(),
        role: 'USER',
    },
    errors: {
        username: 'You need a username',
        avatar: 'An avatar photo is required',
        firstName: 'First name cannot be empty',
        lastName: 'Last name cannot be empty',
        email: 'Email cannot be empty',
        password: 'Password cannot be empty',
        tagLine: 'Tag line cannot be empty',
        dateOfBirth: 'You must select your date of birth',
    },
};

export const registerReducer = (state: RegisterFormState, action: { type: string; payload: any }) => {
    switch (action.type) {
        case 'username':
            const username = action.payload;
            if (username === '') {
                return { ...state, errors: { ...state.errors, username: 'Username cannot be empty' } };
            }
            return { user: { ...state.user, username }, errors: { ...state.errors, username: null } };

        case 'avatar':
            const file = action.payload;

            if(!file || !file.type || !isValidImageType(file.type)){
                return {...state, errors: {...state.errors, avatar: 'A valid avatar photo is required'}}
            }
            return { user: { ...state.user, avatar: file }, errors: { ...state.errors, avatar: null } };

        case 'firstName':
            const firstName = action.payload;
            if (firstName === '') {
                return { ...state, errors: { ...state.errors, firstName: 'First name cannot be empty' } };
            }
            return { user: { ...state.user, firstName }, errors: { ...state.errors, firstName: null } };

        case 'lastName':
            const lastName = action.payload;
            if (lastName === '') {
                return { ...state, errors: { ...state.errors, lastName: 'Last name cannot be empty' } };
            }
            return { user: { ...state.user, lastName }, errors: { ...state.errors, lastName: null } };

        case 'email':
            const email = action.payload;
            if (email === '') {
                return { ...state, errors: { ...state.errors, email: 'Email cannot be empty' } };
            }
            if (!isValidEmailAddress(email)) {
                return { ...state, errors: { ...state.errors, email: 'Should be a valid e-mail address' } };
            }

            return { user: { ...state.user, email }, errors: { ...state.errors, email: null } };
        case 'password':
            const password = action.payload;
            if (password === '') {
                return { ...state, errors: { ...state.errors, password: 'Password cannot be empty' } };
            }
            if (password.length < 9) {
                return { ...state, errors: { ...state.errors, password: 'Should be at least 9 characters' } };
            }

            return { user: { ...state.user, password }, errors: { ...state.errors, password: null } };

        case 'dateOfBirth':
            const dateOfBirth = action.payload;
            if (!dateOfBirth) {
                return { ...state, errors: { ...state.errors, dateOfBirth: 'Date of birth is required' } };
            }

            const yearsDiff = moment(moment.now()).diff(dateOfBirth, 'years');

            if(yearsDiff < 30 || yearsDiff > 40 ) {
                return { ...state, errors: { ...state.errors, dateOfBirth: "Only people in their 30's are allowed" } };
            }

            return { user: { ...state.user, dateOfBirth }, errors: { ...state.errors, dateOfBirth: null } };

        case 'tagLine':
            const tagLine = action.payload;
            if (tagLine === '') {
                return { ...state, errors: { ...state.errors, lastName: 'Tag line cannot be empty' } };
            }
            return { user: { ...state.user, tagLine }, errors: { ...state.errors, tagLine: null } };

        default:
            return state;
    }
};