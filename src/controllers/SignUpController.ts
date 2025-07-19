import { access } from "fs";
import { HttpResponse, HtttpRequest } from "../types/Http";
import { created } from "../utils/http";

export class SignUpController {
    static async handle(request: HtttpRequest): Promise<HttpResponse> {
        return created({
            accessToken: "Token de acesso gerado com sucesso!"
        });
    }
}