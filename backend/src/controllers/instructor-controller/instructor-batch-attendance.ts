import { Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { prisma } from "../../lib/prisma";
import { InstructorAuthRequest } from "../../interfaces/instructor-auth-interface";
import { ApiError } from "../../helpers/ApiError";
import { ApiResponse } from "../../helpers/ApiResponse";


export const getBatchAttendance = asyncHandler(

    async (
        req: InstructorAuthRequest,
        res: Response
    ) => {

        const batchId = req.params.batchId as string;

        const instructorId =
            req.instructor?.instructor_id as string;

        const batch = await prisma.batch_details.findFirst({
            where: {
                batch_id: batchId,
                instructor_id: instructorId
            }
        });


        if (!batch) {
            throw new ApiError(
                404,
                "Batch not found."
            );
        }
        //today

        const today = new Date();

        today.setHours(
            23,
            59,
            59,
            999
        );

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(
            today.getDate()-6
        );

        sevenDaysAgo.setHours(
            0,
            0,
            0,
            0
        );

        const attendanceSessions =
        await prisma.attendance_sessions.findMany({

            where:{

                batch_id:batchId,

                session_date:{

                    gte:sevenDaysAgo,

                    lte:today

                }

            }

        });

        const attendanceSessionIds =

        attendanceSessions.map(

            (session)=>

            session.attendance_session_id

        );

        const attendanceRecords =

        await prisma.attendance_records.findMany({
            where:{
                attendance_session_id:{
                    in:attendanceSessionIds
                }
            }
        });

        //session id -> date mapping
        const totalCandidates =

        await prisma.batch_enrollment.count({
            where:{
                batch_id:batchId,
                enrollment_status:"ACTIVE"
                
            }
        });
        const sessionDateMap = new Map<string,string>();

        attendanceSessions.forEach((session)=>{
            sessionDateMap.set(
                session.attendance_session_id,
                session.session_date.toISOString().split("T")[0]
            );
        });

        const attendanceMap : Record<
        string,
        {
            present:number,
            late:number
        }

        > = {};

        attendanceRecords.forEach((record)=>{
            const date = sessionDateMap.get(
                record.attendance_session_id
            );
            if(!date){
                return;
            }
            if(!attendanceMap[date]){
                attendanceMap[date]={
                    present:0,
                    late:0,
                };
            }
            if(record.attendance_status==="present"){
                attendanceMap[date].present++;
            }
            else if(
                record.attendance_status==="late"
            ){
                attendanceMap[date].late++;
            }
        });

        const attendanceOverview: {
            date:string,
            attendancePercentage:number,
            sessionConducted:boolean
        }[] = [];
        
        attendanceSessions.forEach((session)=>{

        const date =
        session.session_date
        .toISOString()
        .split("T")[0];
        //avoids duplicate dates
        if(
            attendanceOverview.some(
                (item)=>item.date===date
            )
        ){
            return;
        }
        const attendanceData =
        attendanceMap[date];
        const attendancePercentage =
        attendanceData
        ?
        (
            totalCandidates===0
            ?0
            :Number(
                (
                    (
                        (
                            attendanceData.present
                            +
                            attendanceData.late
                        )
                        /
                        totalCandidates
                    )*100
                ).toFixed(2)
            )
        )
        :0;
        attendanceOverview.push({
                date,
                attendancePercentage,
                sessionConducted:true
            });
        });

        for(let i=0;i<7;i++){
                const currentDate =
                new Date(sevenDaysAgo);
                currentDate.setDate(
                    sevenDaysAgo.getDate()+i
                );
                const formattedDate =
                currentDate
                .toISOString()
                .split("T")[0];

                const dateExists =
                attendanceOverview.some(
                    (item)=>
                    item.date===formattedDate
                );
                if(!dateExists){
                    attendanceOverview.push({
                        date:formattedDate,
                        attendancePercentage:0,
                        sessionConducted:false
                    });
                }
            }
       
        attendanceOverview.sort(
            (a,b)=>
            new Date(a.date).getTime()
            -
            new Date(b.date).getTime()
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {attendanceOverview},
                "Attendance fetched successfully."
            )
        );
    }
);