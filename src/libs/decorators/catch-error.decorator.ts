import createError from 'http-errors';

type CatchErrorConfig = {
    enableHttpResponse?: boolean
}

export function CatchError(config: CatchErrorConfig) {
    return (target: any) => {
        const prototype = target.prototype;
        const methodNames = Object.getOwnPropertyNames(prototype).filter(methodName => methodName !== 'constructor');
    
        for(let name of methodNames) {
            const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
            if(descriptor && typeof descriptor == "function") {
                Object.defineProperty(prototype, name, CatchErrorFn(config)(target, name, descriptor));
            }
        }    
    }
}

export function CatchErrorFn(config: CatchErrorConfig) {
    return (target: any, method: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
    
        descriptor.value = function(...args: any[]) {
            try {
                return originalMethod.apply(this, args);
            } catch (error: any) {
                console.log(`[Error]: ${error.message}`);
                const status = error.status?? 500;
                const message = config.enableHttpResponse? error.message : 'Internal Server Error';
                throw createError(status, message);
            }
        }

        return descriptor;
    }
}