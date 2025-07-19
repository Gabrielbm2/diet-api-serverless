export type HtttpRequest = {
    body: Record<string, any>;
    queryParams: Record<string, any>;
    params: Record<string, any>;
};

export type HttpResponse = {
    statusCode: number;
    body?: Record<string, any> | string;
};