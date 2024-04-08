import { RichCharGrid } from '../richchargrid.js';
export class MinitelObject {
    constructor(children = [], attributes = {}) {
        this.children = [];
        for (let child of children) {
            this.appendChild(child);
        }
        this.attributes = attributes;
    }
    appendChild(child) {
        child.parent = this;
        this.children.push(child);
    }
    insertBeforeChild(child, beforeChild) {
        child.parent = this;
        const index = this.children.indexOf(beforeChild);
        this.children.splice(index, 0, child);
    }
    removeChild(child) {
        child.parent = undefined;
        const index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }
    minitel() {
        if (!this.parent)
            throw new Error('Could not retrieve Minitel (root node)');
        return this.parent.minitel();
    }
    render(inheritedAttributes, forcedAttributes) {
        return new RichCharGrid();
    }
}
MinitelObject.defaultAttributes = {
    width: null,
    height: null,
    fillChar: ' ',
    textAlign: 'start',
    wrap: 'clip',
    flexGrow: 0,
};
