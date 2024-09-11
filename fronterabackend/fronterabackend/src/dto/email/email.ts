import { EMAIl_FROM } from "./email.constants";

export class EmailConfiguration{
    templateId:string;    
    subject:string;
    to:string;
    from:string = EMAIl_FROM.NOREPLY;
    dynamic_template_data:any;
    recieverName:string;
    attachments:any;
}
