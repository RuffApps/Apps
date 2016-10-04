export interface PromiseLike<T> {
    then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): PromiseLike<TResult>;
    then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): PromiseLike<TResult>;
}
export declare type Resolvable<T> = PromiseLike<T> | T;
export declare type Resolver<T> = (resolve: (value?: Resolvable<T>) => void, reject: (reason: any) => void) => void;
export declare type OnFulfilledHandler<T, TResult> = (value: T) => Resolvable<TResult>;
export declare type OnRejectedHandler<TResult> = (reason: any) => Resolvable<TResult>;
export declare let options: {
    disableUnrelayedRejectionWarning: boolean;
    logger: {
        log: (message?: any, ...optionalParams: any[]) => void;
        warn: (message?: any, ...optionalParams: any[]) => void;
        error: (message?: any, ...optionalParams: any[]) => void;
    };
};
export declare class Promise<T> implements PromiseLike<T> {
    private _state;
    private _handled;
    private _valueOrReason;
    private _chainedPromise;
    private _chainedPromises;
    private _handledPromise;
    private _handledPromises;
    private _onPreviousFulfilled;
    private _onPreviousRejected;
    constructor(resolver: Resolver<T>);
    private _grab(previousState, previousValueOrReason?);
    private _run(handler, previousValueOrReason);
    private _unpack(value, callback);
    private _relay(state, valueOrReason?);
    private _relax();
    private _resolve(resolvable?);
    private _reject(reason);
    then<TResult>(onfulfilled: OnFulfilledHandler<T, TResult>, onrejected?: OnRejectedHandler<TResult>): Promise<TResult>;
    catch(onrejected: OnRejectedHandler<T>): Promise<T>;
    catch(ReasonType: Function, onrejected: OnRejectedHandler<T>): Promise<T>;
    static resolve(): Promise<void>;
    static resolve<T>(resolvable: Resolvable<T>): Promise<T>;
    static reject(reason: any): Promise<void>;
    static reject<T>(reason: any): Promise<T>;
    static all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>, Resolvable<T6>, Resolvable<T7>, Resolvable<T8>, Resolvable<T9>, Resolvable<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
    static all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>, Resolvable<T6>, Resolvable<T7>, Resolvable<T8>, Resolvable<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    static all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>, Resolvable<T6>, Resolvable<T7>, Resolvable<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    static all<T1, T2, T3, T4, T5, T6, T7>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>, Resolvable<T6>, Resolvable<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
    static all<T1, T2, T3, T4, T5, T6>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>, Resolvable<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
    static all<T1, T2, T3, T4, T5>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>]): Promise<[T1, T2, T3, T4, T5]>;
    static all<T1, T2, T3, T4>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>]): Promise<[T1, T2, T3, T4]>;
    static all<T1, T2, T3>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>]): Promise<[T1, T2, T3]>;
    static all<T1, T2>(values: [Resolvable<T1>, Resolvable<T2>]): Promise<[T1, T2]>;
    static all<T1>(values: [Resolvable<T1>]): Promise<[T1]>;
    static all<T>(resolvables: Resolvable<T>[]): Promise<T[]>;
    static race<TResult>(resolvables: Resolvable<TResult>[]): Promise<TResult>;
}
export default Promise;
