import WebsocketClient from './WebsocketClient.js';
import WorkerQueue from './WorkerQueue.js';

export default class GeneratorClient extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'GENERATOR CLIENT';

        return new Promise((resolve, reject) => {
            this.client = new WebsocketClient(this);
            this.queue = new WorkerQueue(this);

            // received from the websocket server
            this.on('add-file', data => this.addWorker(data));

            // if a worker is complete
            this.on('worker-complete', worker => this.workerComplete(worker));

            resolve(this);
        });
    }

    addWorker(data) {
        this.queue.add(data);
    }

    removeWorker(worker) {
        this.queue.remove(worker);
    }

    workerComplete(worker) {
        const data = {
            message: 'job-complete',
            data: {
                hash: worker.file.hash
            }
        };
        this.client.send(data);
        this.removeWorker(worker);
    }
}
