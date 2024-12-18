import { Injectable } from "@nestjs/common";
import { addAvailabilityDTO } from "src/dto/requests/addAvailability.dto";
import { addRequestDTO } from "src/dto/requests/addRequest.dto";
import { QueryService } from "src/shared/services/query/query.service";
import { getManager } from "typeorm";
import * as moment from "moment";
import { updateAvailbilityDTO } from "src/dto/requests/updateAvailability.dto";
import { updateAvailbilityEmail } from "src/dto/users/userSIgnUp.dto";
import { EmailService } from "src/shared/services/email/email.service";

@Injectable()
export class RequestsService {
  constructor(private _db: QueryService,
    private emailService:EmailService) {}

  async addRequest(requestInfo: addRequestDTO, req) {
    let checkIfRequestExists: any = this._db.selectSingle(
      "call sp_req_check_if_req_exists(?)",
      [
        [
          requestInfo.medicalCenterID,
          requestInfo.providerID,
          requestInfo.startDate,
          requestInfo.endDate,
          requestInfo.deadline,
          requestInfo.weekendsOff,
        ],
      ],
      true
    );
    if (checkIfRequestExists && checkIfRequestExists.id) {
      return "Request with same parameters already exists!";
    }

    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        let request = await transactionalEntityManager.query(
          "call sp_req_add_request(?)",
          [
            [
              requestInfo.medicalCenterID && requestInfo.medicalCenterID != 0
                ? requestInfo.medicalCenterID
                : null,
              requestInfo.providerID && requestInfo.providerID != 0
                ? requestInfo.providerID
                : null,
              requestInfo.startDate,
              requestInfo.endDate,
              requestInfo.deadline,
              requestInfo.weekendsOff,
            ],
          ]
        );
        if (request[0] && request[0][0] && request[0][0].id) {
          for (let i = 0; i < requestInfo.holidayDates.length; i++) {
            let holiday: string = requestInfo.holidayDates[i];
            await await transactionalEntityManager.query(
              "call sp_req_add_request_holidays(?)",
              [[request[0][0].id, holiday]]
            );
          }

          let listOfEmails = [];
          let medCenterID = requestInfo.medicalCenterID && requestInfo.medicalCenterID != 0
                        ? requestInfo.medicalCenterID
                        : null;
          let proID=requestInfo.providerID && requestInfo.providerID != 0
                        ? requestInfo.providerID
                        : null;
          if(medCenterID && !proID){
            let medCenterProv = await transactionalEntityManager.query('select email, name from users where associatedMedicalID=? AND role="PROVIDER"',[
              medCenterID
            ])
            listOfEmails=[...medCenterProv]
          }
          else if(!medCenterID && !proID){
            let medCenterProv = await transactionalEntityManager.query('select email, name from users where role="PROVIDER";',[])
            listOfEmails=[...medCenterProv]
          }
          else if(!medCenterID && proID){
            let provEmails = await transactionalEntityManager.query('select email, name from users where id=? AND role="PROVIDER"',[
              proID
            ])
            listOfEmails=[...provEmails]
          }
          else if(medCenterID && proID){
            let provEmails = await transactionalEntityManager.query('select email, name from users where id=? AND role="PROVIDER"',[
              proID
            ])
            listOfEmails=[...provEmails]
          }

          for(let i=0;i<listOfEmails.length;i++){
            let data: updateAvailbilityEmail = new updateAvailbilityEmail();
            data.recieverEmail = listOfEmails[i].email;
            data.deadline = requestInfo.deadline;
            data.providerName = listOfEmails[i].name;  // Include provider name
            data.login_url = process.env.DOMAIN_URL;
            await this.emailService.sendUpdateScheduleEmail(data);
            
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

  async showRequests(req) {

    return await this._db.select(
      "call sp_req_show_my_requests(?)",
      [[
        req.user.id,
        req.user.role == "ADMIN" 
      ]],
      true
    );
    
  }

  async getRequestDetails(requestID, req) {
    return await this._db.select(
      "call sp_req_get_single_req_details(?)",
      [requestID],
      true
    );
  }

  // async addAvailability(availbilityInfo: addAvailabilityDTO, req) {
  //   let logAdded:boolean=false;
  //   let result = await getManager().transaction(
  //     async (transactionalEntityManager) => {
  //       let overlappingEntries = {};
  //       let requestInfo = await transactionalEntityManager.query(
  //         "select * from requests where id=?",
  //         [availbilityInfo.requestID]
  //       );

  //       let providerShiftsInfo = await transactionalEntityManager.query(
  //         "select * from `provider-availability` where providerID=?",
  //         [req.user.id]
  //       );

  //       let providerInfo = await transactionalEntityManager.query(
  //         "select * from users where id=?",
  //         [req.user.id]
  //       );

  //       let roomList = await transactionalEntityManager.query(
  //         "select * from `medical-center-rooms` mcr where mcr.medicalCenterID = ? AND mcr.roomTypeID=?",
  //         [
  //           providerInfo[0].associatedMedicalID,
  //           providerInfo[0].specializationID,
  //         ]
  //       );

  //       let extraHolidays = await transactionalEntityManager.query(
  //         "SELECT holidayDate FROM requestholidays where requestID=?",
  //         [availbilityInfo.requestID]
  //       );

  //       if (
  //         availbilityInfo.availability &&
  //         availbilityInfo.availability.length
  //       ) {
  //         for (let i = 0; i < availbilityInfo.availability.length; i++) {
  //           let info = availbilityInfo.availability[i];
  //           let startDate = info.startDate; 
  //           let endDate = info.endDate;
  //           let holidays = extraHolidays.map((x)=>moment(x.holidayDate).format('YYYY-MM-DD'))
  //           let days: string[] = this.getWeekdaysBetween(
  //             startDate, 
  //             endDate,
  //             requestInfo[0].weekendsOff,
  //             holidays 
  //           );
  //           let shiftStart =
  //             providerShiftsInfo[
  //               providerShiftsInfo.findIndex((x) => (x.id == info.shiftID))
  //             ].shiftFrom;
  //           let shiftEnd =
  //             providerShiftsInfo[
  //               providerShiftsInfo.findIndex((x) => (x.id == info.shiftID))
  //             ].shiftTo;
  //           if (days && days.length) {
  //             for (let j = 0; j < days.length; j++) {
  //               let currentDate = days[j];
  //               if (roomList && roomList.length) {
  //                 for (let k = 0; k < roomList.length; k++) {
  //                   let preferredRoomPro = await transactionalEntityManager.query('call sp_req_check_room_if_provider_added_availability(?);',[[
  //                     roomList[k].id,
  //                     currentDate,
  //                     availbilityInfo.requestID,
  //                     req.user.id
  //                   ]])
                    
  //                   if(preferredRoomPro && preferredRoomPro[0] && preferredRoomPro[0][0] && preferredRoomPro[0][0].count > 0){
  //                     let shiftsOnThatDay =
  //                     await transactionalEntityManager.query(
  //                       "call sp_req_get_shift_on_single_day(?,?,?,?)",
  //                       [
  //                         providerInfo[0].associatedMedicalID,
  //                         currentDate,
  //                         providerInfo[0].specializationID,
  //                         roomList[k].id,
  //                       ]
  //                     );
  //                     shiftsOnThatDay = shiftsOnThatDay[0];
  //                     if (
  //                       this.isOverlapping(shiftStart, shiftEnd, shiftsOnThatDay)
  //                     ) {
  //                       overlappingEntries[ 
  //                         currentDate
  //                       ] = `overlapping on ${currentDate} for room ${roomList[k].id}`;
  //                     } else {
  //                       overlappingEntries[currentDate] = null;
  //                       await transactionalEntityManager.query(
  //                         `
  //                                             INSERT INTO appointments
  //                                             (providerID, medicalCenterID, providerShiftID, apointmentDate, roomID,requestID)
  //                                             VALUES(?,?,?,?,?,?);
  //                                             `,
  //                         [
  //                           req.user.id,
  //                           providerInfo[0].associatedMedicalID,
  //                           info.shiftID,
  //                           currentDate,
  //                           roomList[k].id,
  //                           availbilityInfo.requestID,
  //                         ]
  //                       );
  //                       if(!logAdded){
  //                         await transactionalEntityManager.query(
  //                           `INSERT INTO activityLogs(name,activity,userID,requestID, causerID) 
  //                           VALUES(?,?,?,?,?)`,[
  //                             'Added Availability',
  //                             `${req.user.name} have added their availability against request.`,
  //                             req.user.id,
  //                             availbilityInfo.requestID,
  //                             req.user.id
  //                           ]
  //                         )
  //                         logAdded=true;
  //                       }
  //                       k = roomList.length;
  //                     }
  //                   }
  //                   else{
  //                     overlappingEntries[
  //                       currentDate
  //                     ] = `Blocked on ${currentDate} for room ${roomList[k].id}`;
  //                   }

                  
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //       if (
  //         availbilityInfo.customAvailability &&
  //         availbilityInfo.customAvailability.length
  //       ) {
  //         for (let i = 0; i < availbilityInfo.customAvailability.length; i++) {
  //           let info = availbilityInfo.customAvailability[i];
  //           let currentDate = info.date;
  //           let shiftStart =
  //             providerShiftsInfo[
  //               providerShiftsInfo.findIndex((x) => (x.id == info.shiftID))
  //             ].shiftFrom;
  //           let shiftEnd =
  //             providerShiftsInfo[
  //               providerShiftsInfo.findIndex((x) => (x.id == info.shiftID))
  //             ].shiftTo;
  //           if (roomList && roomList.length) {
  //             for (let j = 0; j < roomList.length; j++) {
  //               let preferredRoomPro = await transactionalEntityManager.query('call sp_req_check_room_if_provider_added_availability(?);',[[
  //                 roomList[j].id,
  //                 currentDate,
  //                 availbilityInfo.requestID,
  //                 req.user.id
  //               ]])
  //               if(preferredRoomPro && preferredRoomPro[0] && preferredRoomPro[0][0] && preferredRoomPro[0][0].count > 0){
  //                 let shiftsOnThatDay = await transactionalEntityManager.query(
  //                   "call sp_req_get_shift_single_date_exluding(?,?,?,?,?)",
  //                   [
  //                     providerInfo.associatedMedicalID,
  //                     currentDate,
  //                     providerInfo.specializationID,
  //                     roomList[j].id,
  //                     req.user.id,
  //                   ]
  //                 );
  //                 shiftsOnThatDay = shiftsOnThatDay[0];
  //                 if (this.isOverlapping(shiftStart, shiftEnd, shiftsOnThatDay)) {
  //                   overlappingEntries[
  //                     currentDate
  //                   ] = `overlapping on ${currentDate} for room ${roomList[j].id}`;
  //                 } else {
  //                   overlappingEntries[currentDate] = null;
  //                   await transactionalEntityManager.query(
  //                     `
  //                                     DELETE FROM appointments a WHERE a.providerID=? AND a.medicalCenterID=? AND  a.apointmentDate=? AND a.roomID=?;
  //                                     `,
  //                     [
  //                       req.user.id,
  //                       providerInfo.associatedMedicalID,
  //                       currentDate,
  //                       roomList[j].id,
  //                     ]
  //                   );
  
  //                   await transactionalEntityManager.query(
  //                     `
  //                                     INSERT INTO appointments
  //                                     (providerID, medicalCenterID, providerShiftID, apointmentDate, roomID,requestID)
  //                                     VALUES
  //                                     (?,?,?,?,?,?);
  //                                     `,
  //                     [
  //                       req.user.id,
  //                       providerInfo.associatedMedicalID,
  //                       info.shiftID,
  //                       currentDate,
  //                       roomList[j].id,
  //                       availbilityInfo.requestID,
  //                     ]
  //                   );
  //                   j = roomList.length;
  //                 }
  //               }
  //               else{
  //                 overlappingEntries[
  //                   currentDate
  //                 ] = `Blocked on ${currentDate} for room ${roomList[j].id}`;
  //               }
                
  //             }
  //           }
  //         }
  //       }
  //       overlappingEntries = Object.fromEntries(
  //         Object.entries(overlappingEntries).filter(([key, value]) => value !== null)
  //       );
  //       return {
  //         data: overlappingEntries,
  //         message: "All entries have been added except overlapping ones.",
  //       };
  //     }
  //   );
  //   return result;
  // }
async addAvailability(availbilityInfo: addAvailabilityDTO, req) {
  let logAdded: boolean = false;
  let result = await getManager().transaction(
    async (transactionalEntityManager) => {
      let overlappingEntries = {};
      let requestInfo = await transactionalEntityManager.query(
        "select * from requests where id=?",
        [availbilityInfo.requestID]
      );

      let providerShiftsInfo = await transactionalEntityManager.query(
        "select * from `provider-availability` where providerID=?",
        [req.user.id]
      );

      let providerInfo = await transactionalEntityManager.query(
        "select * from users where id=?",
        [req.user.id]
      );

      let roomList = await transactionalEntityManager.query(
        "select * from `medical-center-rooms` mcr where mcr.medicalCenterID = ? AND mcr.roomTypeID=?",
        [
          providerInfo[0].associatedMedicalID,
          providerInfo[0].specializationID,
        ]
      );

      let extraHolidays = await transactionalEntityManager.query(
        "SELECT holidayDate FROM requestholidays where requestID=?",
        [availbilityInfo.requestID]
      );

      if (availbilityInfo.availability && availbilityInfo.availability.length) {
        for (let i = 0; i < availbilityInfo.availability.length; i++) {
          let info = availbilityInfo.availability[i];
          let startDate = info.startDate; 
          let endDate = info.endDate;
          let holidays = extraHolidays.map((x) => moment(x.holidayDate).format('YYYY-MM-DD'));
          let days: string[] = this.getWeekdaysBetween(
            startDate, 
            endDate,
            requestInfo[0].weekendsOff,
            holidays 
          );

          if (days && days.length) {
            for (let j = 0; j < days.length; j++) {
              let currentDate = days[j];
              if (roomList && roomList.length) {
                for (let k = 0; k < roomList.length; k++) {
                  // Directly insert availability without checking for overlaps
                  await transactionalEntityManager.query(
                    `
                      INSERT INTO appointments
                      (providerID, medicalCenterID, providerShiftID, apointmentDate, roomID, requestID)
                      VALUES(?,?,?,?,?,?);
                    `,
                    [
                      req.user.id,
                      providerInfo[0].associatedMedicalID,
                      info.shiftID,
                      currentDate,
                      roomList[k].id,
                      availbilityInfo.requestID,
                    ]
                  );
                  
                  // Log activity once
                  if (!logAdded) {
                    await transactionalEntityManager.query(
                      `INSERT INTO activityLogs(name, activity, userID, requestID, causerID) 
                      VALUES(?,?,?,?,?)`,
                      [
                        'Added Availability',
                        `${req.user.name} have added their availability against request.`,
                        req.user.id,
                        availbilityInfo.requestID,
                        req.user.id,
                      ]
                    );
                    logAdded = true;
                  }
                  k = roomList.length; // Move to next day after successful insert
                }
              }
            }
          }
        }
      }

      if (
        availbilityInfo.customAvailability &&
        availbilityInfo.customAvailability.length
      ) {
        for (let i = 0; i < availbilityInfo.customAvailability.length; i++) {
          let info = availbilityInfo.customAvailability[i];
          let currentDate = info.date;

          if (roomList && roomList.length) {
            for (let j = 0; j < roomList.length; j++) {
              // Directly insert custom availability without checking for overlaps
              await transactionalEntityManager.query(
                `
                  DELETE FROM appointments 
                  WHERE providerID=? AND medicalCenterID=? AND apointmentDate=? AND roomID=?;
                `,
                [
                  req.user.id,
                  providerInfo[0].associatedMedicalID,
                  currentDate,
                  roomList[j].id,
                ]
              );

              await transactionalEntityManager.query(
                `
                  INSERT INTO appointments
                  (providerID, medicalCenterID, providerShiftID, apointmentDate, roomID, requestID)
                  VALUES(?,?,?,?,?,?);
                `,
                [
                  req.user.id,
                  providerInfo[0].associatedMedicalID,
                  info.shiftID,
                  currentDate,
                  roomList[j].id,
                  availbilityInfo.requestID,
                ]
              );
              j = roomList.length; // Move to next day after successful insert
            }
          }
        }
      }

      return {
        data: {},
        message: "All entries have been added successfully.",
      };
    }
  );
  return result;
}

  async updateAvailability(
    availabilityInfo: updateAvailbilityDTO,
    requestID,
    req
  ) {
    let logAdded:boolean=false;
    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        let overlappingEntries = {};
        let requestInfo = await transactionalEntityManager.query(
          "select * from requests where id=?",
          [requestID]
        );
        let providerShiftsInfo = await transactionalEntityManager.query(
          "select * from `provider-availability` where providerID=?",
          [req.user.id]
        );
        let providerInfo = await transactionalEntityManager.query(
          "select * from users where id=?",
          [req.user.id]
        );
        providerInfo = providerInfo[0];
        let roomList = await transactionalEntityManager.query(
          "select * from `medical-center-rooms` mcr where mcr.medicalCenterID = ? AND mcr.roomTypeID=?",
          [providerInfo.associatedMedicalID, providerInfo.specializationID]
        );
        if (availabilityInfo.customAvailability) {
          for (let i = 0; i < availabilityInfo.customAvailability.length; i++) {
            let info = availabilityInfo.customAvailability[i];
            let currentDate = info.date;
            let shiftStart =
              providerShiftsInfo[
                providerShiftsInfo.findIndex((x) => (x.id = info.shiftID))
              ].shiftFrom;
            let shiftEnd =
              providerShiftsInfo[
                providerShiftsInfo.findIndex((x) => (x.id = info.shiftID))
              ].shiftTo;
            if (info.isDeleted) {
              await transactionalEntityManager.query(
                `
                            DELETE FROM appointments where apointmentDate=?
                            `,
                [info.date]
              );
              if(!logAdded){
                await transactionalEntityManager.query(
                  `INSERT INTO activityLogs(name,activity,userID,requestID, causerID) 
                  VALUES(?,?,?,?,?)`,[
                    'Updated Availability',
                    `${req.user.name} have updated their availability against request.`,
                    req.user.id,
                    requestID,
                    req.user.id
                  ]
                );
                logAdded=true;
              }
            } else {
              if (roomList && roomList.length) {
                
                for (let j = 0; j < roomList.length; j++) {
                  
                  let preferredRoomPro = await transactionalEntityManager.query('call sp_req_check_room_if_provider_added_availability(?);',[[
                    roomList[j].id,
                    currentDate,
                    requestID,
                    req.user.id
                  ]])
                  if(preferredRoomPro && preferredRoomPro[0] && preferredRoomPro[0][0] && preferredRoomPro[0][0].count > 0){
                    let shiftsOnThatDay = await transactionalEntityManager.query(
                      "call sp_req_get_shift_single_date_exluding(?,?,?,?,?)",
                      [
                        providerInfo.associatedMedicalID,
                        currentDate,
                        providerInfo.specializationID,
                        roomList[j].id,
                        req.user.id,
                      ]
                    );
                    shiftsOnThatDay = shiftsOnThatDay[0];
                    if (
                      this.isOverlapping(shiftStart, shiftEnd, shiftsOnThatDay)
                    ) {
                      overlappingEntries[
                        currentDate
                      ] = `overlapping on ${currentDate} for room id ${roomList[j].id}`;
                    } else {
                      overlappingEntries[currentDate] = null;
                      await transactionalEntityManager.query(
                        `
                                          DELETE FROM appointments a WHERE a.providerID=? AND a.medicalCenterID=? AND a.apointmentDate=? AND a.roomID=?;
                                          `,
                        [
                          req.user.id,
                          providerInfo.associatedMedicalID,
                          currentDate,
                          roomList[j].id,
                        ]
                      );
                      await transactionalEntityManager.query(
                        `
                                          DELETE FROM appointments a WHERE a.id=?;
                                          `,
                        [info.id]
                      );
                      await transactionalEntityManager.query(
                        `
                                          INSERT INTO appointments
                                          (providerID, medicalCenterID, providerShiftID, apointmentDate, roomID, requestID)
                                          VALUES
                                          (?,?,?,?,?,?);
                                          `,
                        [
                          req.user.id,
                          providerInfo.associatedMedicalID,
                          info.shiftID,
                          currentDate,
                          roomList[j].id,
                          requestID,
                        ]
                      );
                      if(!logAdded){
                        await transactionalEntityManager.query(
                          `INSERT INTO activityLogs(name,activity,userID,requestID, causerID) 
                          VALUES(?,?,?,?,?)`,[
                            'Updated Availability',
                            `${req.user.name} have updated their availability against request.`,
                            req.user.id,
                            requestID,
                            req.user.id
                          ]
                        );
                        logAdded=true;
                      }
                      j = roomList.length;
                    }
                  }
                  else{
                    overlappingEntries[
                      currentDate
                    ] = `Blocked on ${currentDate} for room ${roomList[j].id}`;
                  }
                }
              }
            }
          }
        }

        return {
          data: overlappingEntries,
          message: "All entries have been updated except overlapping ones.",
        };
      }
    );
    return result;
  }

  async getProviderAvailability(request) {
    return await this._db.select(
      "select pa.id, pa.shiftType, pa.shiftFrom, pa.shiftTo from `provider-availability` pa where pa.providerID=?",
      [request.user.id],
      false
    );
  }
  isOverlapping(startTime, endTime, shifts) {
    // Helper function to parse hours and minutes
    function parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0); // Set time on current date
        return date;
    }

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    return shifts.some(shift => {
        const shiftStart = parseTime(shift.shiftFrom);
        const shiftEnd = parseTime(shift.shiftTo);
        return start < shiftEnd && end > shiftStart;
    });
}

  getWeekdaysBetween(start, end, skipWeekend, excludedDates) {
    let dates = [];
    let currentDate = moment(start).startOf('day'); 
    let endDate = moment(end).startOf('day');
  
    while (currentDate.diff(endDate) <= 0) {
      if (!excludedDates.includes(currentDate.format("YYYY-MM-DD"))) {
        if (!(skipWeekend && (currentDate.day() === 6 || currentDate.day() === 0))) {
          dates.push(currentDate.format("YYYY-MM-DD"));
        }
      }
      currentDate.add(1, "days");
    }
  
    return dates;
  }
  


  async getNotifications(req){
    return await this._db.select(
      "select * from activityLogs order by id desc;",
      [],
      false
    );
  }

  async getProviderRequestDetails(requestID,req){
    return await this._db.select(
      "call sp_req_get_provider_calender(?)",
      [[req.user.id,requestID]],
      true
    );
  }



  async getRequestOfProvider(providerID,req){
    return await this._db.select(
      "call sp_req_show_my_requests(?)",
      [[
        providerID,
        false
      ]],
      true
    );
  }

  async getProvidersAgainstRequest(req){
    return await this._db.select(
      "SELECT * FROM users where role='PROVIDER';",
      [],
      false
    );
    // return await this._db.select(
    //   "call sp_req_get_all_providers_against_request(?)",
    //   [[requestID]],
    //   true
    // );
  }
  

  async getProviderScheduleAgainstRequest(providerID,requestID,req){
    return await this._db.select(
      "call sp_req_get_provider_calender(?)",
      [[providerID,requestID]],
      true
    );
  }

  async updateProviderAvailability(
    availabilityInfo: updateAvailbilityDTO,
    requestID,
    providerID,
    req
  ) {
    let logAdded:boolean=false;
    let result = await getManager().transaction(
      async (transactionalEntityManager) => {
        let overlappingEntries = {};
        let requestInfo = await transactionalEntityManager.query(
          "select * from requests where id=?",
          [requestID]
        );
        let providerShiftsInfo = await transactionalEntityManager.query(
          "select * from `provider-availability` where providerID=?",
          [providerID]
        );
        let providerInfo = await transactionalEntityManager.query(
          "select * from users where id=?",
          [providerID]
        );
        providerInfo = providerInfo[0];
        let roomList = await transactionalEntityManager.query(
          "select * from `medical-center-rooms` mcr where mcr.medicalCenterID = ? AND mcr.roomTypeID=?",
          [providerInfo.associatedMedicalID, providerInfo.specializationID]
        );
        if (availabilityInfo.customAvailability) {
          for (let i = 0; i < availabilityInfo.customAvailability.length; i++) {
            let info = availabilityInfo.customAvailability[i];
            let currentDate = info.date;
            let shiftStart =
              providerShiftsInfo[
                providerShiftsInfo.findIndex((x) => (x.id == info.shiftID))
              ].shiftFrom;
            let shiftEnd =
              providerShiftsInfo[
                providerShiftsInfo.findIndex((x) => (x.id == info.shiftID))
              ].shiftTo;
            if (info.isDeleted) {
              await transactionalEntityManager.query(
                `
                            DELETE FROM appointments where id=?
                            `,
                [info.id]
              );
            } else {
              if (roomList && roomList.length) {
                
                for (let j = 0; j < roomList.length; j++) {
                  
                  let preferredRoomPro = await transactionalEntityManager.query('call sp_req_check_room_if_provider_added_availability(?);',[[
                    roomList[j].id,
                    currentDate,
                    requestID,
                    providerID
                  ]])
                  if(preferredRoomPro && preferredRoomPro[0] && preferredRoomPro[0][0] && preferredRoomPro[0][0].count > 0){
                    let shiftsOnThatDay = await transactionalEntityManager.query(
                      "call sp_req_get_shift_single_date_exluding(?,?,?,?,?)",
                      [
                        providerInfo.associatedMedicalID,
                        currentDate,
                        providerInfo.specializationID,
                        roomList[j].id,
                        providerID,
                      ]
                    );
                    shiftsOnThatDay = shiftsOnThatDay[0];
                    if (
                      this.isOverlapping(shiftStart, shiftEnd, shiftsOnThatDay)
                    ) {
                      overlappingEntries[
                        currentDate
                      ] = `overlapping on ${currentDate} for room id ${roomList[j].id}`;
                    } else {
                      overlappingEntries[currentDate] = null;
                      await transactionalEntityManager.query(
                        `
                                          DELETE FROM appointments a WHERE a.providerID=? AND a.medicalCenterID=? AND a.apointmentDate=? AND a.roomID=?;
                                          `,
                        [
                          providerID,
                          providerInfo.associatedMedicalID,
                          currentDate,
                          roomList[j].id,
                        ]
                      );
                      await transactionalEntityManager.query(
                        `
                                          DELETE FROM appointments a WHERE a.id=?;
                                          `,
                        [info.id]
                      );
                      await transactionalEntityManager.query(
                        `
                                          INSERT INTO appointments
                                          (providerID, medicalCenterID, providerShiftID, apointmentDate, roomID, requestID)
                                          VALUES
                                          (?,?,?,?,?,?);
                                          `,
                        [
                          providerID,
                          providerInfo.associatedMedicalID,
                          info.shiftID,
                          currentDate,
                          roomList[j].id,
                          requestID,
                        ]
                      );
                      if(!logAdded){
                        await transactionalEntityManager.query(
                          `INSERT INTO activityLogs(name,activity,userID,requestID, causerID) 
                          VALUES(?,?,?,?,?)`,[
                            'Updated Availability',
                            `Admin updated the availability of ${req.user.name} against request.`,
                            providerID,
                            requestID,
                            req.user.id
                          ]
                        );
                        logAdded=true;
                      }
                      j = roomList.length;
                    }
                  }
                  else{
                    overlappingEntries[
                      currentDate
                    ] = `Blocked on ${currentDate} for room ${roomList[j].id}`;
                  }
                }
              }
            }
          }
        }

        return {
          data: overlappingEntries,
          message: "All entries have been updated except overlapping ones.",
        };
      }
    );
    return result;
  }


  async getProviderSchedule(providerID,req){
    return await this._db.select(
      "select pa.id, pa.shiftType, pa.shiftFrom, pa.shiftTo from `provider-availability` pa where pa.providerID=?",
      [providerID],
      false
    );
  }
}
