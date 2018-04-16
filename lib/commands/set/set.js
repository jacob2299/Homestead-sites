const fs = require('fs');
const path = require('path')

export class SetCommand {
  constructor(item, value) {
    this.item = item;
    this.value = value;
  }

  run() {
    fs.readFile(path.resolve(__dirname, '../../../data/config.json'), 'utf-8', (err, data) => {
      if (err) {
        console.log('There went someting wrong');
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
          case 'homestead-disc':
            obj['homesteadDisc'] = this.value;
            break;
          default:
            console.log('item could not be found');
        }

        fs.writeFileSync(path.resolve(__dirname, '../../../data/config.json'), JSON.stringify(obj), 'utf-8');
      }
    })
  }
}