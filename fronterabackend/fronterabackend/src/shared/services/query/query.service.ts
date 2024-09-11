import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

@Injectable()
export class QueryService {


    async selectSingle<T>(query, data = [], isSp = false) {
        
        const _data = (await getManager().query(query, [...data]))[0];
        if (isSp == true) {
            return _data[0];
        }
        return _data;
    }
    async select(query, data = [], isSp = false) {
        const _data = await getManager().query(query, [...data]);
        if (isSp == true) {
            if(_data.length>2){
                let d= [];
                for (let i = 0; i < _data.length; i++) {
                    const el = _data[i];
                    if(Array.isArray(el)) d.push(el);
                }
                return d;
            }
            return _data[0];
        }
        return _data;
    }
    async insertUpdatDelete(query,data,isSp=false){
        if(query&&data){
            const _data = await getManager().query(query,[...data]);
            return _data;
        }
    }
}
