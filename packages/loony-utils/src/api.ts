import { DocNode } from "loony-types";

export const getUrl = (node: DocNode, mainNode: DocNode, url: string) => {
    if (node.uid === mainNode.uid) {
        return url + "/main"
    }
    return url + "/node"
}