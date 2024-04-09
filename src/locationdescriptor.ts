import type{ MinitelObject } from './abstract/minitelobject.js';

export class LocationDescriptor {
    y: number;
    x: number;
    constructor(y: number, x: number) {
        this.y = y;
        this.x = x;
    }
    applyDelta(dy: number, dx: number) {
        this.y += dy;
        this.x += dx;
    }
    copy() {
        return new LocationDescriptor(this.y, this.x);
    }
}

export class LocationDescriptors {
    locs: Map<MinitelObject, LocationDescriptor>;
    lookupAt: LocationDescriptors[];
    constructor(...extended: LocationDescriptors[]) {
        this.locs = new Map();
        this.lookupAt = extended;
    }

    applyDelta(dy: number, dx: number) {
        this.locs.forEach((v) => v.applyDelta(dy, dx));
        this.lookupAt.forEach((v) => v.applyDelta(dy, dx));
    }

    has(key: MinitelObject): boolean {
        return this.locs.has(key) || this.lookupAt.some((v) => v.has(key));
    }

    get(key: MinitelObject): LocationDescriptor | undefined {
        if (this.locs.has(key)) return this.locs.get(key);

        return this.lookupAt.find((v) => v.has(key))?.get(key);
    }

    add(key: MinitelObject, loc: LocationDescriptor = new LocationDescriptor(0, 0)) {
        this.locs.set(key, loc);
    }

    merge(locDescs: LocationDescriptors) {
        if (!locDescs.isEmpty) this.lookupAt.push(locDescs);
    }

    get isEmpty(): boolean {
        if (this.locs.size === 0 && this.lookupAt.length === 0) return true;
        if (this.locs.size !== 0) return false;

        return this.lookupAt.every((v) => v.isEmpty);
    }
}
