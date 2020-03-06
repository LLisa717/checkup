import { CheckupConfigFormat, ConfigInitService } from '../../src';
import * as path from 'path';
import * as fs from 'fs';
import { CheckupProject } from '@checkup/test-helpers';

describe('config-init-service', () => {
  let project: CheckupProject;

  beforeEach(() => {
    project = new CheckupProject('test');
  });

  afterEach(() => {
    project.dispose();
  });

  it('should write a config given default answers', async () => {
    project.writeSync();
    await new ConfigInitService(
      project.baseDir,
      {
        framework: 'Other',
        format: CheckupConfigFormat.JSON,
      },
      jest.fn().mockResolvedValue(undefined)
    ).writeConfig();

    expect(fs.readFileSync(path.join(project.baseDir, '.checkuprc'), 'utf8')).toMatchSnapshot();
  });

  it('should write a config given Ember framework', async () => {
    project.writeSync();
    await new ConfigInitService(
      project.baseDir,
      {
        framework: 'Ember',
        format: CheckupConfigFormat.JSON,
      },
      jest.fn().mockResolvedValue(undefined)
    ).writeConfig();

    expect(fs.readFileSync(path.join(project.baseDir, '.checkuprc'), 'utf8')).toMatchSnapshot();
  });
});
