import { Task, TaskEnum } from "types/taskCenter";

// Task Center is a singleton that manages all the tasks in the game.
// Data structure: Queue
export const taskCenter = (() => {
    const taskCenter: Task[] = [];

    return {
        executeTasks: () => {
            let dispatchNum = taskCenter.length;
            while (dispatchNum > 0) {
                const task = taskCenter.shift();
                if (task) task.handler();
                dispatchNum--;
            }
        },
        list: () => taskCenter,
        add(props: { tasktype: TaskEnum, targetId?: string, handler: Function, priority?: number; }) {
            const { tasktype, targetId, handler, priority = 0 } = props;
            const id = 'task' + Game.time;
            const task: Task = { id, type: tasktype, targetId, priority, handler };
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
        getTaskByType(type: TaskEnum) {
            return taskCenter.filter(task => task.type === type);
        },
    };
})();
