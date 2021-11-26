#!/usr/bin/env node

const minimist = require("minimist");
const { pack } = require('../dist');

const args = minimist(process.argv.slice(2));

const targets = args._;

for (const target of targets) {
  pack()
}