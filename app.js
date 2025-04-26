const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Replace MongoDB with a simple array
let items = [
  { name: "Welcome to your todolist!" },
  { name: "Hit the + button to add a new item." },
  { name: "<-- Hit this to delete an item." },
];

let lists = {}; // For custom lists

app.get("/", function (req, res) {
  res.render("index", { listTitle: "Today", newListItem: items });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  if (!lists[customListName]) {
    // Create a new custom list
    lists[customListName] = [
      { name: "Welcome to your new list!" },
      { name: "Add more items here." },
    ];
  }
  res.render("index", {
    listTitle: customListName,
    newListItem: lists[customListName],
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = { name: itemName };

  if (listName === "Today") {
    items.push(newItem);
    res.redirect("/");
  } else {
    if (!lists[listName]) {
      lists[listName] = [];
    }
    lists[listName].push(newItem);
    res.redirect("/" + listName);
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    items.splice(checkedItemId, 1);
    res.redirect("/");
  } else {
    lists[listName].splice(checkedItemId, 1);
    res.redirect("/" + listName);
  }
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});
