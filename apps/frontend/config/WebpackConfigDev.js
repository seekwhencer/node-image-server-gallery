import path from 'path';
import WebpackConfigClass from './WebpackConfigClass.js';
import StyleLintPlugin from "stylelint-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";

class WebpackDev extends WebpackConfigClass {
    constructor(options) {
        super();

        this.options = options | {silent: false}
        this.proxyTargetHost = process.env.PROXY_TARGET_HOST || 'localhost';
        this.proxyTargetPort = process.env.PROXY_TARGET_PORT || '3050';
        this.proxyPort = parseInt(process.env.VIRTUAL_PORT) || 9000;

        this.build();
        this.merge();
        !this.options.silent ? this.run() : false;
    }

    build() {
        this.config = {
            entry: {
                app: ['./src/app.js', './src/scss/app.scss']
            },

            target: 'web',
            mode: 'development',

            devtool: 'eval-source-map',

            output: {
                path: `${this.appPath}/dist/dev`,
                filename: './js/[name].js',
                hotUpdateChunkFilename: `../../../.hot/hot-update.js`,
                hotUpdateMainFilename: `../../../.hot/hot-update.json`
            },

            optimization: {
                removeAvailableModules: false,
                removeEmptyChunks: false,
                splitChunks: false,
            },

            plugins: [
                new ESLintPlugin({
                    extensions: 'js',
                    emitWarning: true,
                    files: path.resolve(this.appPath, './src'),
                }),
                new StyleLintPlugin({
                    configFile: path.resolve(this.appPath, '../../.stylelintrc'),
                    files: path.join('src', '**/*.s?(a|c)ss'),
                }),
            ],
            module: {
                rules: [
                    {
                        test: /\.html?$/,
                        loader: "template-literals-loader"
                    },
                    {
                        test: /\.scss$/,
                        use: [
                            {
                                loader: "style-loader",
                                /*options: {
                                    injectType: "linkTag"
                                }*/
                            },
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].css',
                                    outputPath: '../../dist/dev/css/'
                                }
                            },
                            {
                                loader: 'sass-loader',
                                options: {
                                    sourceMap: true,
                                },
                            }
                        ],
                    }
                ],
            },

            watchOptions: {
                aggregateTimeout: 300,
                poll: 300,
                ignored: /node_modules/,
            },

            devServer: {
                static: [{
                    directory: `${this.appPath}/public`,
                }, {
                    directory: `${this.appPath}/dist/dev`,
                }],
                compress: false,
                host: '0.0.0.0',
                port: this.proxyPort,
                allowedHosts: 'all',
                headers: {
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "Origin, Accept, X-Requested-With, Content-Type, Authorization",
                    "Access-Control-Allow-Origin": "*",
                },
                watchFiles: ['src/scss/**/*.scss', 'src/js/**/*.js'],
                hot: false,
                devMiddleware: {
                    writeToDisk: true,
                    index: `${this.appPath}/public/dev.html`,
                    publicPath: '/'
                },
                proxy: {
                    context: () => true,
                    target: `http://${this.proxyTargetHost}:${this.proxyTargetPort}`,
                    bypass: (req, res, proxyOptions) => {
                        if (req.path === '/') {
                            console.log('>>>> WEBPACK PROXY SKIPPING REQUEST', req.path);
                            return '/dev.html';
                        }
                    }
                }
            }
        };
    }
}

// run it
new WebpackDev();

