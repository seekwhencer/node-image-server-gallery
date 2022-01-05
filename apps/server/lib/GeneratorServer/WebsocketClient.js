export default class WebsocketClient extends MODULECLASS {
    constructor(parent, wsClient) {
        super(parent);
        this.label = 'WEBSOCKET CLIENT';

        this.client = wsClient;
        this.id = this.client._socket._handle.fd;
        this.busy = false;

        // do things on a message
        this.client.on('message', message => this.onMessage(message));

        // do things when this one connection was closed
        this.client.on('close', () => this.onClose());

        // send a welcome message to the client
        this.send({
            message: 'hi',
            data: {
                pow: 'peng'
            }
        });

        LOG(this.label, 'INIT:', this.id);
    }

    onMessage(message) {
        const data = JSON.parse(message);
        this.parseCommand(data);
    }

    onClose() {
        LOG(this.label, this.id, 'DISCONNECTED');
        this.remove();
    }

    send(data) {
        //LOG(this.label, this.id, 'SENDING MESSAGE');
        const message = JSON.stringify(data);
        this.client.send(message);
    }

    remove() {
        LOG(this.label, this.id, 'REMOVING');
        this.parent.removeClient(this.id);
    }

    parseCommand(data) {
        // data.message is the event name
        this.app.generatorserver.emit(data.message, data);
    }
}
