import {Component, OnDestroy} from '@angular/core';
import {ApiService} from "../api/api.service";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {AsyncPipe} from "@angular/common";
import {SidenavToggleComponent} from "../sidenav/sidenav-toggle.component";
import {RouterLink} from "@angular/router";
import {Subscription} from "rxjs";
import {MatTreeModule, MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {InstanceConfig} from "../instance/instance-config";
import {GroupTreeNode} from "./group-tree-node";
import {Group} from "./group";
import {InstanceContext} from "../instance/instance-context.service";

@Component({
    standalone: true,
    imports: [MatToolbarModule, MatCardModule, MatListModule, AsyncPipe, SidenavToggleComponent, RouterLink, MatTreeModule, MatIconModule, MatButtonModule],
    templateUrl: './group.list.component.html',
    styleUrls: ['./group.list.component.scss']
})
export class GroupListComponent implements OnDestroy {

    public instance: InstanceConfig;

    public treeControl = new NestedTreeControl<GroupTreeNode>(node => node.children);

    public dataSource = new MatTreeNestedDataSource<GroupTreeNode>();

    private dataSubscription: Subscription;

    constructor(
        private readonly apiService: ApiService,
        private readonly instanceContext: InstanceContext
    ) {
        this.dataSubscription = this.apiService.groups.list().subscribe({
            next: groups => this.dataSource.data = this.buildGroupTree(groups)
        })
        this.instance = this.instanceContext.fetchInstance()!;
    }

    /**
     * @overview
     */
    public ngOnDestroy() {
        this.dataSubscription.unsubscribe();
    }

    private buildGroupTree(groups: Group[]): GroupTreeNode[] {
        const groupMap = new Map<number, GroupTreeNode>();
        const rootNodes: GroupTreeNode[] = [];

        groups.forEach(group => {
            groupMap.set(group.id, {group, children: []});
        });

        groups.forEach(group => {
            const node = groupMap.get(group.id)!;
            if (group.parent_id === null) {
                rootNodes.push(node);
            } else {
                const parent = groupMap.get(group.parent_id!)!;
                parent.children.push(node);
            }
        });

        return rootNodes;
    }

    public hasChild = (_: number, node: GroupTreeNode) => !!node.children && node.children.length > 0;
}
