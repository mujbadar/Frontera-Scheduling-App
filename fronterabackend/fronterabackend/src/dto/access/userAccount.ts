export class userAccountDTO{

    search: string

    constructor(obj){
        this.search=(obj && obj?.search) ? obj.search:'';
    }

}