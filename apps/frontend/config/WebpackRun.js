import webpack from 'webpack';
import WebpackDevServer from "webpack-dev-server";

export default class WebpackRun {
    constructor(parent) {
        this.parent = parent;
        this.bundler = false;
        this.server = false;
    }

    run() {
        this.config = this.parent.config;
        this.parent.config.mode === 'development' ? this.runDev() : this.runProd();
    }

    runDev() {
        this.port = this.config.devServer.port;
        this.host = this.config.devServer.host;
        this.server = new WebpackDevServer(this.config.devServer, webpack(this.config));
        this.server.listen(this.port, this.host, err => {
            err ? console.log(err) : null;
            console.log('WebpackDevServer listening at:', this.port, ':', this.host);
        });
    }

    runProd() {
        this.bundler = webpack(this.config, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log('>>> ERROR: ', err, stats);
            }
        });
    }
}
