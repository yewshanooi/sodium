import chalk from 'chalk';
export function MongoDBEvents(mongoose) {

    mongoose.connection.on('connecting', () => {
        console.log(`${chalk.greenBright.bold('[MongoDB] Connecting to database')}`);
    }).on('connected', () => {
        console.log(`${chalk.greenBright.bold('[MongoDB] Successfully connected to database')}`);
    }).on('disconnected', () => {
        console.log(`${chalk.redBright.bold('[MongoDB] Error: Disconnected from database')}`);
    }).on('error', err => {
        console.log(`${chalk.redBright.bold('[MongoDB] Error: There was a problem connecting to database')}\n`, err);
});
}