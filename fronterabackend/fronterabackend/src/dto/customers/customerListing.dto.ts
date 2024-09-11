export class customerListingDTO{
    startDate: string ;
    endDate:string;
    page:number;
    limit: number;
    search: string;
    selectedFilterType: string;

    constructor(obj){
        this.startDate=(obj && obj?.startDate) ? obj.startDate: null;
        this.page=(obj && obj?.page) ? obj.page: 1;
        this.limit=(obj && obj?.limit) ? obj.limit:15;
        this.endDate=(obj && obj?.endDate) ? obj.endDate:null;
        this.search=(obj && obj?.search) ? obj.search:'';
        this.selectedFilterType=(obj && obj?.selectedFilterType) ? obj.selectedFilterType:'';
    }

}