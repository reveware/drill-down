import { Populated, User } from "@drill-down/interfaces";

export interface UserState {
    user: Populated<User> | undefined;
    error: Error | null;
}

export enum UserActions {
    UPDATE_USER = 'UPDATE_USER',
}

interface Login {
    type: typeof UserActions.UPDATE_USER;
    payload: Populated<User> | undefined;
}

export type UserActionTypes = Login;
