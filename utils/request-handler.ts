import { APIRequestContext } from "@playwright/test";
import { test } from "@playwright/test";
import { APILogger } from "./logger";

export class RequestHandler {
    private request: APIRequestContext;
    private logger: APILogger;
    private baseUrl?: string | undefined = '';
    private defaultBaseUrl: string = '';
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: Record<string, string> = {};
    private apiBody: object = {};
    private defaultAuthToken = '';
    private clearAuthFlag?: boolean;


    constructor(request: APIRequestContext, apiBaseurl: string, logger: APILogger, authToken: string = '') {
        this.request = request;
        this.defaultBaseUrl = apiBaseurl;
        this.logger = logger;
        this.defaultAuthToken = authToken;
    }

    url(url: string) {
        this.baseUrl = url;
        return this;
    }
    path(path: string) {
        this.apiPath = path;
        return this;
    }

    params(params: object) {
        this.queryParams = params;
        return this;
    }
    headers(headers: Record<string, string>) {
        this.apiHeaders = headers;
        return this;
    }
    body(body: object) {
        this.apiBody = body;
        return this;

    }
    clearAuth() {
        this.clearAuthFlag = true;
        return this
    }

    async getRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();
      await  test.step(`GET request to: ${url}`, async () => {
            this.logger.logRequest('GET', url, this.getHeader())
            const response = await this.request.get(url, {
                headers: this.getHeader()
            })
            this.cleanUpFields()
            const actualStatus = response.status()
            responseJson = await response.json()

            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statusCode, this.getRequest)

        })

        return responseJson
    }

    async postRequest(statusCode: number) {
        let responseJson: any;
        const url = this.getUrl();
      await  test.step(`POST request to: ${url}`, async () => {

            this.logger.logRequest('POST', url, this.getHeader(), this.apiBody)
            const response = await this.request.post(url, { data: this.apiBody, headers: this.getHeader() })
            this.cleanUpFields()

            responseJson = await response.json()
            const actualStatus = response.status()

            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statusCode, this.postRequest)
        })

        return responseJson
    }

    async putRequest(statusCode: number) {
        let responseJson: any
        const url = this.getUrl();
      await  test.step(`PUT request to: ${url}`, async () => {
            this.logger.logRequest('PUT', url, this.getHeader(), this.apiBody)
            const response = await this.request.put(url, { data: this.apiBody, headers: this.getHeader() })
            this.cleanUpFields()
            responseJson = response.json()
            const actualStatus = response.status()
            this.logger.logResponse(actualStatus, responseJson)
            this.statusCodeValidator(actualStatus, statusCode, this.putRequest)
        })
        return responseJson

    }


    async deleteRequest(statusCode: number) {
        const url = this.getUrl();
     await   test.step(`DELETE request to: ${url}`, async () => {

            this.logger.logRequest('DELETE', url, this.getHeader())
            const response = await this.request.delete(url, { headers: this.getHeader() })
            this.cleanUpFields()
            const actualStatus = response.status();
            this.logger.logResponse(actualStatus)
            this.statusCodeValidator(actualStatus, statusCode, this.deleteRequest)
        })
    }




    private getUrl() {
        const url1 = `${this.baseUrl || this.defaultBaseUrl}${this.apiPath}`;
        const url2 = this.baseUrl || this.defaultBaseUrl + this.apiPath;
        const url = new URL(url2);
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value);
        }
        console.log(url.toString());
        return url.toString();
    }

    private statusCodeValidator(actualStatus: number, expectedStatus: number, callingMethod: Function) {
        if (actualStatus !== expectedStatus) {
            const logs = this.logger.getRecentLogs();
            const error = new Error(`Expected status ${expectedStatus} but got  ${actualStatus}\n\nRecent Api Activity\n${logs}`)
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }

    private getHeader() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken
        }
        return this.apiHeaders;
    }

    private cleanUpFields() {
        this.apiBody = {}
        this.apiHeaders = {}
        this.baseUrl = undefined
        this.apiPath = ''
        this.queryParams = {}
        this.clearAuthFlag = false
    }

}