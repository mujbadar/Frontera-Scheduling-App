export declare class responseData<T> {
    success: boolean;
    message: string;
    exception: any;
    data: T;
    constructor(data: any);
}
