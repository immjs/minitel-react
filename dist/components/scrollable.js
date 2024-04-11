import { RichChar } from '../richchar.js';
import { RichCharGrid } from '../richchargrid.js';
import { Container } from './container.js';
export class Scrollable extends Container {
    blink() {
        if (this.artificialBlink)
            clearTimeout(this.artificialBlink);
        this.artificialBlink = setTimeout(this.blinkHandler.bind(this), this.attributes.blinkPeriod || Scrollable.defaultAttributes.blinkPeriod);
    }
    blinkHandler() {
        if (this.focused || !this.blinkShown) {
            if (this.focused) {
                this.blinkShown = !this.blinkShown;
            }
            else {
                this.blinkShown = true;
            }
            this.minitel.queueImmediateRenderToStream();
        }
        this.blink();
    }
    constructor(children = [], attributes, minitel) {
        super(children, attributes, minitel);
        this.defaultAttributes = Scrollable.defaultAttributes;
        this.focused = false;
        this.disabled = false;
        this.keepElmDesc = true;
        this.scrollDeltaX = 0;
        this.scrollDeltaY = 0;
        this.artificialBlink = null;
        this.blinkShown = true;
        this.blink();
        this.on('key', this.keyEventListener);
    }
    keyEventListener(str) {
        switch (str) {
            case '\x1b\x5b\x41': // up
                this.scrollDeltaY -= 1;
                this.minitel.queueImmediateRenderToStream();
                break;
            case '\x1b\x5b\x42': // down
                this.scrollDeltaY += 1;
                this.minitel.queueImmediateRenderToStream();
                break;
            case '\x1b\x5b\x43': // right
                this.scrollDeltaX += 1;
                this.minitel.queueImmediateRenderToStream();
                break;
            case '\x1b\x5b\x44': // left
                this.scrollDeltaX -= 1;
                this.minitel.queueImmediateRenderToStream();
                break;
        }
    }
    unmount() {
        this.off('key', this.keyEventListener);
        if (this.artificialBlink)
            clearTimeout(this.artificialBlink);
    }
    render(attributes, inheritMe) {
        // now its 3 am and i don't know how i'll read back
        // this code it's such a mess
        const fillChar = new RichChar(attributes.fillChar, attributes);
        let render;
        let autoedX = false;
        let autoedY = false;
        if (attributes.width == null && attributes.height == null) {
            render = super.render(attributes, inheritMe);
        }
        else if (attributes.overflowY !== 'hidden') {
            if (attributes.height == null) {
                render = super.render(attributes, inheritMe);
            }
            else {
                if (attributes.overflowY === 'auto') {
                    const possibleRender = super.render(Object.assign(Object.assign({}, attributes), { width: attributes.overflowX === 'hidden' ? attributes.width : null, height: null }), inheritMe);
                    if (possibleRender.height <= attributes.height) {
                        render = possibleRender;
                        autoedY = true;
                    }
                }
                if (!autoedY) {
                    const width = attributes.width != null && attributes.overflowX === 'hidden'
                        ? attributes.width - 1
                        : null;
                    render = super.render(Object.assign(Object.assign({}, attributes), { width, height: null }), inheritMe);
                }
            }
        }
        else {
            if (attributes.width == null) {
                render = super.render(attributes, inheritMe);
            }
            else {
                if (attributes.overflowX === 'auto') {
                    const possibleRender = super.render(Object.assign(Object.assign({}, attributes), { height: attributes.height, width: null }), inheritMe);
                    if (possibleRender.width <= attributes.width) {
                        render = possibleRender;
                        autoedX = true;
                    }
                }
                if (!autoedX) {
                    const height = attributes.height != null ? attributes.height - 1 : null;
                    render = super.render(Object.assign(Object.assign({}, attributes), { height, width: null }), inheritMe);
                }
            }
        }
        const finalRender = render; // Source: Trust me bro
        const originalWidth = finalRender.width;
        const originalHeight = finalRender.height;
        const maxScrollSizeX = attributes.overflowY !== 'hidden' && !autoedY && attributes.width != null
            ? attributes.width - 1
            : attributes.width; // Area available for scroll for bottom scroll bar
        const scrollbarSizeX = attributes.width && Math.ceil(maxScrollSizeX * maxScrollSizeX / originalWidth);
        this.scrollDeltaX = Math.min(Math.max(0, this.scrollDeltaX), (originalWidth - maxScrollSizeX) || 0);
        const maxScrollSizeY = attributes.overflowX !== 'hidden' && !autoedX && attributes.height != null
            ? attributes.height - 1
            : attributes.height; // Area available for scroll for right scroll bar\
        const scrollbarSizeY = attributes.height && Math.ceil(maxScrollSizeY * maxScrollSizeY / originalHeight);
        this.scrollDeltaY = Math.min(Math.max(0, this.scrollDeltaY), (originalHeight - maxScrollSizeY) || 0);
        if (attributes.height != null) {
            finalRender.setHeight(Math.min(attributes.height + this.scrollDeltaY, originalHeight), 'start', fillChar);
            finalRender.setHeight(maxScrollSizeY, 'end', fillChar);
        }
        if (attributes.width != null) {
            finalRender.setWidth(Math.min(attributes.width + this.scrollDeltaX, originalWidth), 'start', fillChar);
            finalRender.setWidth(maxScrollSizeX, 'end', fillChar);
        }
        const scrollChar = new RichChar('\x7f', Object.assign(Object.assign({}, attributes), { fg: this.blinkShown ? attributes.scrollbarColor : attributes.scrollbarBackColor }));
        const scrollBackChar = new RichChar('\x7f', Object.assign(Object.assign({}, attributes), { fg: attributes.scrollbarBackColor }));
        if (attributes.overflowY !== 'hidden' && !autoedY && attributes.height != null) {
            const percentageScrolled = this.scrollDeltaY / (originalHeight - maxScrollSizeY);
            const scrollbarOffset = Math.floor((maxScrollSizeY - scrollbarSizeY) * percentageScrolled);
            const rightScrollbar = RichCharGrid.fill(1, scrollbarSizeY, scrollChar);
            rightScrollbar.setHeight(scrollbarSizeY + scrollbarOffset, 'start', scrollBackChar);
            rightScrollbar.setHeight(finalRender.height, 'end', scrollBackChar);
            finalRender.mergeX(rightScrollbar);
        }
        if (attributes.overflowX !== 'hidden' && !autoedX && attributes.width != null) {
            const percentageScrolled = this.scrollDeltaX / (originalWidth - maxScrollSizeX);
            const scrollbarOffset = Math.floor((maxScrollSizeX - scrollbarSizeX) * percentageScrolled);
            const bottomScrollbar = RichCharGrid.fill(scrollbarSizeX, 1, scrollChar);
            bottomScrollbar.setWidth(scrollbarSizeX + scrollbarOffset, 'start', scrollBackChar);
            bottomScrollbar.setWidth(finalRender.height, 'end', scrollBackChar);
            finalRender.mergeY(bottomScrollbar);
        }
        // if (this.focused) this.blink();
        return finalRender;
    }
}
Scrollable.defaultAttributes = Object.assign(Object.assign({}, Container.defaultAttributes), { overflowX: 'hidden', overflowY: 'auto', autofocus: false, scrollbarBackColor: 5, scrollbarColor: 7, blinkPeriod: 500 });
