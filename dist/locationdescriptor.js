export class LocationDescriptor {
    constructor(y, x, w, h) {
        this.y = y;
        this.x = x;
        this.w = w;
        this.h = h;
    }
    applyDelta(dy, dx) {
        this.y += dy;
        this.x += dx;
    }
    copy() {
        return new LocationDescriptor(this.y, this.x, this.w, this.h);
    }
    cut(h, w) {
        this.h = Math.min(h, this.h);
        this.w = Math.min(w, this.w);
    }
}
export class LocationDescriptors {
    constructor(...extended) {
        this.locs = new Map();
        this.lookupAt = extended;
    }
    applyDelta(dy, dx) {
        this.locs.forEach((v) => v.applyDelta(dy, dx));
        this.lookupAt.forEach((v) => v.applyDelta(dy, dx));
    }
    cut(h, w) {
        this.locs.forEach((v) => v.cut(h - v.y, w - v.x));
        this.lookupAt.forEach((v) => v.cut(h, w));
    }
    has(key) {
        return this.locs.has(key) || this.lookupAt.some((v) => v.has(key));
    }
    get(key) {
        var _a;
        if (this.locs.has(key))
            return this.locs.get(key);
        return (_a = this.lookupAt.find((v) => v.has(key))) === null || _a === void 0 ? void 0 : _a.get(key);
    }
    add(key, loc) {
        this.locs.set(key, loc);
    }
    merge(locDescs) {
        if (!locDescs.isEmpty)
            this.lookupAt.push(locDescs);
    }
    get isEmpty() {
        if (this.locs.size === 0 && this.lookupAt.length === 0)
            return true;
        if (this.locs.size !== 0)
            return false;
        return this.lookupAt.every((v) => v.isEmpty);
    }
}
