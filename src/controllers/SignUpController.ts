import { and, eq } from "drizzle-orm";
import { HttpResponse, HttpRequest } from "../types/Http";
import { badRequest, conflict, created } from "../utils/http";
import z from "zod";
import { usersTable } from "../db/schema";
import { db } from "../db";
import { hash } from "bcryptjs";
import { signAccessTokenFor } from "../lib/jwt";
import { calculateGoals } from "../lib/calculateGoals";

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
    static async handle({body}: HttpRequest): Promise<HttpResponse> {

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

        const goals = calculateGoals({
            activityLevel: data.activityLevel,
            height: data.height,
            weight: data.weight,
            gender: data.gender,
            birthDate: new Date(data.birthDate),
            goal: data.goal,
        });

        const hashedPassword = await hash(data.account.password, 10);

        const [user] = await db.insert(usersTable).values({
            goal: data.goal,
            gender: data.gender,
            birthDate: data.birthDate,
            height: data.height,
            weight: data.weight,
            activityLevel: data.activityLevel,
            email: data.account.email,
            name: data.account.name,
            password: hashedPassword,
            calories: goals.calories,
            proteins: goals.proteins,
            carboHydrates: goals.carbohydrates,
            fats: goals.fats,
        }).returning({
            id: usersTable.id,
        });

        const accessToken = signAccessTokenFor(user.id);
        
        return created({
            accessToken,
        });
    }
}