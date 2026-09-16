import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';


let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger;
}


declare global {
    namespace PlaywrightTest{
        interface Matchers<R,T>{
           shouldEqual(expected:T) :R ,
           shouldBeLessThanOrEqual(expected:T):R
        }
    }
}


export const expect = baseExpect.extend({

    shouldEqual(recevied: any, expected: any) {
        let pass: boolean;
        let logs: string = "";

        try {
            baseExpect(recevied).toEqual(expected);
            pass = true;
            if(this.isNot){
                           logs = apiLogger.getRecentLogs() 
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs()
        }
        const hint = this.isNot ? 'not' : '';
        const message = this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Recevied: ${this.utils.printReceived(recevied)}\n\n`+
            `Recent API Activity: \n${logs}`

        return {
            message:  ()=>message,
            pass,
           
        };
    },
    shouldBeLessThanOrEqual(recevied: any, expected: any) {
        let pass: boolean;
        let logs: string = "";

        try {
            baseExpect(recevied).toEqual(expected);
            pass = true;
            if(this.isNot){
                           logs = apiLogger.getRecentLogs() 
            }
        } catch (e: any) {
            pass = false;
            logs = apiLogger.getRecentLogs()
        }
        const hint = this.isNot ? 'not' : '';
        const message = this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
            '\n\n' +
            `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
            `Recevied: ${this.utils.printReceived(recevied)}\n\n`+
            `Recent API Activity: \n${logs}`

        return {
            message:  ()=>message,
            pass,
           
        };
    }

})