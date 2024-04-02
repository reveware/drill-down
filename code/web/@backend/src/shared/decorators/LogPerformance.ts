import * as _ from 'lodash';
import {Logger} from '@nestjs/common';

const logger = new Logger('logPerformance');

export function LogPerformance(extras?: ExtrasFunction) : any {
    return (target: any, methodName: string, descriptor: PropertyDescriptor) => {
        const {name: className} = target.constructor;
        const name = `${className}/${methodName}`;

        const method = descriptor.value;

        descriptor.value = function(...parameters: any[]) {
            const startTime = Date.now();

            try {
                const appliedMethodResult = method.apply(this, parameters);

                const isPromise = appliedMethodResult instanceof Promise;

                if (!isPromise) {
                    const took = Date.now() - startTime;
                    logExecution.bind(this)(name, took, parameters, appliedMethodResult, extras, null);
                    return appliedMethodResult;
                }

                return appliedMethodResult
                    .then((result: any) => {
                        const took = Date.now() - startTime;
                        logExecution.bind(this)(name, took, parameters, result, extras, null);
                        return result;
                    })
                    .catch((e: Error) => {
                        const took = Date.now() - startTime;
                        logExecution.bind(this)(name, took, parameters, null, extras, e);
                        throw e;
                    });
            } catch (e) {
                const took = Date.now() - startTime;
                logExecution.bind(this)(name, took, parameters, null, extras, e);
                throw e;
            }
        };

        return descriptor;
    };
}

function logExecution(this: unknown, name: string, took: number, args: any[], result: any, addExtra?: ExtrasFunction, error?: Error | null): void {
    let log = `${name} took ${took}ms`;

    if (error) {
        log += ` | error: ${error.message} |`;
        return logger.error(log);
    }

    if (typeof addExtra === 'function') {
        log += ` | extra: ${addExtra(this, args, result)}`;
    } 

    logger.log(log);

}

export type ExtrasFunction = (instance: unknown, args: any[], result: any) => string;