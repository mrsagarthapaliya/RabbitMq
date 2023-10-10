const { consumerTask } = require("./services/consumerTask")

const consumers = 6; // define the maximum number of consumers

const runTask = async () => {

    const taskPromises = []

    for (let i = 1; i <= consumers; i++) {
        taskPromises.push(consumerTask(i)) // Create an array of task promises
    }

    try {
        console.time('queueExecutionTime')
        await Promise.all(taskPromises) // Wait for all tasks to complete
        console.log(`${consumers} consumers have completed the task`)
        console.timeEnd('queueExecutionTime')
    } catch (error) {
        console.error('An error occurred:', error)
    }
};

runTask();
