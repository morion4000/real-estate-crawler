const worker = require('./worker');
const INTERVAL = 3600 * 24; // 1 day

console.log(`Starting service with interval: ${INTERVAL}s`);

setInterval(async () => {
    console.log(`Starting worker`);

    try {
        await worker();
    } catch (e) {
        console.log('Worker error');
        console.error(e);
    }

    console.log(`Stopped worker`);
}, INTERVAL * 1000);