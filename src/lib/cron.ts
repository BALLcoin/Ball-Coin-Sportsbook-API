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
      console.log(`[CRON] Started syncing ${cronName}.`);
      await syncFunction();
      console.log(`[CRON] Finished syncing ${cronName}.`);
      running = running.filter((name) => name !== cronName);
    });
  } catch (err) {
    running = running.filter((name) => name !== cronName);
    console.log(err);
  }
};

export default scheduleCron;
