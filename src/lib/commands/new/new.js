const fs = require('fs');
const yaml = require('node-yaml');
const {
    writeSync
} = require('node-yaml');
const exec = require('child_process').execSync;
const path = require('path');

export class NewCommand {
    constructor(name, path) {
        this.name = name;
        this.path = path;
    }

    run() {
        // Get users details
        fs.readFile(path.resolve(__dirname, 'config.json'), 'utf-8', (err, data) => {
            if (err) {
                console.log('Something went wrong');
            } else {
                const obj = JSON.parse(data);
                this.homesteadPath = obj.yamlpath;
                this.hostsPath = obj.hostspath;
                this.homesteadDirectory = obj.homesteadDirectory;
                this.homesteadDisc = obj.homesteadDirectory.split('/')[0] + '/';

                // Run everything
                this.writeHomesteadYaml();
                this.writeHostsFile();
                this.provisionHomestead();
            }
        });
    }

    writeHomesteadYaml() {
        console.log('Writing homestead.yaml')
        // Construct new homestead.yaml file
        let fileData = null;
        try {
            fileData = yaml.readSync(this.homesteadPath, {
                encoding: 'utf-8'
            });

            if (!fileData.sites) {
                fileData.sites = [
                    {
                        map: `${this.name}.lcl`,
                        to: `/home/vagrant/${this.path}`
                    }
                ];
            } else {
                fileData.sites.push({
                    map: `${this.name}.lcl`,
                    to: this.path
                });
            }

        } catch (e) {
            console.error("Could not find homestead.yaml");
            process.exit();
        }

        // Write the new site to homestead.yaml
        writeSync(this.homesteadPath, fileData, "utf-8", (err) => {
            if (err) {
                console.error("Failed writing homestead.yaml");
                process.exit();
            } else {
                console.log("Finish writing homestead.yaml")
            }
        })
    }

    writeHostsFile() {
        console.log("Writing hosts file");
        let content = `\n 192.168.10.10 ${this.name}.lcl`;

        fs.appendFileSync(this.hostsPath, content, (err) => {
            if (err) {
                console.error("Failed writing hosts file");
                process.exit();
            } else {
                console.log("Finish writing hosts file");
            }
        })
    }

    provisionHomestead() {
        console.log("Start provisioning homestead");
        exec(`cd ${this.homesteadDirectory} & vagrant reload --provision`, (error, stdout, stderr) => {
            if (stderr) {
                console.error(stderr);
                process.exit();
            } else if (error) {
                console.error("Failed provisioning homestead");
                process.exit();
            } else {
                console.log("Finish provisioning homestead");
            }
        })
    }
}