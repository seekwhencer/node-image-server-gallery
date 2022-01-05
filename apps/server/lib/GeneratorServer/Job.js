export default class Job extends MODULECLASS {
    constructor(parent, image) {
        super(parent);

        this.label = 'JOB';
        this.image = image;
        this.hash = this.image.hash;
        this.websocketServer = this.app.generatorserver.websocketServer;

        this.send();
    }

    send() {
        const message = {
            message: 'add-file',
            file: this.image.aggregate()
        };
        this.websocketServer.sendClientRotation(message);
    }
}
