import { User } from "@drill-down/interfaces";

export interface UserState {
    user: User | null;
    error: Error | null;
}

export enum UserActions {
    UPDATE_USER = 'UPDATE_USER',
}

interface Login {
    type: typeof UserActions.UPDATE_USER;
    payload: User | null;
}

export type UserActionTypes = Login;
