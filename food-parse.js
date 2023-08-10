"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
// Mapping file
let mappings = new Map();
mappings.set("Coffee, Prepared From Grounds", "Coffee");
mappings.set("Butter, salted, organic", "Butter");
mappings.set("Black Pepper, Ground", "Pepper");
mappings.set("Sainsbury's Organic Mixed Herbs", "Mixed herbs");
mappings.set("Egg, whole, raw, fresh, organic free range woodland", "Egg");
mappings.set("Whole Wheat Bread, Store Bought", "Wholemeal bread");
mappings.set("Arugula, Raw", "Rocket");
mappings.set("Goat Cheese, Semi-Soft", "Goats cheese");
mappings.set("Apple, Fresh, Without Skin", "Apple");
mappings.set("Mixed Nuts, with Peanuts, Dry Roasted, Unsalted", "Mixed nuts");
mappings.set("Yogurt, Plain, Whole Milk", "Yogurt");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
// get the most recent servings file
const folderPath = '/home/david/Downloads';
let files = fs_1.default.readdirSync(folderPath);
let mostRecentFile = "";
let mostRecentTime;
for (let file of files) {
    let filePath = folderPath + "/" + file;
    if (file.startsWith("servings") && file.endsWith(".csv")) {
        let stats = fs_1.default.statSync(filePath);
        let modified = new Date(stats.mtime);
        if (mostRecentTime == undefined || mostRecentTime < modified) {
            mostRecentFile = filePath;
            mostRecentTime = modified;
        }
        // console.log(file + ": " + modified);
    }
}
console.log("most recent: " + mostRecentFile);
// read the contents
const contents = fs_1.default.readFileSync(mostRecentFile, 'utf-8');
const lines = contents.split(/\r?\n/);
let output = new Array();
for (let line of lines) {
    // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
    let matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (matches != null) {
        let foodName = matches[3].replaceAll('"', '');
        if (mappings.has(foodName)) {
            if (mappings.get(foodName) !== undefined) {
                foodName = mappings.get(foodName);
            }
        }
        let foods = foodName
            + " ("
            + matches[4].replaceAll(' ', '').replaceAll('"', '')
            + " "
            + matches[1].replaceAll('"', '')
            + ")";
        console.log(foods);
        if (!foods.startsWith("Name")) {
            output.push(foods);
        }
    }
}
try {
    fs_1.default.writeFileSync('foods.txt', output.join("\n"));
    // file written successfully
}
catch (err) {
    console.error(err);
}
