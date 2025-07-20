import {APIGatewayProxyEventV2} from 'aws-lambda'
import { parseResponse } from "../utils/parseResponse";
import { GetMealByIdController } from '../controllers/GetMealByIdController';
import { parseProtectedEvent } from '../utils/parseProtectedEvent';
import { unauthorized } from '../utils/http';

export async function handler(event: APIGatewayProxyEventV2) {
    try {
        const request = parseProtectedEvent(event);
        const response = await GetMealByIdController.handle(request);
        
        return parseResponse(response);
    } catch  {
        return parseResponse(
            unauthorized({ 
                error: "Unauthorized: Invalid access token" 
            }));
    }
}