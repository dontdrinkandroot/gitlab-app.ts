import {Namespace} from "./namespace";

export interface Project {
    id: number,
    name: string,
    name_with_namespace: string,
    description: string,
    path: string,
    path_with_namespace: string,
    avatar_url?: string,
    namespace: Namespace,
    created_at: string,
    last_activity_at: string,
    jobs_enabled: boolean,
    wiki_enabled: boolean,
    issues_enabled: boolean,
}
