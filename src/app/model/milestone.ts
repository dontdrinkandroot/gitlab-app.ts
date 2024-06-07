export interface Milestone {
    due_date?: string;
    project_id: number;
    state: string;
    description: string;
    iid: number;
    id: number;
    title: string;
    created_at: string;
    updated_at: string;
    closed_at?: string;
}
