const fs = require('fs');
const path = require('path')

export class SetCommand {
  constructor(item, value) {
    this.item = item;
    this.value = value;
  }

  run() {
    fs.readFile(path.resolve(__dirname, 'config.json'), 'utf-8', (err, data) => {
      if (err) {
        console.log('Something went wrong');
      } else {
        let obj = JSON.parse(data);
        switch (this.item) {
          case 'yaml-file':
            obj['yamlpath'] = this.value;
            break;
          case 'hosts-file':
            obj['hostspath'] = this.value;
            break;
          case 'homestead-dir':
            obj['homesteadDirectory'] = this.value;
            break;
          default:
            console.log('item could not be found');
            return;
        }

        fs.writeFileSync(path.resolve(__dirname, 'config.json'), JSON.stringify(obj), 'utf-8');
        console.log(`${this.item} set to ${this.value}`);
      }
    })
  }
}