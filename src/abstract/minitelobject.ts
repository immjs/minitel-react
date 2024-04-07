import type { Minitel } from '../components/minitel.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';

export class MinitelObject {
    children: MinitelObject[];
    attributes: Partial<MinitelObjectAttributes>;
    parent?: MinitelObject;
    static defaultAttributes: MinitelObjectAttributes = {
        width: null,
        height: null,
        fillChar: ' ',
        widthAlign: 'start',
        heightAlign: 'start',
        wrap: 'clip',
    };
    constructor(children: MinitelObject[] = [], attributes: Partial<MinitelObjectAttributes> = {}) {
        this.children = [];
        for (let child of children) {
            this.appendChild(child);
        }
        this.attributes = attributes;
    }
    appendChild(child: MinitelObject) {
        child.parent = this;
        this.children.push(child);
    }
    insertBeforeChild(child: MinitelObject, beforeChild: MinitelObject) {
        child.parent = this;
        const index = this.children.indexOf(beforeChild);
        this.children.splice(index, 0, child);
    }
    removeChild(child: MinitelObject) {
        child.parent = undefined;
        const index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }
    minitel(): Minitel {
        if (!this.parent) throw new Error('Could not retrieve Minitel (root node)');
        return this.parent.minitel();
    }

    render(inheritedAttributes: Partial<MinitelObjectAttributes>, forcedAttributes?: Partial<MinitelObjectAttributes>) {
        return new RichCharGrid();
    }
}
