import { store } from "./store";

export enum StorageKeys {
    AUTH_TOKEN = 'AUTH_TOKEN',
}

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

