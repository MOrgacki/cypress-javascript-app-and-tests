const { expect } = require("chai");

describe("Positive API Login Cases", () => {
  const username = "aaa";
  const password = "test123";

  it("should successfully log in with valid credentials", () => {
    cy.loginViaApi(username, password).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.headers).to.have.property("set-cookie");
      expect(response.body.user.uuid).to.be.a("string");
    });
  });
  it("should handle other type methods gracefully", () => {
    const type = "WRONG_TYPE";
    cy.loginViaApi(username, password, type).then((response) => {
      expect(response.status).to.equal(200);
    });
  });
});

describe("Negative API Login Cases", () => {
  it("should reject login with too short password", () => {
    const username = "aaa";
    const password = "1";

    cy.loginViaApi(username, password).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it("should reject login with no password provided", () => {
    const username = "aaa";

    cy.loginViaApi(username).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it("should reject login for existing user with wrong password", () => {
    const username = "aaa";
    const password = "wrong_password";

    cy.loginViaApi(username, password).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it("should reject login for non-existing user with wrong password", () => {
    const username = "non_existing_user";
    const password = "wrong_password";

    cy.loginViaApi(username, password).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it("should reject login with blank username and password", () => {
    cy.loginViaApi(null, null).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it("should reject login with no password key in the body", () => {
    const username = "non_existing_user";
    cy.loginViaApi(username, null).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it("should reject login with no username key in the body", () => {
    const password = "non_existing_user";
    cy.loginViaApi(null, password).then((response) => {
      expect(response.status).to.equal(400);
    });
  });
});
