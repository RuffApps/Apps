export declare function stylize(text: string, styleName: string): string;
export declare function indent(text: string, level: number): string;
export declare function delay(timeout: number): Promise<void>;
export declare function delay<T>(timeout: number, value: T): Promise<T>;
