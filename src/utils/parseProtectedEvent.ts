import { APIGatewayProxyEventV2 } from "aws-lambda";
import { HttpRequest, ProtectedHttpRequest } from "../types/Http";
import { parseEvent } from "./parseEvent";
import { validateAccessToken } from "../lib/jwt";

export function parseProtectedEvent(event: APIGatewayProxyEventV2): ProtectedHttpRequest {


    const baseEvent = parseEvent(event);
    const { authorization } = event.headers;

    if(!authorization) {
        throw new Error("Unauthorized: No authorization header provided");
    }

    const [, token] = authorization.split(' ');
    const userId = validateAccessToken(token);

    if (!userId) {
        throw new Error("Unauthorized: Invalid access token");
    }
    
    return {
        ...baseEvent,
        userId,
    }
}