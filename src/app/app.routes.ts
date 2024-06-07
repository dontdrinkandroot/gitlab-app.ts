import {Routes} from '@angular/router';
import {IndexComponent} from "./component/index/index.component";
import {GroupListComponent} from "./component/instance/group/group.list.component";
import {ProjectListComponent} from "./component/instance/project/project.list.component";
import {ProjectComponent} from "./component/instance/project/project.component";
import {projectResolver} from "./resolver/project-resolver";
import {ProjectDetailComponent} from "./component/instance/project/project.detail.component";
import {PipelineListComponent} from "./component/instance/project/pipeline/pipeline.list.component";
import {PipelineDetailComponent} from "./component/instance/project/pipeline/pipeline.detail.component";
import {IssueListComponent} from "./component/instance/project/issue/issue.list.component";
import {IssueDetailComponent} from "./component/instance/project/issue/issue.detail.component";
import {JobDetailComponent} from "./component/instance/project/job/job.detail.component";
import {GroupDetailComponent} from "./component/instance/group/group.detail.component";
import {NotFoundComponent} from "./component/not-found/not-found.component";

export const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
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
                                    },
                                    {
                                        path: ':issueId',
                                        component: IssueDetailComponent,
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
