import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { SingletonArray } from '../singleton.js';
import { Align, MinitelObjectAttributes } from '../types.js';
import { alignInvrt, inheritedProps } from '../utils.js';
import type { Minitel } from './minitel.js';

export class Container extends MinitelObject<ContainerAttributes> {
    static defaultAttributes: ContainerAttributes = {
        ...MinitelObject.defaultAttributes,
        widthAlign: 'start',
        heightAlign: 'start',
    };
    defaultAttributes = Container.defaultAttributes;
    constructor(children = [], attributes: Partial<ContainerAttributes>, minitel: Minitel) {
        if (children.length > 1) throw new Error('Container must only include one element');
        super([], attributes, minitel);
        this.children = new SingletonArray<MinitelObject>();
        if (children[0]) this.appendChild(children[0]);
    }
    render(attributes: ContainerAttributes, inheritMe: Partial<ContainerAttributes>) {
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();

        const render = this.children[0].renderWrapper(inheritMe, {
            ...(attributes.width != null ? { width: attributes.width } : {}),
            ...(attributes.height != null ? { height: attributes.height } : {}),
        });

        if (attributes.width) render.setWidth(attributes.width, alignInvrt[attributes.widthAlign], fillChar);
        if (attributes.height) render.setHeight(attributes.height, alignInvrt[attributes.heightAlign], fillChar);

        // console.log({ width: attributes.width, height: attributes.height, render: render.toString() })

        return render;
    }
}

export interface ContainerAttributes extends MinitelObjectAttributes {
    widthAlign: Align;
    heightAlign: Align;
}
