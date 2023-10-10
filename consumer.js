const { consumerTask } = require("./services/consumerTask")


for (let i = 1; i <= 6; i++) {

    consumerTask(i)

}
