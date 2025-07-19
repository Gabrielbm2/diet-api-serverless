import { HttpResponse, HtttpRequest } from "../types/Http";
import { badRequest, created } from "../utils/http";
import z from "zod";

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


        return created({
            data,
        });
    }
}