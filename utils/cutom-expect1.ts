import { expect as baseExpect } from '@playwright/test';
import { APILogger } from './logger';
import { validateSchema } from './schemaValidator';
import { promises } from 'dns';


let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
    apiLogger = logger;
}


declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            shouldEqual(expected: T): R,
            shouldBeLessThanOrEqual(expected: T): R
            shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?: boolean): Promise<R>
        }
    }
}


export const expect = baseExpect.extend({
// If we want tot generate schema for all the resposnes we need not to  add true in all the expect we can just flip the createSchemaFlag
    async shouldMatchSchema(recevied: any, dirName: string, fileName: string, createSchemaFlag: boolean = false) {
        let pass: boolean;
        let message: string = "";

        try {
            await validateSchema(dirName, fileName, recevied, createSchemaFlag)

            pass = true;
            message = `Schema Validation Passed`
        } catch (e: any) {
            pass = false;

            const logs = apiLogger.getRecentLogs()
            message = `${e.message}\n\n Recent API Activity: \n${logs}`
        }

        return {
            message: () => message,
            pass,

        };
    },


    shouldEqual(recevied: any, expected: any) {
        let pass: boolean;
        let logs: string = "";

        try {
            baseExpect(recevied).toEqual(expected);
            pass = true;
            if (this.isNot) {
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
            `Recevied: ${this.utils.printReceived(recevied)}\n\n` +
            `Recent API Activity: \n${logs}`

        return {
            message: () => message,
            pass,

        };
    },
    shouldBeLessThanOrEqual(recevied: any, expected: any) {
        let pass: boolean;
        let logs: string = "";

        try {
            baseExpect(recevied).toEqual(expected);
            pass = true;
            if (this.isNot) {
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
            `Recevied: ${this.utils.printReceived(recevied)}\n\n` +
            `Recent API Activity: \n${logs}`

        return {
            message: () => message,
            pass,

        };
    }

})