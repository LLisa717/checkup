import { Command } from '@oclif/command';
import * as inquirer from 'inquirer';
import { ConfigInitService } from '@checkup/core';
import { install } from 'lmify';

export default class ConfigInit extends Command {
  static description = 'initialize a checkup config file';

  static args = [
    {
      name: 'path',
      required: true,
      description: 'The path to create the configuration file in',
      default: '.',
    },
  ];

  async run() {
    const { args } = this.parse(ConfigInit);
    const answers = await inquirer.prompt(ConfigInitService.questions);
    const configInitService = new ConfigInitService(
      args.path,
      answers,
      install as (packages: string[]) => Promise<void>
    );

    await configInitService.writeConfig();
  }
}
