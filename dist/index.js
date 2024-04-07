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
import Reconciler from 'react-reconciler';
import { Paragraph } from './components/paragraph.js';
import { YJoin } from './components/yjoin.js';
import { XJoin } from './components/xjoin.js';
import { TextNode } from './abstract/textnode.js';
import { DefaultEventPriority, } from 'react-reconciler/constants.js';
const elements = {
    para: Paragraph,
    yjoin: YJoin,
    xjoin: XJoin,
};
let lastImmediate = null;
const MiniRenderer = Reconciler({
    supportsMutation: true,
    supportsHydration: false,
    createInstance(type, props) {
        const InstanceConstructor = elements[type];
        let { children } = props, attributes = __rest(props, ["children"]);
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
        if (lastImmediate != null)
            clearImmediate(lastImmediate);
        lastImmediate = setImmediate(() => {
            instance.minitel().renderToStream();
            lastImmediate = null;
        });
    },
    clearContainer(container) {
        if (container.children[0])
            container.removeChild(container.children[0]);
    },
    finalizeInitialChildren: () => true,
    commitMount(instance) {
        if (lastImmediate != null)
            clearImmediate(lastImmediate);
        lastImmediate = setImmediate(() => {
            instance.minitel().renderToStream();
            lastImmediate = null;
        });
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
export const render = (reactElement, rootEl, callback) => {
    // Create a root Container if it doesnt exist
    if (!rootEl._rootContainer) {
        rootEl._rootContainer = MiniRenderer.createContainer(rootEl, 0, null, true, null, '', () => { }, null);
    }
    // update the root Container
    return MiniRenderer.updateContainer(reactElement, rootEl._rootContainer, null, callback);
};
export { Minitel } from './components/minitel.js';
