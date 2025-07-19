import { access } from "fs";
import { HttpResponse, HtttpRequest } from "../types/Http";
import { ok } from "../utils/http";

export class SignInController {
    static async handle(request: HtttpRequest): Promise<HttpResponse> {
        return ok({ accessToken: "Token de acesso gerado com sucesso!" })

    }
}