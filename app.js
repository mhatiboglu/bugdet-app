//--------------------------------
// BUDGET CONTROLLER------Module--
//--------------------------------
var budgetController = (function() {
  var 
})();
//--------------------------------
// UI CONTROLLER----------Module--
///-------------------------------
var UIController = (function() {
  // Make easy changable DOM strings.
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };
  return {
    // Get inputs for global controller
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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
  };

  // Click and Keypress Action
  var ctrlAddItem = function() {
    // 1. Get the field input data
    var input = UICtrl.getInput();
    // 2. Add the item to the budget controller
    // 3. Add the item to UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };
  return {
    init: function() {
      console.log("App Started");
      setupEvetListeners();
    }
  };
})(budgetController, UIController);

controller.init();
