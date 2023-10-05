import fs from 'fs';
import clipboard from 'clipboardy';
import { JSDOM } from 'jsdom';
class FoodEaten {
    name;
    weight;
    time;
    fermented;
    constructor(name, weight, time, fermented) {
        this.name = name;
        this.weight = weight;
        this.time = time;
        this.fermented = fermented;
    }
    toString() {
        return this.name + " (" + this.fermented + this.weight + " " + this.time + ")";
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
function removeEnd(foodName) {
    for (let ending of endings) {
        if (foodName.toLowerCase().endsWith(ending.toLowerCase())) {
            // console.log(foodName);
            return foodName.substring(0, foodName.length - ending.length);
        }
    }
    return foodName;
}
class CronometerDataRow {
    meal;
    time;
    type;
    name;
    value;
    unit;
    calories;
    constructor(meal = "unknown", time = "unknown", type = "unknown", name = "unknown", value = 0, unit = "unknown", calories = 0) {
        this.meal = meal;
        this.time = time;
        this.type = type;
        this.name = name;
        this.value = value;
        this.unit = unit;
        this.calories = calories;
    }
    toString() {
        return "meal: " + this.meal +
            ", time: " + this.time + ", type: " + this.type
            + ", name: " + this.name + ", value: " + this.value
            + ", unit: " + this.unit + ", calories: " + this.calories;
    }
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
mappings.set("Mixed Nuts, without Peanuts, Salted", "Mixed nuts");
mappings.set("Pork, Ground, 96% Lean, 4% Fat", "Pork mince");
mappings.set("Lentils, Pink or Red", "Red lentils");
mappings.set("Raspberries, Fresh, Red", "Raspberries");
mappings.set("Mixed Nuts, with Peanuts, Oil Roasted, Salted", "Mixed nuts");
mappings.set("Fat, Duck", "Duck fat");
mappings.set("Cabbage, Red", "Red cabbage");
mappings.set("Zucchini", "Courgette");
mappings.set("Chicken, roasting, light meat, meat only, cooked, roasted", "Chicken");
mappings.set("Arugula", "Rocket");
mappings.set("Tomato Raw, Includes Cherry, Grape, Roma", "Tomatoes");
mappings.set("Onion, White, Yellow or Red", "Onion");
mappings.set("Brie Cheese", "Brie");
mappings.set("Spearmint", "Mint");
mappings.set("Potatoes, White, Flesh and Skin", "Potatoes");
mappings.set("Oil, coconut, organic", "Coconut oil");
mappings.set("Red Bell Peppers", "Red peppers");
mappings.set("Red Wine, Other Types", "Red wine");
mappings.set("Whiskey", "Whisky");
mappings.set("Oatmeal, Regular or Quick, Dry", "Oats");
mappings.set("Rutabaga", "Swede");
mappings.set("Lamb Roast, Leg, No Visible Fat Eaten", "Lamb");
mappings.set("Chicken Breast, Skin Removed Before Cooking", "Chicken");
mappings.set("Egg, Whole, Cooked, Hard-Boiled", "Egg");
mappings.set("Mollusks, scallop, mixed species", "Scallops");
mappings.set("Oatmeal, Regular or Quick", "Oats");
mappings.set("Peas, Green, Split, Mature Seeds", "Split peas");
mappings.set("Nuts, Pine Nuts", "Pine nuts");
mappings.set("Chickpeas, Garbanzo Beans, Bengal Gram, Mature Seeds", "Chickpeas");
mappings.set("Beans, Black, Mature Seeds", "Black beans");
mappings.set("Spinach, Frozen, Chopped or Leaf, Unprepared", "Spinach");
mappings.set("Sesame Seeds, Hulled, Toasted, Unsalted", "Sesame seeds");
mappings.set("Brazil Nuts, Unsalted", "Brazil nuts");
mappings.set("Oats, Regular or Quick", "Oats");
mappings.set("Chicken Breast, Skinless", "Chicken");
mappings.set("Le Bio par Picard Cocktail de Fruits Rouges", "Berries");
mappings.set("M&amp;S Frozen Mixed Vegetables", "Frozen vegetables");
mappings.set("Seeds, Pumpkin and Squash Seed Kernels, Roasted, without Salt", "Pumpkin seeds");
mappings.set("Fish and chip shop battered cod", "Battered cod");
mappings.set("French Fries, From a Restaurant Other than Fast Food", "Chips");
mappings.set("M&amp;S Organic Full Fat Soft Cheese", "Cream cheese");
mappings.set("Potatoes, Pan Fried", "Chips");
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
endings.push(", dried, ground");
endings.push(", raw");
endings.push(", cooked");
endings.push(", dried");
endings.push(", fresh");
endings.push(", ground");
endings.push(", not fortified");
endings.push(", dry");
endings.push(", unsweetened");
// endings.push();
// endings.push();
// endings.push();
// endings.push();
// endings.push();
// read in the site.html file
let site = fs.readFileSync("./site.html", 'utf-8');
console.log("Parsing the html file...");
const dom = new JSDOM(site);
console.log("Finished parsing.");
// get the data rows
let cronData = new Array();
const tableRows = dom.window.document.querySelectorAll(".crono-table tbody tr");
let latestMeal = "Nothing yet";
for (let tableRow of tableRows) {
    let row = new CronometerDataRow();
    const dataItems = tableRow.querySelectorAll("td");
    // Check that it's a line we want: does it have the meal name
    const diaryTitle = tableRow.querySelector(".diary-group-title");
    if (diaryTitle !== null) {
        latestMeal = diaryTitle.innerHTML;
    }
    // Check that it's a line we want: does it have a diary time
    if (dataItems[0].classList.contains("diary-time")) {
        // Get time
        const divTime = dataItems[0].querySelector("div");
        if (divTime !== null) {
            row.time = divTime.innerHTML;
        }
        // Get type
        const icon = dataItems[1].querySelector("i");
        if (icon !== null) {
            switch (icon.classList[0]) {
                case "icon-add-biometric":
                    row.type = "biometric";
                    break;
                case "icon-exercise":
                    row.type = "exercise";
                    break;
                case "icon-notes":
                    row.type = "note";
                    break;
                case "icon-food":
                    row.type = "food";
                    break;
                case "icon-custom-recipe":
                    row.type = "food";
                    break;
                case "icon-chevron-down":
                    break;
                default:
                    console.log("*********** ERROR: unknown type: " + icon.classList[0]);
            }
        }
        // Get the name
        const divName = dataItems[2].querySelector("div");
        if (divName !== null) {
            let foodName = divName.innerHTML.replace("\n", "").replace(/\s+/g, " ").trim();
            // if (foodName.includes("Frozen")) {
            //     console.log(foodName);
            // }
            // Update the food name
            if (row.type === "food") {
                // Remove unwanted ends if necessary
                foodName = removeEnd(foodName);
                // Replace food name with mapped version if in mappings
                if (mappings.has(foodName)) {
                    if (mappings.get(foodName) !== undefined) {
                        foodName = mappings.get(foodName);
                    }
                }
            }
            row.name = foodName;
        }
        // Get the value
        const divValue = dataItems[3].querySelector("div");
        if (divValue !== null) {
            row.value = Number.parseFloat(divValue.innerHTML);
        }
        // Get the unit
        const divUnit = dataItems[4].querySelector("div");
        if (divUnit !== null) {
            row.unit = divUnit.innerHTML;
        }
        // Get the calories
        const divCalories = dataItems[5].querySelector("div");
        if (divCalories !== null) {
            row.calories = Number.parseFloat(divCalories.innerHTML);
        }
        // Put in the latest meal
        row.meal = latestMeal;
        cronData.push(row);
    }
}
// read in the eaten times json data
let times = "";
for (let row of cronData) {
    if (row.type === "note") {
        if (row.name.startsWith('{"Eaten": {')) {
            times = JSON.parse(row.name);
        }
    }
}
// Calculate some totals
let totalGEaten = 0;
let totalKCalEaten = 0;
let totalKCalBurned = 0;
// Create a set of foods eaten
let foods = new Array();
for (let row of cronData) {
    // Add up the total weight eaten
    if (row.type === "food" && row.name !== "Coffee" && row.name !== "Jasmine Tea") {
        totalGEaten += row.value;
    }
    // Add up the total kcals eaten
    if (row.type === "food") {
        totalKCalEaten += row.calories;
    }
    // Add up the total energy expended through exercise
    if (row.type === "exercise") {
        totalKCalBurned += row.calories * -1;
    }
    // Update foods eaten
    if (row.type === "food") {
        // Check whether the food was listed in times.json as fermented
        let fermented = "";
        let fermentedFoods = times.Fermented;
        if (fermentedFoods.includes(row.name)) {
            fermented = "F ";
        }
        // Get the time actually eaten
        // Default time (probably won't use this though)
        let time = row.time;
        // Get other times based on group name
        time = times.Eaten[row.meal];
        // Set specific times
        if (row.name.startsWith("Coffee")) {
            time = times.Eaten.Coffee;
        }
        if (row.name.startsWith("Jasmine Tea")) {
            time = times.Eaten.Tea;
        }
        let food = new FoodEaten(row.name, row.value + row.unit, time, fermented);
        foods.push(food);
    }
    console.log(row.toString());
}
console.log(times);
// Prepare the data for output
let output = new Array();
foods.sort(foodSort);
for (let food of foods) {
    console.log(food.toString());
    output.push(food.toString());
}
// Add in some extra information
let msg = "Weight eaten: " + Math.round(totalGEaten) + " g";
console.log(msg);
output.push(msg);
msg = "Calories eaten: " + Math.round(totalKCalEaten) + " kCal";
console.log(msg);
output.push(msg);
msg = "kcal/g: " + Math.round(totalKCalEaten / totalGEaten * 10) / 10;
console.log(msg);
output.push(msg);
msg = "Total exercise: " + Math.round(totalKCalBurned) + " kCal";
console.log(msg);
output.push(msg);
msg = "Net calories: " + Math.round(totalKCalEaten - totalKCalBurned) + " kCal";
console.log(msg);
output.push(msg);
// Write to the clipboard
clipboard.writeSync(output.join("\n"));
