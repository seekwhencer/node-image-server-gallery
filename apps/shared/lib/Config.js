import Module from './Module.js';
import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';

export default class Config extends Module {
    constructor() {
        super();

        return new Promise((resolve, reject) => {
            this.label = 'CONFIG';
            this.configData = {};

            LOG(this.label, 'INIT');

            this.path = path.resolve(`${APP_DIR}/../../config`);
            this.configFile = `${this.path}/${ENVIRONMENT}.conf`;

            this.loadAppConfig()
                .then(() => {
                    this.mergeOverrides();
                    this.expandArrays();
                    this.convertTypes();
                    this.setConfigToGlobalScope();

                    LOG(this.label, 'LOADED');
                    resolve(this);
                });
        });
    }

    /**
     * load the config file
     * @returns {Promise<T>}
     */
    loadAppConfig() {
        return fs.readFile(this.configFile)
            .then(configData => {
                this.configData = dotenv.parse(configData);
            })
            .catch(err => {
                ERROR(this.label, err);
            });
    }

    /**
     * merge with environment variables
     */
    mergeOverrides() {
        Object.keys(this.configData).forEach(k => process.env[k] ? this.configData[k] = process.env[k] : false);
    }

    /**
     * expand comma separated values to an array
     */
    expandArrays() {
        const envKeys = Object.keys(this.configData);
        envKeys.forEach(k => {
            const split = this.configData[k].split(',');
            if (split.length > 1) {
                const arrayData = [];
                split.forEach(s => {
                    arrayData.push(s.trim());
                });
                this.configData[k] = arrayData;
            }
        });
    }

    /**
     * convert data types from string to boolean or integer (at the moment)
     */
    convertTypes() {
        const types = {
            'boolean': [
                'STORE_LOAD_TREE_ON_STARTUP',
                'GENERATOR_NETWORK'
            ],
            'int': [
                'SERVER_PORT',
                'STORE_THUMBNAIL_PATH_SPLIT_DIGITS',
                'STORE_THUMBNAIL_PATH_SPLIT_COUNT',
                'GENERATOR_SERVER_PORT',
                'GENERATOR_CLIENT_PORT',
                'GENERATOR_CLIENT_RECONNECT_IDLE',
                'GENERATOR_CLIENT_MAX_THREADS',
                'DIGGER_START_INDEX',
                'DIGGER_MAX_CONCURRENT_JOBS'
            ]
        };

        types.boolean.forEach(t => this.configData[t] === 'true' ? this.configData[t] = true : this.configData[t] = false);
        types.int.forEach(t => this.configData[t] = parseInt(this.configData[t]));
    }

    setConfigToGlobalScope() {
        Object.keys(this.configData).forEach(k => global[k] = this.configData[k]);
    }

}
