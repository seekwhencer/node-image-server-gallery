import {WebSocket} from 'ws';

export default class WebsocketClient extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'GENERATOR WEBSOCKET CLIENT';

        this.serverSocketUrl = `ws://${GENERATOR_CLIENT_HOST}:${GENERATOR_CLIENT_PORT}`;
        this.connect();
    }

    connect() {
        this.engine ? delete this.engine : null;
        this.engine = new WebSocket(this.serverSocketUrl, {
            perMessageDeflate: false
        });

        this.engine.on('open', data => this.onOpen(data));
        this.engine.on('close', data => this.onClose(data));
        this.engine.on('error', data => this.onError(data));
        this.engine.on('message', data => this.onMessage(data));
    }

    onOpen(data) {
        LOG(this.label, 'CONNECTED TO', this.serverSocketUrl);
    }

    onClose(data) {
        LOG(this.label, 'DISCONNECTED');
        this.reconnect();
    }

    onError(data) {
        LOG(this.label, 'ERROR');
        this.reconnect();
    }

    onMessage(data){
        const message = JSON.parse(data.toString());
        //LOG(this.label, 'MESSAGE', message);
        this.parseCommand(message);
    }

    reconnect() {
        LOG(this.label, 'TRYING TO RECONNECT IN', GENERATOR_CLIENT_RECONNECT_IDLE, 'MS');
        this.timer ? clearTimeout(this.timer) : null;
        this.timer = setTimeout(() => this.connect(), GENERATOR_CLIENT_RECONNECT_IDLE);
    }

    send(data) {
        const message = JSON.stringify(data);
        this.engine.send(message);
    }

    parseCommand(data) {
        // the data.message equals the event name
        // the parent is the generator client
        this.parent.emit(data.message, data);
    }

}
