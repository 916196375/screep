import { operationTaskHandler } from "taskCenter/operationTaskCenter";
import { taskHandler } from "taskCenter/utils";
import { Task, TaskType } from "types/taskCenter";

// Task Center is a singleton that manages all the tasks in the game.
// Data structure: Queue
export const taskCenter = (() => {
    const taskCenter: Task[] = [];

    return {
        executeTasks: () => {
            let dispatchNum = taskCenter.length;
            console.log('dispatchNum', dispatchNum);
            while (dispatchNum > 0) {
                const task = taskCenter.shift()!;
                console.log('taskCenter', taskCenter);
                console.log('taskHandler', JSON.stringify(taskHandler));
                console.log('task.type', task.type);
                console.log('taskHandler[task.type]', taskHandler[task.type]);
                // taskHandler[task.type](task.props);
                taskHandler?.[task.type as keyof typeof operationTaskHandler]?.(task.props);
                dispatchNum--;
            }
        },
        list: () => taskCenter,
        add(props: { tasktype: TaskType, targetId?: string, priority?: number; props?: Record<string, unknown>; }) {
            const { tasktype, targetId, priority = 0 } = props;
            const id = 'task' + Game.time;
            const task: Task = { id, type: tasktype, targetId, priority, props: props.props ?? {} };
            if (priority === 0) {
                taskCenter.push(task);
            } else {
                const index = taskCenter.findIndex(task => task.priority < priority);
                if (index === -1) {
                    taskCenter.push(task);
                } else {
                    taskCenter.splice(index, 0, task);
                }
            };
            return id;
        },
        cancel(id: string) {
            const index = taskCenter.findIndex(task => task.id === id);
            if (index !== -1) taskCenter.splice(index, 1);
        },
        clear() {
            taskCenter.splice(0, taskCenter.length);
        },
        getTaskById(id: string) {
            return taskCenter.find(task => task.id === id);
        },
        getTaskByType(type: TaskType) {
            return taskCenter.filter(task => task.type === type);
        },
    };
})();
