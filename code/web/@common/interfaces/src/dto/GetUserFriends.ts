import { UserOverview } from "src/types";

export namespace GetUserFriends {
    export interface Request {
        username: string;
        page_number?: number;
        page_size?: number;
    }

    export interface Response {
        data: UserOverview[],
        page: number;
        total: number;
    }
}