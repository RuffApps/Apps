export declare type DoneCallback = (error?: any) => void;
export declare type ScopeHandler = (scope: Scope) => void;
export declare type GeneralHandler = (done?: DoneCallback) => Promise<void> | void;
export interface ErrorItem {
    description: string;
    error: any;
}
export interface Stats {
    passed: number;
    failed: number;
}
export declare const enum TestState {
    pending = 0,
    passed = 1,
    failed = 2,
    skipped = 3,
}
export declare const options: {
    timeout: number;
};
export declare class ErrorCollector {
    items: ErrorItem[];
    add(description: string, error: any): number;
    print(): void;
    empty: boolean;
}
export declare abstract class Runnable {
    upper: Runnable;
    depth: number;
    description: string;
    constructor(upper: Runnable);
    abstract run(index: number, runnables: Runnable[]): Promise<void>;
    print(...objects: any[]): void;
    fullDescription: string;
}
export declare class Test extends Runnable {
    handler: GeneralHandler;
    description: string;
    state: TestState;
    depth: number;
    upper: Scope;
    constructor(scope: Scope, handler: GeneralHandler, description: string);
    run(index: number, runnables: (Scope | Test)[]): Promise<void>;
}
export declare class Scope extends Runnable {
    errorCollector: ErrorCollector;
    description: string;
    runnables: (Scope | Test)[];
    timeout: number;
    private _beforeHandler;
    private _beforeEachHandler;
    private _afterHandler;
    private _afterEachHandler;
    constructor(upper: Scope, errorCollector: ErrorCollector, description: string);
    stats: Stats;
    hasTests: boolean;
    run(index: number, runnables: (Scope | Test)[]): Promise<void>;
    describe(description: string, handler: ScopeHandler): void;
    it(description: string, handler: GeneralHandler): void;
    before(handler: GeneralHandler): void;
    beforeEach(handler: GeneralHandler): void;
    after(handler: GeneralHandler): void;
    afterEach(handler: GeneralHandler): void;
}
export declare function describe(description: string, handler: ScopeHandler): void;
export declare function it(description: string, handler: GeneralHandler): void;
export declare function before(handler: GeneralHandler): void;
export declare function beforeEach(handler: GeneralHandler): void;
export declare function after(handler: GeneralHandler): void;
export declare function afterEach(handler: GeneralHandler): void;
export declare function queue(path: string): void;
