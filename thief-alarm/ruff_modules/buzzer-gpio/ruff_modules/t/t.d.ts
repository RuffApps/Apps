declare namespace T {
    interface Scope {
        timeout: number;
        describe(description: string, handler: ScopeHandler): void;
        it(description: string, handler: GeneralHandler): void;
        before(handler: GeneralHandler): void;
        beforeEach(handler: GeneralHandler): void;
        after(handler: GeneralHandler): void;
        afterEach(handler: GeneralHandler): void;
    }

    type DoneCallback = (error?: any) => void;
    type ScopeHandler = (scope: Scope) => void;
    type GeneralHandler = (done?: DoneCallback) => Promise<void> | void;
}

declare function describe(description: string, handler: T.ScopeHandler): void;
declare function it(description: string, handler: T.GeneralHandler): void;
declare function before(handler: T.GeneralHandler): void;
declare function beforeEach(handler: T.GeneralHandler): void;
declare function after(handler: T.GeneralHandler): void;
declare function afterEach(handler: T.GeneralHandler): void;
