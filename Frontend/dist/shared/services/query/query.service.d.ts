export declare class QueryService {
    selectSingle<T>(query: any, data?: any[], isSp?: boolean): Promise<any>;
    select(query: any, data?: any[], isSp?: boolean): Promise<any>;
    insertUpdatDelete(query: any, data: any, isSp?: boolean): Promise<any>;
}
