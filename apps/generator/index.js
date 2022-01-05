import './lib/Globals.js';
import Config from '../shared/lib/Config.js';
import Store from '../shared/lib/Store/index.js';
import GeneratorClient from './lib/GeneratorClient.js';

class Generator extends MODULECLASS {
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
                    return new GeneratorClient(this);
                })
                .then(generatorclient => {
                    this.generatorclient = generatorclient;
                    resolve(this);
                });
        });
    }
}

global.GENERATOR = await new Generator();
