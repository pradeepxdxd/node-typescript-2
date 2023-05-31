import { getEnvironmentVariable } from "./environments/env";
import { Server } from "./server";

const PORT = getEnvironmentVariable().port;

const server = new Server().app;

server.listen(PORT, () => console.log(`Server is running on port :- ${PORT}`));
