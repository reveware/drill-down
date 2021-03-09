export interface CustomError extends Error {
        code: number;
        timestamp: string,
        origin: string,
        method: string,
        message: string,
        errors: string[],
}

    