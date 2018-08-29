const ora = require("ora");
const path = require('path');
const fs = require("fs");
const fse = require("fs-extra");
const prettyMs = require("pretty-ms");
const inquirer = require('inquirer');
const chalk = require('chalk');
const now = require('performance-now');
const {forEach} = require('p-iteration');

module.exports = {
	apply(){
		cogear.on('generators.site',async()=>{
			await this.generate()
		})
	},
	async generate(){
		let start,
				sitename,	
				sitepath,
				repo,
				loader,
				answers;
		debugger
		if(cogear.options.y && cogear.options._[1]){
			sitename = cogear.options._[1]
		}
		else {
			let questions = require('./questions/site.js')()
			try {
				answers  = await inquirer.prompt(questions);
			} catch (e) { console.error(e.message) }
			sitename = answers.sitename
		}
		sitename = sitename.toLowerCase().replace(/[^a-z\._-]/,'')
		sitepath = path.join(process.cwd(),sitename)
		start = now()
		loader = ora("Crafting new site...").start()
		debugger
		if(fs.existsSync(sitepath)){
				loader.fail(`Target directory exists.
${chalk.yellow('Try to change site name or remove the directory.')}
`)
		}		
		debugger
		fse.ensureDirSync(sitepath);
		await forEach([
						path.join(cogear.baseDir,'lib','plugins','generators','templates','site','src'),
						path.join(cogear.baseDir,'lib','plugins','generators','templates','site','config.yaml'),
						path.join(cogear.baseDir,'lib','plugins','generators','templates','site','themes')
						// path.join(cogear.baseDir,'.gitignore')
					],(dirfile)=>{
						try {
							fse.copySync(
								dirfile,
								path.join(
									sitepath,
									path.basename(dirfile)
								)
							)
						} catch (err) {
							console.error(err)
						}
					})

		loader.succeed(`New site is crafted in ${prettyMs(now() - start)}.\n
💡 ${chalk.underline.whiteBright('Next steps:')}
${chalk.bold('1.')} Open dir:
> cd ${chalk.bold('./'+sitename)} 
${chalk.bold('2.')} Run in development mode (w/hot-reload):
> ${chalk.bold('cogear')}
${chalk.bold('3.')} Site will be opened in browser after build is done.

📙 Read the docs: https://cogearjs.org/docs`)	
	}
}