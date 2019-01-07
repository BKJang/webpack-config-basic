// 빌드 환경에서만 사용할 설정
const path = require('path');
const merge = require('webpack-merge');

// Webpack Plugins.
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpackConfigCommon = require('./webpack.config.common');

// Fingerprint를 이용하여 JS/CSS file명 생성.
// 여기서는 timestamp 값을 이용한다.
const fingerprint = +new Date();
const jsFilename = `bundle.${fingerprint}.js`;
const cssFilename = `bundle.${fingerprint}.css`;

console.log('[PHASE]', process.env.PHASE); // phase 를 출력해보자

const webpackConfigProd = {
    mode: process.env.PHASE === 'alpha' ? 'development' : 'production',  // production mode를 사용하면 자동으로 uglify와 minify가 된다.
    output: {
        filename: jsFilename,
        path: path.resolve(__dirname, '../dist/js/') // JS file path를 지정한다.
    },
    // style-loader가 제가된 것을 볼 수 있다.
    // CSS 추출을 위해서 MiniCssExtractPlugin.loader를 사용한다.
    module: {
        rules: [{
            test: /\.css/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
            ]
        }]
    },
    plugins: [
        // Clean build를 위해 dist 폴더의 내용을 지운다.
        new CleanWebpackPlugin(['../dist'], {
            root: __dirname,
            allowExternal: true
        }),
        // ejs 템플릿의 JS/CSS 파일명을 치환한다.
        new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            filename: '../index.html',
            inject: false,
            staticResources: {
                js: `js/${jsFilename}`,
                css: `css/${cssFilename}`
            }
        }),
        // 이미지 파일을 복사한다.
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, '../src/img'),
                to: path.join(__dirname, '../dist/img')
            },
        ]),
        // CSS file을 dist폴더로 추출한다.
        new MiniCssExtractPlugin({
            filename: `../css/${cssFilename}`,
        })
    ]
};

module.exports = merge(webpackConfigCommon, webpackConfigProd);