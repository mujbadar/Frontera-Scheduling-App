import { QueryService } from './../../shared/services/query/query.service';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as libre from 'libreoffice-convert';
import { promisify } from 'util';
import { getConnection, getManager } from 'typeorm';
import * as createCsvWriter from 'csv-writer';
import * as moment from 'moment';
import { DashboardCalenderDetailFilter, DashboardCalenderExport, MedicalCalender } from 'src/dto/medical-center/calender-details';

const convertAsync = promisify(libre.convert);
@Injectable()
export class DashboardService {

    constructor(private _db:QueryService){}


    async prepareFileFoler(ext){
        const mediaFolderPath = path.join(__dirname, '..', '..','..','src','csvFiles');
        if (!fs.existsSync(mediaFolderPath)) {
        fs.mkdirSync(mediaFolderPath, { recursive: true });
        }
        const fileName = `${uuidv4()}${ext}`;
        const filePath = path.join(mediaFolderPath, fileName);
        return filePath;
    }

    async generateCSV(res){
        const data= await this._db.select("call sp_get_customer_info_for_csv()",[],true)
        
        data.forEach(element => {
            element.trial==1 ? element.trial='true' : element.trial='false'
            element.startDate = moment(element.startDate).format('MMM DD,YYYY').toString()
            element.endDate = moment(element.endDate).format('MMM DD,YYYY').toString()
            element.daysLeft = (element.endDate && element.startDate ) ? Math.round(Math.max(moment(element.endDate,'MMM DD,YYYY').endOf('day').diff(moment(new Date(),'MMM DD,YYYY'),'days',true), 0))
             : 0;
            element.daysLeft = element.daysLeft.toString();
        });
          
        const filePath = await this.prepareFileFoler('.csv');
        const csvWriter = createCsvWriter.createObjectCsvWriter({
            path: filePath,
            header: [
              'Company Name',
              'Company Email',
              'User',
              'PCID',
              'App',
              'Trial',
              'Start Date',
              'End Date',
              'Days Left',
            ],
          });
        
        const formattedData = data.map((item) => ({
            'Company Name': item.companyName || '',
            'Company Email': item.companyEmail || '',
            'User': item.user || '',
            'PCID': item.PCID || '',
            'App': item.app || '',
            'Trial': item.trial || '',
            'Start Date': item.startDate || '',
            'End Date': item.endDate || '',
            'Days Left': item.daysLeft || '',
          }));
        formattedData.unshift({
            'Company Name': 'Company Name',
            'Company Email': 'Company Email',
            'User': 'User',
            'PCID': 'PCID',
            'App':  'App',
            'Trial':  'Trial',
            'Start Date':  'Start Date',
            'End Date': 'End Date',
            'Days Left': 'Days Left',
          });
        const currentDate = moment(new Date()).format('MMM DD,YYYY').toString();
        formattedData.unshift({
            'Company Name': 'Current Date',
            'Company Email': currentDate,
            'User': '',
            'PCID': '',
            'App':  '',
            'Trial':  '',
            'Start Date':  '',
            'End Date': '',
            'Days Left': '',
        });
          
        
        formattedData.splice(1, 0, {
            'Company Name': '',
            'Company Email': '',
            'User': '',
            'PCID': '',
            'App':  '',
            'Trial':  '',
            'Start Date':  '',
            'End Date': '',
            'Days Left': '',
        });
        
        await csvWriter.writeRecords(formattedData);
        
        res.download(filePath, 'exported_data.csv', async (err) => {
            if (err) {
              console.error('Error sending the file:', err);
            }
        
            const unlink = promisify(fs.unlink);
            await unlink(filePath);
        });
    }

    async calenderStats(req,params:MedicalCalender){
      return await this._db.select(
        "call sp_dash_get_calender_stats(?)",
        [[ 
          req.user.role=="ADMIN",
          params.month,
          req.user.id
        ]],
        true
      );
    }

    async calenderDetailList(req,params:DashboardCalenderDetailFilter){
      return await this._db.select(
        "call sp_dash_get_calender_detail_list(?)",
        [[ 
          req.user.role=="ADMIN",
          params.month,
          req.user.id,
          params.region
        ]],
        true
      );
    }

    async exportCalenderData(req,params:DashboardCalenderExport){
      return await this._db.select(
        "call sp_dash_get_export_calender_data(?)",
        [[ 
          req.user.role=="ADMIN",
          req.user.id,
          params.month
        ]],
        true
      );
    }

}
