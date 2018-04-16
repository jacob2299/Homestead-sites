const fs = require('fs');
const yaml = require('node-yaml');
const {
    write
} = require('node-yaml');
const exec = require('child_process').exec;
const path = require('path');

export class NewCommand {
    constructor(name, hpath, homestead_path) {
        this.name = name;
        this.path = hpath;
    }

    run() {
        // Get users details
        fs.readFile(path.resolve(__dirname, '../../../data/config.json'), 'utf-8', (err, data) => {
            if (err) {
                console.log('there went something wrong');
            } else {
                const obj = JSON.parse(data);
                this.homesteadPath = obj.yamlpath;
                this.hostsPath = obj.hostspath;
                this.homesteadDirectory = obj.homesteadDirectory;
                this.homesteadDisc = obj.homesteadDisc;

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
            fileData.sites.push({
                map: `${this.name}.local`,
                to: this.path
            });
        } catch (e) {
            console.error("Could not find homestead.yaml");
        }

        // Write the new site to homestead.yaml
        write(this.homesteadPath, fileData, "utf-8", (err) => {
            if (err) {
                console.error("Failed writing homestead.yaml");
            } else {
                console.log("Finish writing homestead.yaml")
            }
        })
    }

    writeHostsFile() {
        console.log("Writing hosts file");
        let content = `\n 192.168.10.10 ${this.name}.local`;

        fs.appendFile(this.hostsPath, content, (err) => {
            if (err) {
                console.error("Failed writing hosts file");
            } else {
                console.log("Finish writing hosts file");
            }
        })
    }

    provisionHomestead() {
        console.log("Start provisioning homestead");
        let reloadCommand = exec(`${this.homesteadDisc} & cd ${this.homesteadDirectory} & vagrant reload --provision`, (error, stdout, stderr) => {
            if (stderr) {
                console.error(stderr);
            } else if (error) {
                console.error("Failed provisioning homestead");
            } else {
                console.log("Finish provisioning homestead");
            }
        })
    }
}