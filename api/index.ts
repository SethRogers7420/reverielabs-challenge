import http from "http";
import { app } from "./routes";

const PORT = 7000;

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running at port: ${PORT}`));
