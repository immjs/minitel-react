import { EventEmitter } from 'node:events';
import { RichChar } from '../richchar.js';
import { inheritedProps, padding } from '../utils.js';
import { LocationDescriptor } from '../locationdescriptor.js';
export class MinitelObject extends EventEmitter {
    constructor(children, attributes, minitel) {
        super();
        this.keepElmDesc = false;
        this.defaultAttributes = MinitelObject.defaultAttributes;
        this.children = [];
        this.minitel = minitel;
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
    render(attributes, inheritMe) {
        throw new Error('MinitelObject has no render');
    }
    renderWrapper(inheritedAttributes, forcedAttributes) {
        const attributes = Object.assign(Object.assign(Object.assign(Object.assign({}, this.defaultAttributes), inheritedAttributes), this.attributes), forcedAttributes);
        const pad = padding.normalise(attributes.pad);
        attributes.width = attributes.width != null ? padding.exludeX(attributes.width, pad) : null;
        attributes.height = attributes.height != null ? padding.exludeY(attributes.height, pad) : null;
        const result = this.render(attributes, inheritedProps(Object.assign(Object.assign(Object.assign({}, inheritedAttributes), this.attributes), forcedAttributes)));
        // Descriptor before pad, is this the right choice?
        if (this.keepElmDesc)
            result.locationDescriptors.add(this, new LocationDescriptor(0, 0, result.width, result.height));
        result.pad(pad, new RichChar(attributes.fillChar, attributes).noSize());
        return result;
    }
    focusables() {
        const isFocusable = (v) => 'disabled' in v;
        return this.children.flatMap((v) => {
            const focusables = [];
            if (isFocusable(v) && !v.disabled)
                focusables.push(v);
            focusables.push(...v.focusables());
            return focusables;
        });
    }
    unmount() { }
    unmountWrapper() {
        this.children.forEach((v) => v.unmountWrapper());
        this.unmount();
    }
    has(child) {
        return this.children.includes(child) || this.children.some((v) => v.has(child));
    }
}
MinitelObject.defaultAttributes = {
    width: null,
    height: null,
    fillChar: ' ',
    textAlign: 'start',
    wrap: 'clip',
    flexGrow: 0,
    pad: 0,
};
