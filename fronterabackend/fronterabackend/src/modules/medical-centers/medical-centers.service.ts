import { Injectable } from "@nestjs/common";
import {
  medicalCenterDTO,
  medicalRoomsDTO,
  updateMedicalCenterDTO,
  updateMedicalRoomsDTO,
} from "src/dto/medical-center/add-center";
import {
  MedicalCalender,
  MedicalCenterListingFilter,
} from "src/dto/medical-center/calender-details";
import { QueryService } from "src/shared/services/query/query.service";
import { getManager } from "typeorm";
import * as XLSX from 'xlsx';

@Injectable()
export class MedicalCentersService {
  constructor(private _db: QueryService) { }

  async addMedicalCenter(medicalCenterInfo: medicalCenterDTO, req) {
    let medicalCenterCheck = await this._db.selectSingle(
      "call sp_mc_get_medical_center_by_name(?)",
      [medicalCenterInfo.name],
      true
    );
    if (medicalCenterCheck && medicalCenterCheck.id) {
      return "Medical center with this name already exists";
    }
    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        let center = await transactionalEntityManager.query(
          "call sp_mc_add_medical_center(?)",
          [
            [
              medicalCenterInfo.name,
              medicalCenterInfo.regionID,
              medicalCenterInfo.address,
              medicalCenterInfo.poc,
              medicalCenterInfo.contact,
              medicalCenterInfo.email,
              null,
            ],
          ]
        );

        if (center[0] && center[0][0] && center[0][0].id) {
          for (let i = 0; i < medicalCenterInfo.rooms.length; i++) {
            let room: medicalRoomsDTO = medicalCenterInfo.rooms[i];
            let checkIfRoomExists = await transactionalEntityManager.query('SELECT * FROM `medical-center-rooms` WHERE medicalCenterID=? AND roomTypeID=? AND LOWER(name)=?',[
              center[0][0].id,room.specializationID,room.name.toLowerCase()
            ])
            if(checkIfRoomExists && checkIfRoomExists.length==0){
              await transactionalEntityManager.query(
                "call sp_mc_add_medical_rooms(?)",
                [[center[0][0].id, null, room.name, room.specializationID]]
              );
            }
           
          }
          return {
            message: "Successfully added medical centers and associated rooms.",
          };
        }
        return "";
      }
    );
    return result;
  }

  async updateMedicalCenter(
    medicalCenterInfo: updateMedicalCenterDTO,
    req,
    centerID
  ) {
    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        let center = await transactionalEntityManager.query(
          "call sp_mc_add_medical_center(?)",
          [
            [
              medicalCenterInfo.name,
              medicalCenterInfo.regionID,
              medicalCenterInfo.address,
              medicalCenterInfo.poc,
              medicalCenterInfo.contact,
              medicalCenterInfo.email,
              centerID,
            ],
          ]
        );
        if (centerID) {
          for (let i = 0; i < medicalCenterInfo.rooms.length; i++) {
            let room: updateMedicalRoomsDTO = medicalCenterInfo.rooms[i];
            if (room.isDeleted) {
              await transactionalEntityManager.query(
                "delete FROM appointments where roomID=?",
                [room.id]
              );
              await transactionalEntityManager.query(
                "delete FROM `medical-center-rooms` where id=?",
                [room.id]
              );
              await transactionalEntityManager.query(
                "update users set preferredRoomID=null where preferredRoomID=?",
                [room.id]
              );
            } else {
              let checkIfRoomExists = await transactionalEntityManager.query('SELECT * FROM `medical-center-rooms` WHERE medicalCenterID=? AND roomTypeID=? AND LOWER(name)=? AND id!=?',[
                centerID,room.specializationID,room.name.toLowerCase(),room.id
              ])
              if(checkIfRoomExists && checkIfRoomExists.length==0){
                await await transactionalEntityManager.query(
                  "call sp_mc_add_medical_rooms(?)",
                  [[centerID, room.id, room.name, room.specializationID]]
                );
              }
              
            }
          }
          return {
            message:
              "Successfully updated medical centers and associated rooms.",
          };
        }
        return "";
      }
    );
    return result;
  }

  async deleteMedicalCenters(centerID, req) {
    if (req.user.role == "ADMIN") {
      let result = await getManager().transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.query(
            "delete from appointments where medicalCenterID=?",
            [centerID]
          );
          await transactionalEntityManager.query(
            "delete from `medical-center-rooms` where medicalCenterID=?",
            [centerID]
          );
          await transactionalEntityManager.query(
            "delete from `medical-centers` where id=?",
            [centerID]
          );
          await transactionalEntityManager.query(
            "update users set associatedMedicalID=null where associatedMedicalID=?",
            [centerID]
          );
          return true;
        }
      );
      if (result)
        return {
          message:
            "Successfully deleted all the medical centers and its associated rooms and appointments",
        };
    } else {
      return "Access denied";
    }
  }

  async getMedicalCenterListing(req, params: MedicalCenterListingFilter) {
    let listing = await this._db.select(
      "call sp_mc_get_listing(?)",
      [[params.region, params.page, params.limit]],
      true
    );
    let listingCount = await this._db.select(
      "call sp_mc_get_listing_count(?)",
      [[params.region]],
      true
    );
    return { listing, listingCount };
  }

  async getMedicalCenterInfo(centerID, req) {
    return await this._db.select(
      "call sp_mc_get_center_info(?)",
      [centerID],
      true
    );
  }

  async getMedicalCenterCalender(centerID, req, param: MedicalCalender) {
    console.log("params: ", param.month);
    return  await this._db.select(
      "call sp_mc_get_center_calender(?)",
      [[centerID, param.month]],
      true
    );
  }

  async getMedicalCenterMonthListing(centerID, req, param: MedicalCalender) {
    return await this._db.select(
      "call sp_mc_get_center_calender_list(?)",
      [[centerID, param.month]],
      true
    );
  }

  async getRegions(req) {
    return await this._db.select("SELECT * FROM region", []);
  }

  async getAllRegions(req) {
    return await this._db.select("SELECT * FROM region;", []);
  }

  async importCsvData(buffer){
    let medicalCenterList = this.parseSheetFromBuffer(buffer,0);
    let roomsList = this.parseSheetFromBuffer(buffer,1);
    let counts ={medicalCenter:0,rooms:0}
    if(medicalCenterList){
      for(let i=0;i<medicalCenterList.length;i++){
        let center = medicalCenterList[i];
        await getManager().transaction(
          async (transactionalEntityManager) => {
            let medicalCenter = await transactionalEntityManager.query('SELECT * FROM `medical-centers` where LOWER(name)=?',[center["Center Name"].toLowerCase()]);
            if(!(medicalCenter && medicalCenter.length)){ 
              let regionID = await transactionalEntityManager.query('SELECT * FROM region where LOWER(name)=?',[center["Region".toLowerCase()]]);
              if(!(regionID && regionID.length)){
                await transactionalEntityManager.query('INSERT INTO region(name) VALUES(?)',[center["Region"]]);
                regionID = await transactionalEntityManager.query('SELECT * FROM region where LOWER(name)=?',[center["Region"].toLowerCase()]);
              }
              regionID=regionID[0]
              await transactionalEntityManager.query('call sp_mc_add_medical_center(?);',[[
                center["Center Name"],
                regionID.id,
                center["Address"],
                center["POC"],
                center["Contact"],
                center["Email"],
                null
              ]])
              counts.medicalCenter=counts.medicalCenter+1;
            }
          }
        ) 
      }
      for(let i=0;i<roomsList.length;i++){
        let room = roomsList[i];
        await getManager().transaction(
          async (transactionalEntityManager) => {
            let medicalCenter = await transactionalEntityManager.query('SELECT * FROM `medical-centers` where LOWER(name)=?',[room["Center Name"].toLowerCase()]);
            if(medicalCenter && medicalCenter[0] && medicalCenter[0].id){
              medicalCenter=medicalCenter[0];
              let roomInfo = await transactionalEntityManager.query('SELECT * FROM `medical-center-rooms` where LOWER(name)=? AND medicalCenterID=?',[room["Room Name"].toLowerCase(),medicalCenter.id]);
              if(medicalCenter && (roomInfo.length==0)){
                let roomTypeInfo = await transactionalEntityManager.query('SELECT * FROM  `room-types` where LOWER(name)=?',[room["Specialization"]]);
                if(roomTypeInfo.length==0){
                  await transactionalEntityManager.query('INSERT INTO `room-types`(name) VALUES(?)',[room["Specialization"]]);
                  roomTypeInfo = await transactionalEntityManager.query('SELECT * FROM  `room-types` where LOWER(name)=?',[room["Specialization"]]);
                }
                roomTypeInfo=roomTypeInfo[0]
                await transactionalEntityManager.query('call sp_mc_add_medical_rooms(?)',[[
                  medicalCenter.id,
                  null,
                  room["Room Name"],
                  roomTypeInfo.id
                ]])
                counts.rooms=counts.rooms+1;
              }
            }
            
          }
        );
      }
      return {message: `Successfully added ${counts.medicalCenter} MC, and ${counts.rooms} Rooms`};
    }
    else{
      return null;
    }
  }

  parseSheetFromBuffer(buffer: Buffer, sheetNumber: number): any[] | null {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    if (sheetNumber < 0 || sheetNumber > workbook.SheetNames.length) {
      console.error('Sheet number is out of bounds');
      return null;
    }
    const sheetName = workbook.SheetNames[sheetNumber];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    return json;
  }
}
