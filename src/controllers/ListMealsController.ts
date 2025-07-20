import { HttpResponse, ProtectedHttpRequest } from "../types/Http";
import { badRequest, created, ok, unauthorized } from "../utils/http";
import { mealsTable} from "../db/schema";
import { db } from "../db";
import z from "zod";
import { and, eq, gte, lte } from "drizzle-orm";

const schema = z.object({
    date: z.iso.date().transform(dateStr => new Date(dateStr)),
});

export class ListMealsController {
    static async handle({ userId, queryParams }: ProtectedHttpRequest): Promise<HttpResponse> {
        const { success, error, data } = schema.safeParse(queryParams);

        if (!success) {
        return badRequest({ errors: error.issues });
        }

        const endDate = new Date(data.date)
        endDate.setUTCHours(23, 59, 59, 59);

        const meals = await db.query.mealsTable.findMany({
            columns: {
                id: true,
                name: true,
                foods: true,
                icon: true,
                createdAt: true,
            },
            where: and(
                eq(mealsTable.userId, userId),
                gte(mealsTable.createdAt, data.date),
                lte(mealsTable.createdAt, endDate),
                eq(mealsTable.status, 'success')
            ),
        });

        return ok({ meals });
    }
}