import { and, eq } from "drizzle-orm";
import { HttpResponse, HtttpRequest } from "../types/Http";
import { badRequest, conflict, created } from "../utils/http";
import z from "zod";
import { usersTable } from "../db/schema";
import { db } from "../db";
import { id } from "zod/locales";

const schema = z.object({
    goal: z.enum(['lose', 'maintain', 'gain']),
    gender: z.enum(['male', 'female']),
    birthDate: z.iso.date(),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.number().int().min(1).max(5),
    account: z.object({
        email: z.email(),
        password: z.string().min(6),
        name: z.string().min(1),
    }),
});

export class SignUpController {
    static async handle({body}: HtttpRequest): Promise<HttpResponse> {

        const { success, error, data } = schema.safeParse(body);

        if (!success) {
            return badRequest({errors: error.issues})
        }

        const userAlreadyExists = await db.query.usersTable.findFirst({
            columns: {
                email: true,
            },
            where: and(
                eq(usersTable.email, data.account.email)
            )

        });

        if (userAlreadyExists) {
            return conflict({error: 'This email already exists.'});
        }

        const [user] = await db.insert(usersTable).values({
            ...data,
            ...data.account,
            calories: 0,
            proteins: 0,
            carboHydrates: 0,
            fats: 0,
        }).returning({
            id: usersTable.id,
        });

        return created({
            userId: user.id,
        });
    }
}