"use server"
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);
    if (!validateFields.success) {
        return {
            error: "Invalid fields!"
        }
    }

    const { name, email, password } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if(existingUser){
        return {
            error: "User already exists!"
        }
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    return {
        success: "Success!"
    }
}