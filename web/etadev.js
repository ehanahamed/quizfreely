import { readdir } from 'node:fs';

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const path = require('node:path');

import { Eta } from "eta";
const eta = new Eta({
  tags: [
    "<etadev>",
    "</etadev>"
  ],
  views: path.join(import.meta.dirname, "views"),
  defaultExtension: ".html"
})

function renderDir(dir) {

}

readdir(
    path.join(import.meta.dirname, "templates"),
    {
        encoding: "utf-8",
        recursive: true
    },
    function (error, files) {
        if (error) {
            console.error(error);
        } else {
            for (var i = 0; i < files.length; i++) {
                if (files[i].endsWith(".eta")) {
                    console.log(files[i])
                }
            }
        }
    }
)
