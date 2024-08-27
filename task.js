

const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'task-log.txt');

async function task(user_id) {
    const logMessage = `${user_id} - task completed at - ${new Date().toISOString()}\n`;
    console.log(logMessage);

    fs.appendFileSync(logFilePath, logMessage); 
}

module.exports = task;

