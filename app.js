//--------------------------------
// BUDGET CONTROLLER------Module--
//--------------------------------
var budgetController = (function() {
  // Create object data from input data.
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    (this.value = value), (this.percentage = -1);
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  // Store all budget object data.
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'desc'.
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // Push new item to data object
      data.allItems[type].push(newItem);
      return newItem;
    },
    deleteItem: function(type, id) {
      // Find index of data which will be deleted.
      var ids, index;
      ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      //Remove from data object.
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // 1. Calculate total income and expense
      calculateTotal("exp");
      calculateTotal("inc");
      // 2. Calculate the budget : income- expense
      data.budget = data.totals.inc - data.totals.exp;

      // 3. Calculate percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(current) {
        current.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();
//--------------------------------
// UI CONTROLLER----------Module--
//--------------------------------
var UIController = (function() {
  // Make easy changable DOM strings.
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  //Make easy readable data
  var formatNumber = function(num, type) {
    var numSplit, int, dec;
    //Get absalotu value of number
    num = Math.abs(num);
    //Fix 2 step after point. (returned string)
    num = num.toFixed(2);

    numSplit = num.split(".");
    //integer part
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3); // input 1234, output 1,234
    }
    //decimal part
    dec = numSplit[1];

    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  return {
    // Get inputs for global controller
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      //Create HTML string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // Replace the placeholder text with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      // Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorID) {
      var element = document.getElementById(selectorID);
      element.parentNode.removeChild(element);
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );
      // Change fields to Array from Object
      fieldsArr = Array.prototype.slice.call(fields);
      // Clear all element value
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      // Focus description field after data entry.
      fields[0].focus();
    },
    //Display Budget
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");

      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    //Display percentages
    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
      //Make your special forEach function for changing every node list element
      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };
      // Change node's percentages
      nodeListForEach(fields, function(current, index) {
        current.textContent = percentages[index];
        //do staff
      });
    },

    displayMonth: function() {
      var now, month, year, month, months;
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      document.querySelector(DOMstrings.dateLabel).textContent =
        months[month] + " " + year;
    },

    // Make DOMstring reachable for Global Controller
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();
//--------------------------------
// GLOBAL APP CONTROLLER--Module--
//--------------------------------
var controller = (function(budgetCtrl, UICtrl) {
  //Event listeners
  var setupEvetListeners = function() {
    // Reach DOMstrings which inside the UI controller.
    var DOM = UICtrl.getDOMstrings();
    // Execute when user click button.
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    // Execute when enter key pressed on the document anywhere.
    document.addEventListener("keypress", function(event) {
      // Execute only  enter key (KeyCode=13) pressed
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  // Update Budget
  var updateBudget = function() {
    // 1. Calculate the budget
    budgetController.calculateBudget();
    // 2. Return the budget
    var budget = budgetController.getBudget();

    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  //Uptade percentages
  var updatePercentages = function() {
    // 1. Calculate percentages
    budgetController.calculatePercentages();
    // 2. Read percentages from budget controller
    var percentages = budgetController.getPercentage();
    // 3. Update the UI with the new percentages
    console.log(percentages);
    UICtrl.displayPercentages(percentages);
  };

  // Click and Keypress Action
  var ctrlAddItem = function() {
    var input, newItem;
    // 1. Get the field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetController.addItem(
        input.type,
        input.description,
        input.value
      );
      // 3. Add the item to UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the fields
      UICtrl.clearFields();
      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // 1. Delete the item from data structure
      budgetController.deleteItem(type, ID);
      // 2. Delete the item from UI
      UICtrl.deleteListItem(itemID);
      // 3. Update and show the new budget
      updateBudget();
      // 4. Calculate and update percentages
      updatePercentages();
    }
  };
  return {
    init: function() {
      console.log("App Started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEvetListeners();
    }
  };
})(budgetController, UIController);

controller.init();
