const program = require('commander');

import { NewCommand } from './commands/new/new';
import { SetCommand } from './commands/set/set';

program
    .version('1.0.0')
    .command('new <name>')
    .option('-p, --path <path>', 'The path to your project')
    .action((name, options) => {
        let newCommand = new NewCommand(name, options.path);
        newCommand.run();
    });

program
    .command('set <item> <value>')
    .action((name, value) => {
        let setCommand = new SetCommand(name, value);
        setCommand.run();
    })

program.parse(process.argv);