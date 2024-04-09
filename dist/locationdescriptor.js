export class LocationDescriptor {
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }
    applyDelta(dy, dx) {
        this.y += dy;
        this.x += dx;
    }
    copy() {
        return new LocationDescriptor(this.y, this.x);
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
    has(key) {
        return this.locs.has(key) || this.lookupAt.some((v) => v.has(key));
    }
    get(key) {
        var _a;
        if (this.locs.has(key))
            return this.locs.get(key);
        return (_a = this.lookupAt.find((v) => v.has(key))) === null || _a === void 0 ? void 0 : _a.get(key);
    }
    add(key, loc = new LocationDescriptor(0, 0)) {
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
