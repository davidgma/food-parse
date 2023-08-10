import fs from 'fs';
import clipboard from 'clipboardy';

// Mapping file
let mappings = new Map<string, string>();
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
mappings.set("Duck, Goose or Wild Fowl Fat", "Duck fat");
mappings.set("Cream, fluid, heavy whipping, organic", "Cream");
mappings.set("Pork, Ground, 96% Lean, 4% Fat, Raw", "Minced pork");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");

// get the most recent servings file
const folderPath = '/home/david/Downloads';

let files: Array<string> = fs.readdirSync(folderPath);

let mostRecentFile: string = "";
let mostRecentTime;

for (let file of files) {
    let filePath = folderPath + "/" + file;
    if (file.startsWith("servings") && file.endsWith(".csv")) {
        let stats = fs.statSync(filePath);
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
const contents = fs.readFileSync(mostRecentFile, 'utf-8');
const lines = contents.split(/\r?\n/);
let output = new Array<string>();

for (let line of lines) {
    // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
    let matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (matches != null) {
        let foodName = matches[3].replaceAll('"', '');
        if (mappings.has(foodName)) {
            if (mappings.get(foodName) !== undefined) {
                foodName = <string>mappings.get(foodName);
            }
        }
        let foods = foodName
            + " ("
            + matches[4].replaceAll(' ', '').replaceAll('"', '')
            + " "
            + matches[1].replaceAll('"', '')
            + ")"
        console.log(foods);
        if (!foods.startsWith("Name")) {
            output.push(foods);
        }
    }
}

// Write to a file
try {
    fs.writeFileSync('foods.txt', output.join("\n"));
    // file written successfully
} catch (err) {
    console.error(err);
}

// Write to the clipboard
clipboard.writeSync(output.join("\n"));

