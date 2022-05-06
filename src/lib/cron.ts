import chalk from 'chalk';
import schedule from 'node-schedule';

let running: string[] = [];

const scheduleCron = async (
  syncFunction: () => Promise<void>,
  cronName: string,
  rule?: schedule.RecurrenceRule | string,
) => {
  try {
    schedule.scheduleJob(rule || '* * * * *', async () => {
      if (running.includes(cronName)) return;

      running.push(cronName);
      console.log(
        `${chalk.magenta('[CRON]')} Started syncing ${chalk.cyan(cronName)}.`,
      );
      await syncFunction();
      console.log(
        `${chalk.magenta('[CRON]')} Finished syncing ${chalk.cyan(cronName)}.`,
      );
      running = running.filter((name) => name !== cronName);
    });
  } catch (err) {
    running = running.filter((name) => name !== cronName);
    console.log(chalk.red(err));
  }
};

export default scheduleCron;
