import { Database } from "./Database";
import { Email } from "./Email";

export class Jobs {
    static runRequiredJobs(){
        Email.runEmailJobs();
        Database.runDatabaseJobs();
    }
}