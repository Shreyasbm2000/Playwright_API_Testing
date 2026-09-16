import { test as base, request } from '@playwright/test'
import { RequestHandler } from './request-handler'
import { APILogger } from './logger'
import { config } from '../api-test.config'
import { setCustomExpectLogger } from './cutom-expect1'
import { createToken } from '../helpers/createToken'

export type Fixtures = {
    api: RequestHandler
    config: typeof config
}

export type WorkerFirxture = {
    authToken:string
}
export const test = base.extend<Fixtures,WorkerFirxture>({

    authToken: [async ({},use)=>{
        const  authToken = await createToken(config.userEmail,config.userPassword)
       await use(authToken)
        
    },{scope:'worker'}],

    api: async ({ request,authToken }, use) => {
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        const requestHandler = new RequestHandler(request, config.apiUrl, logger,authToken);
        await use(requestHandler)
             },
    config: async ({ }, use) => {
        await use(config)
                 }
})