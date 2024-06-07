export interface JobPipeline {
    id: number,
    project_id: number,
    ref: string,
    sha: string,
    status: string,
}

export interface Job {
    id: number,
    name: string,
    stage: string,
    status: string,
    duration: number,
    pipeline: JobPipeline,
}
