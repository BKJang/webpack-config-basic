// 개발 환경에서만 사용할 설정
const path = require('path');
const merge = require('webpack-merge');

/* 추가된 부분 시작 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
/* 추가된 부분 끝 */

const webpackConfigDev = {
    mode: 'development',

    // output을 여기서 정의하는 이유는 번들된 JS를 따로 하드디스크에 쓰지않고 메모리에 올려쓰기 위해서
    // 새로운 경로를 지정하기 때문이다.
    output: {
        path: path.resolve(__dirname, '../src/'),
        filename: 'bundle.js',
        publicPath: '/js'   // 빌드된 JS가 서빙될 path를 지정한다. html의 JS경로와 맞춰주도록 하자.
    },

    // CSS를 JS안에서 사용하기 위해 두 가지 로더를 추가한다.
    module: {
        rules: [{
            test: /\.css/,
            use: [
                'style-loader',
                'css-loader',
            ]
        }]
    },
    /* 추가된 부분 시작 */
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            filename: 'index.html',
            inject: false,
            alwaysWriteToDisk: true,
            staticResources: {
                js: '/js/bundle.js'
            }
        }),
        new HtmlWebpackHarddiskPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    /* 추가된 부분 끝 */

    // webpack-dev-server에서 사용할 옵션이다. 이 부분에 대한 설명은 공식문서를 참고하도록 하자.
    devServer: {
        hot: false,
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 3000,
        contentBase: path.resolve(__dirname, '../src'),
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        historyApiFallback: {
            rewrites: [
                { from: /.*/g, to: '/index.html' }
            ]
        }
    },

    // 소스맵을 지정한다.
    devtool: '#eval-source-map'
};

// webpack-merge를 이용하여 두가지 설정파일을 조합한다.
module.exports = merge(require('./webpack.config.common'), webpackConfigDev);