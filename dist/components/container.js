import { MinitelObject } from '../abstract/minitelobject.js';
import { RichChar } from '../richchar.js';
import { SingletonArray } from '../singleton.js';
import { alignInvrt, inheritedProps } from '../utils.js';
export class Container extends MinitelObject {
    constructor(children = [], attributes) {
        if (children.length > 1)
            throw new Error('Container must only include one element');
        super([], attributes);
        this.children = new SingletonArray();
        if (children[0])
            this.appendChild(children[0]);
    }
    render(inheritedAttributes, forcedAttributes) {
        const attributes = Object.assign(Object.assign(Object.assign(Object.assign({}, Container.defaultAttributes), inheritedAttributes), this.attributes), forcedAttributes);
        const fillChar = new RichChar(attributes.fillChar, attributes).noSize();
        const render = this.children[0].render(inheritedProps(attributes), {});
        if (attributes.width)
            render.setWidth(attributes.width, alignInvrt[attributes.widthAlign], fillChar);
        if (attributes.height)
            render.setHeight(attributes.height, alignInvrt[attributes.heightAlign], fillChar);
        return render;
    }
}
Container.defaultAttributes = Object.assign(Object.assign({}, MinitelObject.defaultAttributes), { widthAlign: 'start', heightAlign: 'start' });
