// Подключаем необходимые плагины и константы
const webpack =  require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || '/';

// Настройки для разработки
module.exports = {
    // Тип разработки
    mode: 'development',
    // Входной главный файл
    entry: './src/index.js',
    // настройка для вывода карты свойств
    devtool: 'inline-source-map',
    // настройки сервера разработки
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000
    },
    output: {
        publicPath: ASSET_PATH,
    },
    // настройка модулей
    module: {
        rules: [
            // обработка наблонизатора
            {
                test: /\.pug$/i,
                use: ['pug-loader']
            },
            // обработка для препроцессора
            {
                test: /\.scss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                include: path.join(__dirname, 'src'),
                use: 'file-loader'
            },
            // обработка шрифтов
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file-loader',
                options: {
                    type: 'asset',
                    name: 'fonts/[name].[ext]',
                    publicPath: './fonts'
                }
            }
        ]
    },
    // настройка плагинов
    plugins:[
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
          }),
        // очистка папки для продакшена
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false}),
        // генерация файлов HTML автоматически
        new HtmlWebpackPlugin({
            template: './src/index.pug'
        }),
        // минимизация css файлов
        new MiniCssExtractPlugin(),
        // копирование изображений и шрифтов в папку для продакшена
        new CopyPlugin({
            patterns: [
              { from: "./src/images", to: "images" },
              { from: "./src/fonts/", to: "fonts" }
            ],
          })
    ],
    // точки выхода. Файлы которые будут сгенерированы
    // output: {
    //     filename: '[name].[contenthash].js',
    //     path: path.resolve(__dirname, 'dist'),
    // },
    // оптимизация готовых файлов
    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
              },
            },
        }
    },
};