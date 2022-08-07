import { Logtail } from "@logtail/node";


let logger: Logtail | null = null; 

if (!logger)
    logger = new Logtail(process.env.LOGTAIL_TOKEN ?? "");


// async function enrichLogs(log: ILogtailLog): Promise<ILogtailLog> {
//     return {
//         ...log,
//         userId: getCurrentUserId()
//     };
// }

export {logger};
