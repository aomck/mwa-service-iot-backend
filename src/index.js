import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import route from "./route";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8000;

app.enable("trust proxy");
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/apis", route);

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
