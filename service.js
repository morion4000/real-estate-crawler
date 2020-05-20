const worker = require('./worker');
const INTERVAL = 3600 * 24; // 1 day
const LOCATION = process.env.LOCATION || 'mehedinti/drobeta-turnu-severin';

console.log(`Starting service with interval: ${INTERVAL}s`);

async function service() {
    console.log(`Starting worker ${LOCATION}`);

    try {
        await worker(LOCATION);
    } catch (e) {
        console.log('Worker error');
        console.error(e);
    }

    console.log(`Stopped worker ${LOCATION}`);
}

setInterval(service, INTERVAL * 1000);

service();