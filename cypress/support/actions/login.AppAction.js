const API_URL = Cypress.env("API_BASE_URL");

Cypress.Commands.add("loginViaApi", (username, password, type = "LOGIN") => {
  cy.fixture("login-data-schema.json").then((data) => {
    data.username = username;
    data.password = password;
    data.type = type;

    cy.request({
      method: "POST",
      url: API_URL + "/login",
      body: data,
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add("mockLoginApi", (httpMethod) => {
  cy.intercept(httpMethod, API_URL + "/login", {
    statusCode: 403,
    body: {
      error: "Forbidden",
    },
  }).as("loginRequest");
});

Cypress.Commands.add("loginViaUi", (username, password, rememberMe = false, shouldLogin = true) => {
  const usernameInputLoc = '[data-test="signin-username"]';
  const passwordInputLoc = '[data-test="signin-password"]';
  const checkboxRememberMeLoc = '[data-test="signin-remember-me"]';
  const loginButtonLoc = '[data-test="signin-submit"]';

  cy.visit("/");
  cy.get(usernameInputLoc).type(username);
  cy.get(passwordInputLoc).type(password);
  rememberMe ? cy.get(checkboxRememberMeLoc).click() : null;
  shouldLogin ? cy.get(loginButtonLoc).click() : null;
});
