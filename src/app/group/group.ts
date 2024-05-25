export interface Group {
    id: number,
    name: string,
    path: string,
    description: string,
    visibility: string,
    parent_id?: number,
    avatar_url?: string
}
