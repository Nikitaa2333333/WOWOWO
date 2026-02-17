declare module 'fuse.js' {
    export interface FuseOptions<T> {
        keys?: Array<string | { name: string; weight?: number }>;
        threshold?: number;
        includeScore?: boolean;
        minMatchCharLength?: number;
        shouldSort?: boolean;
        findAllMatches?: boolean;
        location?: number;
        distance?: number;
        ignoreLocation?: boolean;
    }

    export interface FuseResult<T> {
        item: T;
        score?: number;
        refIndex?: number;
    }

    export default class Fuse<T> {
        constructor(list: ReadonlyArray<T>, options?: FuseOptions<T>);
        search(pattern: string): FuseResult<T>[];
        setCollection(docs: ReadonlyArray<T>): void;
    }
}
