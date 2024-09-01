import Reconciler, { FiberRoot } from 'react-reconciler';
import { DependencyList, RefObject, createContext, useContext, useEffect } from 'react';
import { MinitelObjectAttributes } from 'minitel-standalone/dist/types.js';

import {
    DefaultEventPriority,
} from 'react-reconciler/constants.js';
import { Container, Focusable, FocusableAttributes, Input, InputAttributes, Minitel, Paragraph, Scrollable, ScrollableAttributes, Span, TextNode, XJoin, XJoinAttributes, YJoin, YJoinAttributes, ZJoin, ZJoinAttributes } from 'minitel-standalone';
import { Image, ImageAttributes } from 'minitel-mosaic';
import { MinitelObject } from 'minitel-standalone/dist/abstract/minitelobject.js';
import { Duplex } from 'node:stream';

const elements = {
    para: Paragraph,
    yjoin: YJoin,
    xjoin: XJoin,
    cont: Container,
    zjoin: ZJoin,
    input: Input,
    span: Span,
    scroll: Scrollable,
    focus: Focusable,
    image: Image,
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

    const contextProvider = <minitelContext.Provider value={rootEl}>{reactElement}</minitelContext.Provider>;

    // update the root Container
    MiniRenderer.updateContainer(contextProvider, rootEl._rootContainer, null, callback);

    const unrender = () => {
        rootEl.unmountWrapper();
        MiniRenderer.updateContainer(null, rootEl._rootContainer, null, callback);
        rootEl.stream = new Duplex();
    };

    rootEl.stream.on('close', unrender);
};

export function useKeyboard(callback: (arg0: string) => any, deps?: DependencyList) {
    const minitel = useContext(minitelContext);
    useEffect(() => {
        minitel.on('key', callback);
        return () => void minitel.off('key', callback);
    }, deps);
}

export { Minitel, minitelContext };

// idk im not skilled enough in TS so ill just slide this in here (plz js work)

type MiniProps<T> = Partial<T & { children: React.ReactNode | React.ReactNode[]; key: React.Key; ref: RefObject<MinitelObject> }>;

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            xjoin: MiniProps<XJoinAttributes>;
            yjoin: MiniProps<YJoinAttributes>;
            zjoin: MiniProps<ZJoinAttributes>;
            para: MiniProps<MinitelObjectAttributes>;
            cont: MiniProps<MinitelObjectAttributes>;
            input: MiniProps<InputAttributes>;
            span: MiniProps<MinitelObjectAttributes>;
            scroll: MiniProps<ScrollableAttributes>;
            focus: MiniProps<FocusableAttributes>;
            image: MiniProps<ImageAttributes>;
        }
    }
}

declare module 'minitel-standalone' {
    interface Minitel {
        _rootContainer: FiberRoot;
    }
}
