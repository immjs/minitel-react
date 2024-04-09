import type { MinitelObject } from './abstract/minitelobject.js';
export declare class LocationDescriptor {
    y: number;
    x: number;
    w: number;
    h: number;
    constructor(y: number, x: number, w: number, h: number);
    applyDelta(dy: number, dx: number): void;
    copy(): LocationDescriptor;
    cut(h: number, w: number): void;
}
export declare class LocationDescriptors {
    locs: Map<MinitelObject, LocationDescriptor>;
    lookupAt: LocationDescriptors[];
    constructor(...extended: LocationDescriptors[]);
    applyDelta(dy: number, dx: number): void;
    cut(h: number, w: number): void;
    has(key: MinitelObject): boolean;
    get(key: MinitelObject): LocationDescriptor | undefined;
    add(key: MinitelObject, loc: LocationDescriptor): void;
    merge(locDescs: LocationDescriptors): void;
    get isEmpty(): boolean;
}
