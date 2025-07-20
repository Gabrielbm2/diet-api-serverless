import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { badRequest, created, ok, unauthorized } from "../utils/http";
import { mealsTable} from "../db/schema";
import { db } from "../db";
import z from "zod";
import { and, eq, gte, lte } from "drizzle-orm";

const schema = z.object({
    mealId: z.uuid(),
});

export class GetMealByIdController {
    static async handle({ userId, params }: ProtectedHttpRequest): Promise<HttpResponse> {
        const { success, error, data } = schema.safeParse(params);

        if (!success) {
        return badRequest({ errors: error.issues });
        }

        const meal = await db.query.mealsTable.findFirst({
            columns: {
                id: true,
                name: true,
                foods: true,
                icon: true,
                createdAt: true,
                status: true,
            },
            where: and(
                eq(mealsTable.userId, userId),
                eq(mealsTable.id, data.mealId),
            ),
        });

        return ok({ meal });
    }
}