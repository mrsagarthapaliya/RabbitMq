const { consumerTask } = require("./services/consumerTask");

const consumers = 6; // define the maximum number of consumers

const runTask = async () => {
    console.time('queueExecutionTime');

    const taskPromises = [];

    for (let i = 1; i <= consumers; i++) {
        taskPromises.push(consumerTask(i)); // Create an array of task promises
    }

    try {
        console.log(`${consumers} consumers have completed the task`);
        await Promise.all(taskPromises); // Wait for all tasks to complete
        console.log()
    } catch (error) {
        console.error('An error occurred:', error);
    }
    console.timeEnd('queueExecutionTime');
};

runTask();
