import Reconciler from 'react-reconciler';
import { createContext, useContext, useEffect } from 'react';
import { MinitelObjectAttributes } from 'minitel-standalone/dist/types.js';

import {
    DefaultEventPriority,
} from 'react-reconciler/constants.js';
import { Container, Input, Minitel, Paragraph, Scrollable, TextNode, XJoin, YJoin, ZJoin } from 'minitel-standalone';
import { MinitelObject } from 'minitel-standalone/dist/abstract/minitelobject.js';

const elements = {
    para: Paragraph,
    yjoin: YJoin,
    xjoin: XJoin,
    cont: Container,
    zjoin: ZJoin,
    input: Input,
    scroll: Scrollable,
};

let lastImmediate: NodeJS.Immediate | null = null;

const MiniRenderer = Reconciler<
    keyof typeof elements,
    MinitelObjectAttributes & { children: MinitelObject[] },
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
    createInstance(type, props, rootContainer) {
        const InstanceConstructor = elements[type];
        let { children, ...attributes } = props;
        // if (children != null && !Array.isArray(children)) children = [children];

        const instance = new InstanceConstructor([], attributes, rootContainer);

        return instance;
    },
    createTextInstance(text, rootContainer) {
        return new TextNode(text, {}, rootContainer);
    },
    appendInitialChild(parentInstance, child) {
        parentInstance.appendChild(child);
    },
    appendChild(parentInstance, child) {
        const newChild = typeof child === 'string' ? new TextNode(child, {}, parentInstance.minitel) : child;
        parentInstance.appendChild(newChild);
    },
    appendChildToContainer(container, child) {
        const newChild = typeof child === 'string' ? new TextNode(child, {}, container.minitel) : child;
        container.appendChild(newChild);
    },
    insertBefore(parentInstance, child, beforeChild) {
        const newChild = typeof child === 'string' ? new TextNode(child, {}, parentInstance.minitel) : child;
        parentInstance.insertBeforeChild(newChild, beforeChild);
    },
    removeChild(parentInstance, child) {
        parentInstance.removeChild(child);
    },
    removeChildFromContainer(container, child) {
        container.removeChild(child);
    },
    commitTextUpdate(textInstance, prevText, nextText) {
        textInstance.text = nextText;
    },
    prepareUpdate() {
        return {};
    },
    commitUpdate(instance, _, __, ___, newContent) {
        const { children: newChildren, ...newProps } = newContent;

        instance.attributes = newProps;
        instance.minitel.queueImmediateRenderToStream();
    },
    clearContainer(container) {
        if (container.children[0]) container.removeChild(container.children[0]);
    },
    finalizeInitialChildren: () => true,
    commitMount(instance) {
        instance.minitel.queueImmediateRenderToStream();
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

const minitelContext = createContext<Minitel>(undefined as unknown as Minitel);

export const render = (reactElement: React.ReactNode, rootEl: Minitel, callback?: (() => {})) => {
    // Create a root Container if it doesnt exist
    if (!rootEl._rootContainer) {
        rootEl._rootContainer = MiniRenderer.createContainer(rootEl, 0, null, true, null, '', () => {}, null);
    }

    const contextProvider = minitelContext.Provider({ children: [reactElement], value: rootEl });

    // update the root Container
    MiniRenderer.updateContainer(contextProvider, rootEl._rootContainer, null, callback);

    return (() => {
        rootEl.unmountWrapper();
        MiniRenderer.updateContainer(null, rootEl._rootContainer, null, callback);
    });
};

export function useKeyboard(callback: (arg0: string) => any) {
    useEffect(() => {
        const minitel = useContext(minitelContext);
        minitel.on('key', callback);
        return () => void minitel.off('key', callback);
    });
}

export { Minitel };
