export interface Post {
    type: string,
    creator: string,
    isClassified: boolean,
    isStarred: boolean,
    tags: string[],
    format: 'image'
    message?: string,
}
