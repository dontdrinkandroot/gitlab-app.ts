export interface Issue {
    id: number;
    project_id: number;
    milestone: Milestone;
    author: Author;
    description: string;
    state: string;
    iid: number;
    assignees: Author[];
    assignee: Author;
    type: string;
    labels: string[];
    upvotes: number;
    downvotes: number;
    merge_requests_count: number;
    title: string;
    updated_at: string;
    created_at: string;
    closed_at?: string;
    closed_by?: Author;
    subscribed: boolean;
    user_notes_count: number;
    due_date?: string;
    imported: boolean;
    imported_from: string;
    web_url: string;
    references: {
        short: string;
        relative: string;
        full: string;
    };
    time_stats: {
        time_estimate: number;
        total_time_spent: number;
        human_time_estimate?: string;
        human_total_time_spent?: string;
    };
    confidential: boolean;
    discussion_locked: boolean;
    issue_type: string;
    severity: string;
    task_completion_status: {
        count: number;
        completed_count: number;
    };
    weight?: number;
    has_tasks: boolean;
    _links: {
        self: string;
        notes: string;
        award_emoji: string;
        project: string;
        closed_as_duplicate_of: string;
    };
    moved_to_id?: number;
    service_desk_reply_to: string;
}

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

export interface Author {
    state: string;
    web_url: string;
    avatar_url?: string;
    username: string;
    id: number;
    name: string;
}

export interface IssueNote {
    id: number;
    body: string;
    attachment: any;
    author: Author;
    created_at: string;
    updated_at: string;
    system: boolean;
    noteable_id: number;
    noteable_type: string;
    project_id: number;
    noteable_iid: number;
    resolvable: boolean;
    confidential: boolean;
    internal: boolean;
    imported: boolean;
    imported_from: string;
}
