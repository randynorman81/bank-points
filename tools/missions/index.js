/* loads every unit file that exists; each one registers its records with core.js */
const fs = require("fs"), path = require("path");
const core = require("./core.js");
fs.readdirSync(__dirname).filter((f) => /^u\d+-.*\.js$/.test(f)).sort().forEach((f) => require(path.join(__dirname, f)));
module.exports = core;
