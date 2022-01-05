import './lib/Globals.js';
import Config from '../shared/lib/Config.js';
import Store from '../shared/lib/Store/index.js';
import GeneratorServer from './lib/GeneratorServer/index.js';
import ImageServer from './lib/ImageServer/index.js';

class Server extends MODULECLASS {
    constructor() {
        super();
        return new Promise((resolve, reject) => {
            this.app = this;

            new Config(this)
                .then(config => {
                    this.config = config;
                    return new Store(this);
                })
                .then(store => {
                    this.store = store;
                    return new GeneratorServer(this);
                })
                .then(generatorserver => {
                    this.generatorserver = generatorserver;
                    return new ImageServer(this);
                })
                .then(imageserver => {
                    this.imageserver = imageserver;
                    resolve(this);
                });
        });
    }
}

global.SERVER = await new Server();

