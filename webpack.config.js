//const { CheckerPlugin, TsConfigPathsPlugin } = require('awesome-typescript-loader');
const path = require('path');

module.exports = {
	entry: './src/bootstrap.ts',
	output: {
		filename: 'build/bundle.js'
	},
	devServer: {
		host: "0.0.0.0",
		port: 3080,
		contentBase: "./src",
		proxy: {
			'/api': {
				target: 'http://0.0.0.0:2081',
				secure: false
			}
    	}
	},
	devtool: '#sourcemap',
	stats: {
		colors: true,
		reasons: true
	},
	watchOptions: {
		poll: true
	},
	resolve: {
		modules: [path.resolve(__dirname, "src"), "node_modules"],
		extensions: ['.ts', '.js', '.tsx']
	},
	module: {
		loaders: [{
			test: /\.tsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'ts-loader'
			//loader: 'awesome-typescript-loader'
		}]
	},
	// plugins: [
	// 	new CheckerPlugin(),
	// 	new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
	// ]
};