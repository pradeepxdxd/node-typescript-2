import * as  JobScheduler from 'node-schedule';

export class Email {
    static runEmailJobs(){
        this.sendEmailJob();
    }
    
    static sendEmailJob() {
        // JobScheduler.scheduleJob('send email job', '* * * * * *', () => {
        //     console.log('sent email in every seconds');
        // })
    }
}