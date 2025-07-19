import { HttpResponse, HtttpRequest } from "../types/Http";
import { badRequest, created, ok } from "../utils/http";
import { z } from 'zod';

const schema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export class SignInController {
    static async handle({body}: HtttpRequest): Promise<HttpResponse> {
        const { success, error, data } = schema.safeParse(body);

        if (!success) {
            return badRequest({errors: error.issues})
        }


        return created({
            data,
        });
    }
}