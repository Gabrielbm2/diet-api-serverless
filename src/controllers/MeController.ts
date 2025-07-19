import { and, eq } from "drizzle-orm";
import { HttpResponse, HttpRequest, ProtectedHttpRequest } from "../types/Http";
import { badRequest, ok, unauthorized } from "../utils/http";
import { usersTable } from "../db/schema";
import { db } from "../db";

export class MeController {
  static async handle({ userId }: ProtectedHttpRequest): Promise<HttpResponse> {
    const user = await db.query.usersTable.findFirst({
        columns: {
            id: true,
            email: true,
            name: true,
            calories: true,
            proteins: true,
            carboHydrates: true,
            fats: true,

        },
        where: eq(usersTable.id, userId),
    });

    if (!user) {
        return unauthorized({ error: "Unauthorized: User not found" });
    }

    return ok({ user });
  }
}