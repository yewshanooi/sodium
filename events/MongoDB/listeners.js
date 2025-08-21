const chalk = require('chalk');
const mongoose = require('mongoose');

module.exports = {
    name: 'mongodb',
    events: {
        connecting: () => {
            console.log(`${chalk.greenBright.bold('[MongoDB] Connecting to database')}`);
        },
        connected: () => {
            console.log(`${chalk.greenBright.bold('[MongoDB] Successfully connected to database')}`);
        },
        disconnected: () => {
            console.log(`${chalk.redBright.bold('[MongoDB] Error: Disconnected from database')}`);
        },
        error: (err) => {
            console.log(`${chalk.redBright.bold('[MongoDB] Error: There was a problem connecting to database')}\n`, err);
        }
    }
};
