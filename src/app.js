require("dotenv").config();

import logger from "morgan";
import router from "./router";
import express from "express";
import queryPaser from "./utils/queryPaser";

import { urlencoded, json } from "body-parser";

// global.APP_ROOT = process.cwd();

const app = express();

// app.set("trust proxy", 1); // trust first proxy

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(queryPaser);
app.use(router);

app.use("*", (_, res) => res.status(404).send(res, "Page not found"));

// listen for requests
app.listen(process.env.PORT, () =>
  console.log("Server is listening on port " + process.env.PORT)
);

app.addListener("close", (err) =>
  console.log("Port '" + process.env.port + "' not available: " + err)
);
