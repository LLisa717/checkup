import { SearchPatterns, TaskContext } from './types/tasks';

import BaseTask from './base-task';
import FileSearcher from './searchers/file-searcher';

/**
 * @class FileSearcherTask
 * @augments Task
 * @implements ITask
 *
 * A checkup task specific to file searcher used to encapsulate an operation that
 * checks certain characteristics of your Ember project.
 */
export default abstract class FileSearcherTask extends BaseTask {
  searcher: FileSearcher;

  /**
   *
   * @param result {TaskResult[]} the result object that aggregates data together for output.
   * @param searchPatterns {SearchPatterns} the search pattern that your FileSearcher uses to return the results.
   */
  constructor(pluginName: string, context: TaskContext, searchPatterns: SearchPatterns) {
    super(pluginName, context);

    this.searcher = new FileSearcher(context.cliArguments.path, searchPatterns);
  }
}
