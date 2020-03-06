import { ConfigMapper } from '../../types';

const addPlugin: (pluginName: string) => ConfigMapper = (pluginName: string) => config => {
  config.plugins.push(pluginName);
  return config;
};

export default addPlugin;
