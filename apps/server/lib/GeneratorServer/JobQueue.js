import Job from './Job.js';

export default class JobQueue extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'QUEUE';

        this.jobs = [];
    }

    add(image) {
        LOG(this.label, 'ADDING IMAGE:', image.filePath);

        return new Promise(resolve => {
            const exists = this.find(image.hash);

            if (exists) {
                LOG(this.label, 'JOB EXISTS');
                resolve();
            } else {
                LOG(this.label, 'ADD JOB', image.filePath);
                const job = new Job(this, image);

                job.on('complete', job => {
                    this.remove(job);
                    resolve();
                });

                this.jobs.push(job);
            }
        });
    }

    remove(job) {
        LOG(this.label, 'REMOVE JOB', job.image.filePath);
        this.jobs = this.jobs.filter(j => j.hash !== job.hash);
    }

    find(hash) {
        return this.jobs.filter(j => j.hash === hash)[0];
    }
}
