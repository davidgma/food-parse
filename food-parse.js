import fs from 'fs';
import clipboard from 'clipboardy';
class FoodEaten {
    name;
    weight;
    time;
    constructor(name, weight, time) {
        this.name = name;
        this.weight = weight;
        this.time = time;
    }
    toString() {
        return this.name + " (" + this.weight + " " + this.time + ")";
        // return this.name;
    }
}
function foodSort(food1, food2) {
    if (food1.time > food2.time) {
        return 1;
    }
    if (food1.time < food2.time) {
        return -1;
    }
    if (food1.name > food2.name) {
        return 1;
    }
    if (food1.name < food2.name) {
        return -1;
    }
    return 0;
}
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
mappings.set("Duck, Goose or Wild Fowl Fat", "Duck fat");
mappings.set("Cream, fluid, heavy whipping, organic", "Cream");
mappings.set("Pork, Ground, 96% Lean, 4% Fat, Raw", "Minced pork");
mappings.set("Peanut Butter, Chunk Style, with Salt", "Peanut butter");
mappings.set("Blackberries, Fresh", "Blackberries");
mappings.set("Salmon, Atlantic, Farmed", "Salmon");
mappings.set("Peanuts, Dry Roasted, Unsalted", "Peanuts");
mappings.set("Whole Wheat Bread, Homemade or Bakery", "Wholemeal bread");
mappings.set("Mixed Nuts, with Peanuts, Dry Roasted, Salted", "Nuts");
mappings.set("Sainsbury's, Sumac", "Sumac");
mappings.set("Fish, Salmon, Atlantic, Farmed", "Salmon");
mappings.set("Lamb, Australian, ground,  85% lean / 15% fat", "Lamb");
mappings.set("Mixed Nuts, without Peanuts, Salted", "Mixed Nuts");
mappings.set("Pork, Ground, 96% Lean, 4% Fat", "Pork mince");
mappings.set("Lentils, Pink or Red", "Red lentils");
mappings.set("Raspberries, Fresh, Red", "Raspberries");
mappings.set("Mixed Nuts, with Peanuts, Oil Roasted, Salted", "Mixed Nuts");
mappings.set("Fat, Duck", "Duck fat");
mappings.set("Cabbage, Red", "Red cabbage");
mappings.set("Zucchini", "Courgette");
mappings.set("Chicken, roasting, light meat, meat only, cooked, roasted", "Chicken");
mappings.set("Arugula", "Rocket");
mappings.set("Tomato Raw, Includes Cherry, Grape, Roma", "Tomatoes");
mappings.set("Onion, White, Yellow or Red", "Onion");
mappings.set("Brie Cheese", "Brie");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
mappings.set("", "");
let endings = new Array();
endings.push(", ground, raw");
endings.push(", fresh, raw");
endings.push(", raw");
endings.push(", cooked");
endings.push(", dried");
endings.push(", fresh");
endings.push(", ground");
endings.push(", not fortified");
// endings.push();
// endings.push();
// endings.push();
// endings.push();
// endings.push();
// read in the times.json file
let times = JSON.parse(fs.readFileSync("./times.json", 'utf-8'));
console.log(times);
// get the most recent servings file
const folderPath = '/home/david/Downloads';
let files = fs.readdirSync(folderPath);
let mostRecentFile = "";
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
let output = new Array();
let foods = new Array();
for (let line of lines) {
    // https://stackoverflow.com/questions/11456850/split-a-string-by-commas-but-ignore-commas-within-double-quotes-using-javascript
    let matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    if (matches != null) {
        // Set the name of the food
        // ************************
        let foodName = matches[3].replaceAll('"', '');
        // Remove unwanted ends if necessary
        foodName = removeEnd(foodName);
        // Replace food name with mapped version if in mappings
        if (mappings.has(foodName)) {
            if (mappings.get(foodName) !== undefined) {
                foodName = mappings.get(foodName);
            }
        }
        // Set the weight
        // ************************
        let weight = fixWeight(matches[4]);
        // Set the time eaten (from the times.json)
        // ************************
        // Default time (probably won't use this though)
        let time = matches[1].replaceAll('"', '');
        // Get other times based on group name
        let group = matches[2].replaceAll('"', '');
        time = times.Eaten[group];
        // Set specific times
        if (foodName.startsWith("Coffee")) {
            time = times.Eaten.Coffee;
        }
        if (foodName.startsWith("Jasmine Tea")) {
            time = times.Eaten.Tea;
        }
        if (!foodName.startsWith("Name")) {
            let food = new FoodEaten(foodName, weight, time);
            foods.push(food);
        }
    }
}
foods.sort(foodSort);
for (let food of foods) {
    console.log(food.toString());
    output.push(food.toString());
}
// Write to a file
try {
    fs.writeFileSync('foods.txt', output.join("\n"));
    // file written successfully
}
catch (err) {
    console.error(err);
}
// Write to the clipboard
clipboard.writeSync(output.join("\n"));
function removeEnd(foodName) {
    for (let ending of endings) {
        if (foodName.toLowerCase().endsWith(ending.toLowerCase())) {
            return foodName.substring(0, foodName.length - ending.length);
        }
    }
    return foodName;
}
function fixWeight(weight) {
    // don't do anything if it isn't a gram weight
    if (!weight.endsWith(' g"')) {
        return weight;
    }
    // get number
    let numberText = weight.match(/\d+\.\d+/);
    if (numberText !== null) {
        return Number.parseFloat(numberText[0]).toString() + "g";
    }
    else {
        return weight;
    }
}
