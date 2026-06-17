'use server';

import { db } from "@/config/db";
import { getCurrentUser } from "../auth/server/auth.queries";
import { employers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmployerProfileData } from "../employers/employers.schema";

export const updateEmployerProfileAction = async (data: EmployerProfileData) => {
    try{
        const currentUser = await getCurrentUser();

        if(!currentUser || currentUser.role !== "employer"){
            return {
                status: 'ERROR',
                message: "Unauthorized"
            }
        }

        const {                               
        name,
        description,
        yearOffStablishment,
        location,
        websiteUrl,
        organizationType,
        teamSize
        } = data;

        const updateEmployer = await db.update(employers).set({
            name,
            description,
            yearOffStablishment: yearOffStablishment ? parseInt(yearOffStablishment) : null,
            location,
            websiteUrl,
            organizationType,
            teamSize
        }).where(eq(employers.id, currentUser.id));

        console.log("updateEmployer", updateEmployer);

        return {
            status: 'SUCCESS',
            message: "Employer profile updated successfully"
        }

    }
    catch(error){
        return {
            status: 'ERROR',
            message: "An error occurred while updating employer profile"
        }
    }
}
