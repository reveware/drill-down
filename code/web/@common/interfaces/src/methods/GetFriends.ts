import { UserOverview } from "src/types";

export namespace GetFriends {
    export interface Request {
        username: string;
        page_number?: number;
        page_size?: number;
    }

    export interface Response {
        data: UserOverview[] | null,
        page: number;
        total: number;
    }
}