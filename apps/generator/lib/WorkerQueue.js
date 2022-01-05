import Worker from "./Worker.js";

export default class WorkerQueue extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'WORKER QUEUE'
        this.queue = [];

        // elevate the event to the generator client
        this.on('worker-complete', worker => this.parent.emit('worker-complete', worker));
    }

    add(data) {
        LOG(this.label, 'ADDED', data.file.hash);

        const worker = new Worker(this, data);
        worker.on('complete', worker => this.emit('worker-complete', worker));

        this.queue.push(worker);
    }

    remove(worker) {
        LOG(this.label, 'REMOVED', worker.hash);
        this.queue = this.queue.filter(w => w.hash !== worker.hash);
    }

    find(hash) {
        return this.queue.filter(q => q.hash === hash)[0];
    }
}
