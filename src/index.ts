import Reconciler from 'react-reconciler';
import { Paragraph } from './components/paragraph.js';
import { YJoin } from './components/yjoin.js';
import { XJoin } from './components/xjoin.js';
import { MinitelObjectAttributes } from './types.js';
import { Minitel } from './components/minitel.js';
import { MinitelObject } from './abstract/minitelobject.js';
import { TextNode } from './abstract/textnode.js';

import {
    DiscreteEventPriority,
    ContinuousEventPriority,
    DefaultEventPriority,
} from 'react-reconciler/constants.js';

const elements = {
    para: Paragraph,
    yjoin: YJoin,
    xjoin: XJoin,
};

let lastImmediate: NodeJS.Immediate | null = null;

const MiniRenderer = Reconciler<
    keyof typeof elements,
    MinitelObjectAttributes & { children: MinitelObject },
    Minitel,
    MinitelObject,
    TextNode,
    MinitelObject,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown,
    unknown
>({
    supportsMutation: true,
    supportsHydration: false,
    createInstance(type, props) {
        const InstanceConstructor = elements[type];
        let { children, ...attributes } = props;
        // if (children != null && !Array.isArray(children)) children = [children];

        const instance = new InstanceConstructor([], attributes);

        return instance;
    },
    createTextInstance(text) {
        return new TextNode(text);
    },
    appendInitialChild(parentInstance, child) {
        parentInstance.appendChild(child);
    },
    appendChild(parentInstance, child) {
        const newChild = typeof child === 'string' ? new TextNode(child) : child;
        parentInstance.appendChild(newChild);
    },
    appendChildToContainer(container, child) {
        const newChild = typeof child === 'string' ? new TextNode(child) : child;
        container.appendChild(newChild);
    },
    insertBefore(parentInstance, child, beforeChild) {
        const newChild = typeof child === 'string' ? new TextNode(child) : child;
        parentInstance.insertBeforeChild(newChild, beforeChild);
    },
    removeChild(parentInstance, child) {
        parentInstance.removeChild(child);
    },
    commitTextUpdate(textInstance, prevText, nextText) {
        textInstance.text = nextText;
    },
    prepareUpdate() {
        return {};
    },
    commitUpdate(instance) {
        // its so dirty i love it haha
        if (lastImmediate != null) clearImmediate(lastImmediate);
        lastImmediate = setImmediate(() => {
            instance.minitel().renderToStream();
            lastImmediate = null;
        });
    },
    clearContainer(container) {
        if (container.children[0]) container.removeChild(container.children[0]);
    },
    finalizeInitialChildren: () => true,
    commitMount(instance) {
        if (lastImmediate != null) clearImmediate(lastImmediate);
        lastImmediate = setImmediate(() => {
            instance.minitel().renderToStream();
            lastImmediate = null;
        });
    },
    shouldSetTextContent: () => false,
    getRootHostContext: () => null,
    resetAfterCommit: () => {},
    getChildHostContext: (parentHostContext) => parentHostContext,
    getPublicInstance: (instance) => instance,
    prepareForCommit: (containerInfo) => null, // TODO: Store focus and whatnot
    scheduleTimeout: setTimeout,
    cancelTimeout: clearTimeout,
    scheduleMicrotask: queueMicrotask,
    noTimeout: -1,
    supportsMicrotasks: true,
    supportsPersistence: false,
    getCurrentEventPriority() {
        return DefaultEventPriority;
    },
    isPrimaryRenderer: true,

    // for typescript
    preparePortalMount() {},
    beforeActiveInstanceBlur() {},
    afterActiveInstanceBlur() {},
    prepareScopeUpdate() {},
    getInstanceFromNode(node) {
        return undefined;
    },
    getInstanceFromScope(scopeInstance) {
        return null;
    },
    detachDeletedInstance(node) {}
});

export const render = (reactElement: React.ReactNode, rootEl: Minitel, callback?: (() => {})) => {
    // Create a root Container if it doesnt exist
    if (!rootEl._rootContainer) {
        rootEl._rootContainer = MiniRenderer.createContainer(rootEl, 0, null, true, null, '', () => {}, null);
    }

    // update the root Container
    return MiniRenderer.updateContainer(reactElement, rootEl._rootContainer, null, callback);
};

export { Minitel } from './components/minitel.js';
