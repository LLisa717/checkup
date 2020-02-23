import { Task, TaskResult, getRegisteredTasks, registerTask } from '@checkup/core';

class TestTask implements Task {
  static taskName: string = 'Test';

  async run(): Promise<TaskResult> {
    return Promise.resolve({
      toConsole() {},
      toJson() {
        return {};
      },
    });
  }
}

describe('@checkup/core tasks', () => {
  it('Returns no tasks if none have been registered', () => {
    expect(Array.from(getRegisteredTasks().keys())).toHaveLength(0);
  });

  it('Can add a single task via registerTask', () => {
    registerTask(TestTask.taskName, TestTask);

    expect(Array.from(getRegisteredTasks().keys())).toHaveLength(1);
  });
});