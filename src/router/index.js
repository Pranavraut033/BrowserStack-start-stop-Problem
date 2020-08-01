import { Router } from "express";
import Browser from "../model/Browser";

const router = new Router();

const browserInstances = new Map();

function getBrowser(req, res, next) {
  let { browser } = req.queryParams;

  if (!browser) return res.status(400).send("Missing browser name in params");

  var browserInstance;

  if (browserInstances.has(browser))
    browserInstance = browserInstances.get(browser);
  else {
    browserInstance = new Browser(browser);
    browserInstances.set(browser, browserInstance);
  }

  req.browser = browserInstance;
  next();
}

let failed = (res, err) =>
  res.status(400).send((err && err.message) || "failed");

router.get("/start/", getBrowser, async function (req, res) {
  let isAvailable = await req.browser.isAvailable();
  let { url = "http://www.google.com/" } = req.queryParams;

  if (isAvailable)
    return res.status(404).send("Browser is not available in local machine");

  req.browser
    .start(url)
    .then(() => res.send("started"))
    .catch((err) => failed(res, err));
});

router.get("/stop/", getBrowser, async function (req, res) {
  try {
    await req.browser.stop();
    res.send("stopped");
  } catch (error) {
    failed(res, err);
  }
});

router.get("/cleanup/", getBrowser, function (req, res) {
  req.browser
    .cleanUp()
    .then(() => res.send("ok"))
    .catch((err) => failed(res, err));
});

router.get("/geturl/", getBrowser, function (req, res) {
  res.send({ url: req.browser.startedUrl });
});

export default router;
