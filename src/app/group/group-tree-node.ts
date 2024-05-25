import {Group} from "./group";

export interface GroupTreeNode {
    group: Group,
    children: GroupTreeNode[]
}
