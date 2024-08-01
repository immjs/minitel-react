var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { jsx as _jsx } from "react/jsx-runtime";
import Reconciler from 'react-reconciler';
import { createContext, useContext, useEffect } from 'react';
import { DefaultEventPriority, } from 'react-reconciler/constants.js';
import { Container, Input, Minitel, Paragraph, Scrollable, Span, TextNode, XJoin, YJoin, ZJoin } from 'minitel-standalone';
import { Image } from 'minitel-mosaic';
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
    image: Image,
};
let lastImmediate = null;
const MiniRenderer = Reconciler({
    supportsMutation: true,
    supportsHydration: false,
    createInstance(type, props, rootContainer) {
        const InstanceConstructor = elements[type];
        let { children } = props, attributes = __rest(props, ["children"]);
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
        const { children: newChildren } = newContent, newProps = __rest(newContent, ["children"]);
        instance.attributes = newProps;
        instance.minitel.queueImmediateRenderToStream();
    },
    clearContainer(container) {
        if (container.children[0])
            container.removeChild(container.children[0]);
    },
    finalizeInitialChildren: () => true,
    commitMount(instance) {
        instance.minitel.queueImmediateRenderToStream();
    },
    shouldSetTextContent: () => false,
    getRootHostContext: () => null,
    resetAfterCommit: () => { },
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
    preparePortalMount() { },
    beforeActiveInstanceBlur() { },
    afterActiveInstanceBlur() { },
    prepareScopeUpdate() { },
    getInstanceFromNode(node) {
        return undefined;
    },
    getInstanceFromScope(scopeInstance) {
        return null;
    },
    detachDeletedInstance(node) { }
});
const minitelContext = createContext(undefined);
export const render = (reactElement, rootEl, callback) => {
    // Create a root Container if it doesnt exist
    if (!rootEl._rootContainer) {
        rootEl._rootContainer = MiniRenderer.createContainer(rootEl, 0, null, true, null, '', () => { }, null);
    }
    const contextProvider = _jsx(minitelContext.Provider, { value: rootEl, children: reactElement });
    // update the root Container
    MiniRenderer.updateContainer(contextProvider, rootEl._rootContainer, null, callback);
    const unrender = () => {
        rootEl.unmountWrapper();
        MiniRenderer.updateContainer(null, rootEl._rootContainer, null, callback);
        rootEl.stream = new Duplex();
    };
    rootEl.stream.on('close', unrender);
};
export function useKeyboard(callback, deps) {
    const minitel = useContext(minitelContext);
    useEffect(() => {
        minitel.on('key', callback);
        return () => void minitel.off('key', callback);
    }, deps);
}
export { Minitel, minitelContext };
