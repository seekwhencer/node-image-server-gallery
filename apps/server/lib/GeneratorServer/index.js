import WebsocketServer from "./WebsocketServer.js";
import JobQueue from "./JobQueue.js";

export default class Generator extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        return new Promise((resolve, reject) => {
            this.label = 'GENERATOR';
            LOG(this.label, 'INIT');
            this.websocketServer = new WebsocketServer(this);
            this.queue = new JobQueue(this);

            // received from the a websocket client (from the generator app)
            this.on('job-complete', data => this.jobComplete(data));

            resolve(this);
        });
    }

    // called from the media route controller
    // returns the object
    // the the route controller, the logic awaits an event: 'complete'
    addJob(image) {
        return this.queue.add(image);
    }

    removeJob(job) {
        this.queue.remove(job);
    }

    jobComplete(message) {
        LOG(this.label, 'JOB COMPLETE', message.data.hash);
        const job = this.queue.find(message.data.hash);
        job.emit('complete', job);
    }
}
