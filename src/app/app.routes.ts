import {Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {GroupDetailComponent} from "./group/group.detail.component";
import {ProjectDetailComponent} from "./project/project.detail.component";
import {IndexComponent} from "./index/index.component";
import {TypographyComponent} from "./typography/typography.component";
import {PipelineListComponent} from "./pipeline/pipeline.list.component";
import {ProjectComponent} from "./project/project.component";
import {projectResolver} from "./project/project-resolver.service";
import {PipelineDetailComponent} from "./pipeline/pipeline.detail.component";
import {GroupListComponent} from "./group/group.list.component";
import {ProjectListCacheResolver, ProjectListComponent} from "./project/project.list.component";
import {JobDetailComponent} from "./job/job.detail.component";
import {
    IssueListComponent,
    ProjectIssueListClosedCacheResolver,
    ProjectIssueListOpenCacheResolver
} from "./issue/issue.list.component";
import {IssueDetailComponent, ProjectIssueCacheResolver} from "./issue/issue.detail.component";

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: IndexComponent,
    },
    {
        path: 'typography',
        component: TypographyComponent,
    },
    {
        path: ':host',
        children: [
            {
                path: '',
                redirectTo: 'projects',
                pathMatch: 'full'
            },
            {
                path: 'groups',
                component: GroupListComponent
            },
            {
                path: 'projects',
                children: [
                    {
                        path: '',
                        component: ProjectListComponent,
                        resolve: {
                            cachedProjects: ProjectListCacheResolver,
                        }
                    },
                    {
                        path: ':projectId',
                        component: ProjectComponent,
                        resolve: {
                            project: projectResolver
                        },
                        children: [
                            {
                                path: '',
                                component: ProjectDetailComponent,
                            },
                            {
                                path: 'pipelines',
                                children: [
                                    {
                                        path: '',
                                        component: PipelineListComponent,
                                    },
                                    {
                                        path: ':pipelineId',
                                        component: PipelineDetailComponent,
                                    }
                                ]
                            },
                            {
                                path: 'issues',
                                children: [
                                    {
                                        path: '',
                                        component: IssueListComponent,
                                        resolve: {
                                            issuesOpen: ProjectIssueListOpenCacheResolver,
                                            issuesClosed: ProjectIssueListClosedCacheResolver,
                                        }
                                    },
                                    {
                                        path: ':issueId',
                                        component: IssueDetailComponent,
                                        resolve: {
                                            issue: ProjectIssueCacheResolver
                                        }
                                    }
                                ]
                            },
                            {
                                path: 'jobs',
                                children: [
                                    {
                                        path: ':jobId',
                                        component: JobDetailComponent
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                path: 'groups',
                children: [
                    {
                        path: ':id',
                        component: GroupDetailComponent,
                    }
                ]
            }
        ]
    },
    {path: '**', component: NotFoundComponent}
];
