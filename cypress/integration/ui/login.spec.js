before(() => {
  cy.exec("npm run db:seed:dev");
});

beforeEach(() => {
  cy.visit("/");
});

describe("Positive Login Page Cases", () => {
  const username = "aaa";
  const password = "test123";

  it("should verify redirect to login page", () => {
    const route = "/signin";
    cy.url().should("include", route);
  });

  it("should login a user", () => {
    const localStorageKeyName = "authState";
    const rememberMeStorageName = "event.remember";

    cy.loginViaUi(username, password);

    cy.window().then((window) => {
      const authState = JSON.parse(window.localStorage.getItem(localStorageKeyName));
      expect(authState).to.not.have.nested.property(rememberMeStorageName);
    });
  });

  it("should login user with Remember Me option checked", () => {
    cy.loginViaUi(username, password, true);

    cy.window().then((window) => {
      const authState = JSON.parse(window.localStorage.getItem("authState"));
      expect(authState).to.have.nested.property("event.remember", true);
    });
  });
});

describe("Negative Login Page Cases", () => {
  it("shouldn't login with incorrect username and password", () => {
    const username = "wrong_username";
    const password = "wrong_password";

    const errorMessageLoc = '[data-test="signin-error"]';

    cy.loginViaUi(username, password, false, true);
    cy.get(errorMessageLoc).should("exist");
  });
  it("should show incorrect input and password error messages", () => {
    const username = "{selectall}{backspace}";
    const password = " ";
    const usernameErrorLoc = "#username-helper-text";
    const passwordErrorLoc = "#password-helper-text";

    cy.loginViaUi(username, password, true, false);
    cy.get(usernameErrorLoc);
    cy.get(passwordErrorLoc);
  });
  it("should return Forbidden", () => {
    cy.mockLoginApi("POST");
    const username = "aaa";
    const password = "test123";
    cy.loginViaUi(username, password, true, true);

    cy.wait("@loginRequest").then((interception) => {
      expect(interception.response.statusCode).to.equal(403);
      expect(interception.response.body.error).to.equal("Forbidden");
    });
  });
});
