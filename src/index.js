import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import route from "./route";
import "dotenv/config";
import { mqttPublish, mqttSubscribe } from "./services/mqtt";
import socketIO from "socket.io";
import swagger from "./swagger.json";

// mqttPublish();
// mqttSubscribe();

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

app.get("/api/swagger", (req, res) => {
  res.json(swagger);
});

app.use("/apis/v1", route);

server.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
