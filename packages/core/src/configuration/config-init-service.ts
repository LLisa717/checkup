import CheckupConfigService from './checkup-config-service';
import { CheckupConfig, CheckupConfigFormat, ConfigMapper } from '../types';
import addPlugin from './mappers/add-plugin';
import getInitializationConfigLoader from './loaders/get-initialization-loader';
import CosmiconfigService from './cosmiconfig-service';

type QuestionNames = typeof ConfigInitService.questions[number]['name'];
type Answers = Record<QuestionNames, string>;

export default class ConfigInitService {
  public static readonly questions = <const>[
    {
      name: 'framework',
      message: 'Which framework do you use?',
      type: 'list',
      choices: ['Ember', 'Other'],
    },
    {
      name: 'format',
      message: 'What format do you want your config file to be in?',
      type: 'list',
      choices: Object.keys(CheckupConfigFormat),
    },
  ];
  private static readonly answerChoicesToConfigMapper = {
    framework: {
      Ember: addPlugin('@checkup/plugin-ember'),
      Other: (config: CheckupConfig) => config,
    },
  };
  private readonly answers: Answers;
  private readonly configServicePromise: Promise<CheckupConfigService>;
  private readonly packageInstallationStrategy: (packages: string[]) => any;

  constructor(
    filepath: string,
    answers: Answers,
    packageInstallationStrategy: (packages: string[]) => Promise<void>
  ) {
    const format = answers.format as CheckupConfigFormat;
    this.answers = answers;
    this.packageInstallationStrategy = packageInstallationStrategy;
    this.configServicePromise = new CosmiconfigService()
      .search(filepath)
      .then(configResult => {
        if (configResult !== null) {
          throw new Error(
            `Cannot initialize checkup config file, checkup config file already found at ${configResult.filepath}`
          );
        }
      })
      .then(() => CheckupConfigService.load(getInitializationConfigLoader(filepath, format)))
      .then(configContainer => configContainer.map(...this.getConfigMappers()));
  }

  async writeConfig() {
    const configService = await this.configServicePromise;
    await this.packageInstallationStrategy(configService.get().plugins);
    configService.write();
  }

  private getConfigMappers() {
    return (Object.entries(ConfigInitService.answerChoicesToConfigMapper) as [
      QuestionNames,
      Record<string, ConfigMapper>
    ][]).map(([answerKey, choicesToLoaderMap]) => choicesToLoaderMap[this.answers[answerKey]]);
  }
}
