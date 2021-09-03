import schedule from 'node-schedule';

let running: string[] = [];

const scheduleCron = async (
  syncFunction: () => Promise<void>,
  cronName: string,
) => {
  try {
    schedule.scheduleJob('* * * * *', async () => {
      if (running.includes(cronName)) return;

      running.push(cronName);
      console.log(`Started syncing ${cronName}.`);
      await syncFunction();
      console.log(`Finished syncing ${cronName}.`);
      running = running.filter((name) => name !== cronName);
    });
  } catch (err) {
    running = running.filter((name) => name !== cronName);
    console.log(err);
  }
};

export default scheduleCron;
