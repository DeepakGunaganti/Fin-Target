

const Bull = require('bull');
const Redis = require('ioredis');
const task = require('./task');

const redisClient = new Redis();

const taskQueue = new Bull('taskQueue', {
    redis: {
        host: '127.0.0.1',
        port: 6379
    }
});

taskQueue.process(async (job) => {
    await task(job.data.user_id);
});

async function addToQueue(user_id) {
    const currentTime = Math.floor(Date.now() / 1000);
    const taskCountKey = `task_count:${user_id}`;
    const taskTimeKey = `task_time:${user_id}`;

    let taskCount = await redisClient.get(taskCountKey) || 0;
    let lastTaskTime = await redisClient.get(taskTimeKey) || currentTime;

   
    if ((currentTime - lastTaskTime) >= 60) {
        taskCount = 0;
        await redisClient.set(taskCountKey, 0);
    }

    if (taskCount < 20) {
        await redisClient.incr(taskCountKey);
        await redisClient.set(taskTimeKey, currentTime);
        await taskQueue.add({ user_id }, { delay: 1000 }); 
        return true;
    } else {
        return false; 
    }
}

module.exports = { addToQueue, taskQueue };
