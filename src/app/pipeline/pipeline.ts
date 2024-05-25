export interface Pipeline {
    id: number,
    iid: number,
    project_id: number,
    status: string,
    source: string,
    ref: string,
    sha: string,
    name: string,
    web_url: string,
    created_at: string,
    updated_at: string
}
