import type { MinitelObject } from './abstract/minitelobject.js';
export declare class LocationDescriptor {
    y: number;
    x: number;
    constructor(y: number, x: number);
    applyDelta(dy: number, dx: number): void;
    copy(): LocationDescriptor;
}
export declare class LocationDescriptors {
    locs: Map<MinitelObject, LocationDescriptor>;
    lookupAt: LocationDescriptors[];
    constructor(...extended: LocationDescriptors[]);
    applyDelta(dy: number, dx: number): void;
    has(key: MinitelObject): boolean;
    get(key: MinitelObject): LocationDescriptor | undefined;
    add(key: MinitelObject, loc?: LocationDescriptor): void;
    merge(locDescs: LocationDescriptors): void;
    get isEmpty(): boolean;
}
