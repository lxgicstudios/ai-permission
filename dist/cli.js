#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ora_1 = __importDefault(require("ora"));
const index_1 = require("./index");
const program = new commander_1.Command();
program
    .name("ai-permission")
    .description("Generate RBAC permission configs from your routes")
    .version("1.0.0")
    .argument("[directory]", "Routes directory to scan", ".")
    .action(async (directory) => {
    const spinner = (0, ora_1.default)("Scanning routes...").start();
    try {
        const routeCode = await (0, index_1.scanRoutes)(directory);
        if (routeCode.length === 0) {
            spinner.warn("No route files found.");
            return;
        }
        spinner.text = `Generating RBAC config from ${routeCode.length} file(s)...`;
        const rbac = await (0, index_1.generateRBAC)(routeCode);
        spinner.succeed("RBAC Config Generated:");
        console.log(`\n${rbac}`);
    }
    catch (err) {
        spinner.fail(`Error: ${err.message}`);
        process.exit(1);
    }
});
program.parse();
