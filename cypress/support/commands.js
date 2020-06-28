// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: "element"}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: "optional"}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("hasLayers", count => {
    cy.window().then(({ map }) => {
        const layerCount = Object.keys(map._layers).length;
        cy.wrap(layerCount).should("eq", count);
    });
});

Cypress.Commands.add("isEditable", layer => {
    let className = layer.options.tooltip.className;
    cy.get("." + className + "[contenteditable=true]");
});

Cypress.Commands.add("isNotEditable", layer => {
    let tooltip = layer.tooltip.getElement();
    cy.wrap(tooltip)
        .should("have.css", "pointer-events")
        .and("match", /none/);
});

///this doesn't work 🤷
Cypress.Commands.add("sameSize", (selector1, selector2) => {
  cy.get(selector1).then(($first) => {
    cy.get(selector2).should(($second) => {
      expect($first).to.have.css("width", $second.width() + "px");
      expect($first).to.have.css("height", $second.height() + "px");
    })
  });
});