import launcher from "@httptoolkit/browser-launcher";
import { spawn } from "child_process";

class Browser {
  constructor(name) {
    if (!name) throw new Error("Name is required");

    this.name = name;
    this.pid = null;
    this.started = false;
    this.serviceExists = false;
    this.instance = null;
    this.startedUrl = null;
  }

  isRunning() {
    return !!this.instance;
  }

  isAvailable() {
    return new Promise((resolve) => {
      try {
        launcher.detect((browsers) => {
          resolve(!browsers.find((ev) => ev.name == this.name));
        });
      } catch (error) {
        resolve(false);
      }
    });
  }

  start(url) {
    this.stop();

    this.startedUrl = url;

    return new Promise((resolve, reject) => {
      launcher((error, launch) => {
        if (error) reject(error);
        launch(url, { browser: this.name }, (error, instance) => {
          if (error) reject(error);
          this.instance = instance;
          resolve();
        });
      });
    });
  }

  cleanUp() {
    this.stop();

    return new Promise((resolve, reject) => {
      var bat = require.resolve(`../cleanup/${this.name}.cleanup.bat`);
      var ls = spawn(bat);

      ls.stdout.on("data", function (data) {
        console.log("stdout: " + data);
      });

      ls.stderr.on("data", function (data) {
        console.log("stderr: " + data);
        reject(new Error(data));
      });

      ls.on("exit", function (code) {
        console.log("child process exited with code " + code);
        resolve();
      });
    });
  }

  stop() {
    if (this.isRunning()) return this.instance.stop();
  }
}

export default Browser;
