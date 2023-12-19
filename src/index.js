import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import route from "./route";
import lora from "./route/lora";
import history from "./route/history";
import "dotenv/config";
import { checkUser } from "./middlewares";
import { checkDevice } from "./middlewares";
import { mqttPublish, mqttSubscribe, mqttServer } from "./services/mqtt";
import socketIO from "socket.io";
import { getDataInterval } from "./services/lora";
import { insert } from "./services/bigdata";
import swagger from "./swagger.json";

// mqttPublish();
// mqttSubscribe();
mqttServer();
// getDataInterval();
// insert("d_006", { suction_time: 20, flush_time: 60 });

const app = express();
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

export const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// app.enable("trust proxy");
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/apis", checkUser, route);
app.use("/apis", checkUser, route);
app.use("/lora-api", lora);
app.use("/history/:device_code", checkDevice, history);
app.get("/api/swagger", (req, res) => {
  res.json(swagger);
});

server.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
