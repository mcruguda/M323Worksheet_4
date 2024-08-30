import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

// Messages which can be used to update the model
const MSGS = {
  INCREASE_CURRENT_NUMBER: "INCREASE_CURRENT_NUMBER",
  DECREASE_CURRENT_NUMBER: "DECREASE_CURRENT_NUMBER"
  // ... ℹ️ additional messages
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl" }, `Count: ${model.currentNumber}`),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.INCREASE_CURRENT_NUMBER) }, "Increase"),
    button({ className: btnStyle, onclick: () => dispatch(MSGS.DECREASE_CURRENT_NUMBER) }, "Decrease"),
    // ... ℹ️ additional elements
    
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg) {
    case MSGS.INCREASE_CURRENT_NUMBER:
      return { ...model, currentNumber: model.currentNumber + 1};
    case MSGS.DECREASE_CURRENT_NUMBER:
      return { ...model, currentNumber: model.currentNumber - 1};
    default:
      return model;
  }
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  currentNumber: 0
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);
