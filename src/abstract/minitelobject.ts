import { EventEmitter } from 'node:events';
import type { Minitel } from '../components/minitel.js';
import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { MinitelObjectAttributes } from '../types.js';
import { inheritedProps, padding } from '../utils.js';
import { Focusable } from './focusable.js';
import { LocationDescriptor } from '../locationdescriptor.js';

export class MinitelObject<T extends MinitelObjectAttributes = MinitelObjectAttributes, U extends Record<string, any[]> = Record<string, any[]>> extends EventEmitter<U> {
    children: MinitelObject[];
    attributes: Partial<T>;
    parent?: MinitelObject;
    minitel: Minitel;
    keepElmDesc: boolean = false;
    static defaultAttributes: MinitelObjectAttributes = {
        width: null,
        height: null,
        fillChar: ' ',
        textAlign: 'start',
        wrap: 'clip',
        flexGrow: 0,
        pad: 0,
    };
    defaultAttributes: T = MinitelObject.defaultAttributes as T;
    constructor(children: MinitelObject[], attributes: Partial<T>, minitel: Minitel) {
        super();
        this.children = [];
        this.minitel = minitel;
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

    render(attributes: T, inheritMe: Partial<T>): RichCharGrid {
        throw new Error('MinitelObject has no render');
    }
    renderWrapper(inheritedAttributes: Partial<T>, forcedAttributes?: Partial<T>): RichCharGrid {
        const attributes: T = {
            ...this.defaultAttributes,
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        };
        const pad = padding.normalise(attributes.pad);
        attributes.width = attributes.width != null ? padding.exludeX(attributes.width, pad) : null;
        attributes.height = attributes.height != null ? padding.exludeY(attributes.height, pad) : null;

        const result = this.render(attributes, inheritedProps({
            ...inheritedAttributes,
            ...this.attributes,
            ...forcedAttributes,
        }));

        // Descriptor before pad, is this the right choice?
        if (this.keepElmDesc) result.locationDescriptors.add(this, new LocationDescriptor(0, 0, result.width, result.height));

        result.pad(pad, new RichChar(attributes.fillChar, attributes).noSize());

        return result;
    }
    focusables(): Focusable[] {
        const isFocusable = (v: MinitelObject): v is Focusable => 'disabled' in v;
        return this.children.flatMap((v) => {
            const focusables = [];
            if (isFocusable(v) && !v.disabled) focusables.push(v);
            focusables.push(...v.focusables());
            return focusables;
        });
    }

    unmount() {}
    unmountWrapper() {
        this.children.forEach((v) => v.unmountWrapper());
        this.unmount();
    }

    has(child: MinitelObject): boolean {
        return this.children.includes(child) || this.children.some((v) => v.has(child));
    }
}
