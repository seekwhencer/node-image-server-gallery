import * as Routes from './Routes/index.js';
import path from 'path';
import http from 'http';

export default class ImageServer extends MODULECLASS {
    constructor(parent) {
        super(parent);
        this.label = 'IMAGE SERVER';
        LOG(this.label, 'INIT');

        this.on('listen', () => LOG(this.label, 'LISTEN ON PORT:', SERVER_PORT));

        this.engine = APP;
        this.server = false;

        // CORS
        this.engine.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        this.registerRoutes();
        this.registerFrontend();

        // listen on the given port
        return this.start();
    }

    start() {
        return new Promise((resolve, reject) => {
            this.server = http.Server(this.engine);
            this.server.listen(SERVER_PORT, () => {
                resolve(this);
                this.emit('listen');
            });
        });
    }

    stop() {
        //..
    }

    registerRoutes() {
        Object.keys(Routes).forEach(route => this.engine.use(`/${SERVER_ROOT_URL}`, new Routes[route](this)));
    }

    registerFrontend() {
        this.frontendPath = path.resolve('../frontend/dist/prod');
        this.engine.use(EXPRESS.static(this.frontendPath));
    }
}
