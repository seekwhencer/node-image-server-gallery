import {WebSocketServer} from 'ws';
import WebsocketClient from "./WebsocketClient.js";

export default class WebsocketServer extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'GENERATOR WEBSOCKET SERVER';
        LOG(this.label, 'INIT');

        this.clients = [];
        this.clientsIndex = 0;

        this.engine = new WebSocketServer({
            port: GENERATOR_SERVER_PORT,
            perMessageDeflate: {
                zlibDeflateOptions: {
                    // See zlib defaults.
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3
                },
                zlibInflateOptions: {
                    chunkSize: 10 * 1024
                },
                // Other options settable:
                clientNoContextTakeover: true, // Defaults to negotiated value.
                serverNoContextTakeover: true, // Defaults to negotiated value.
                serverMaxWindowBits: 10, // Defaults to negotiated value.
                // Below options specified as default values.
                concurrencyLimit: 10, // Limits zlib concurrency for perf.
                threshold: 1024 // Size (in bytes) below which messages
                // should not be compressed.
            }
        });

        this.engine.on('connection', client => {
            LOG(this.label, 'CLIENT CONNECTED');
            this.addClient(client);
        });

        this.on('client-found', client => {
        });
        this.on('client-not-found', () => {
        });

        LOG(this.label, 'LISTEN ON PORT', GENERATOR_SERVER_PORT);
    }

    /**
     * the client object from WebSocketServer
     * @param wsClient
     */
    addClient(wsClient) {
        this.clients.push(new WebsocketClient(this, wsClient));
    }

    /**
     * The ID from the WebsocketClient Class
     * @param clientId
     */
    removeClient(clientId) {
        this.clients = this.clients.filter(c => c.id !== clientId);
    }

    sendClientRotation(message) {
        this.clients[this.clientsIndex].send(message);
        this.clientsIndex === this.clients.length - 1 ? this.clientsIndex = 0 : this.clientsIndex = this.clientsIndex + 1;
    }
}
