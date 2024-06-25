import { faker } from "@faker-js/faker";
import { expect } from "chai";

const default_username = Cypress.env("DEFAULT_USERNAME");
const default_password = Cypress.env("DEFAULT_PASSWORD");

describe("Positive API Login Cases", () => {
  const username = default_username;
  const password = default_password;

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
      expect(response.headers).to.have.property("set-cookie");
      expect(response.body.user.uuid).to.be.a("string");
    });
  });
});

describe("Negative API Login Cases", () => {
  const username = faker.internet.userName();
  const password = faker.internet.password();

  it("should reject login with too short password", () => {
    const shortPassword = "a";
    cy.loginViaApi(username, shortPassword).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it("should reject login for existing user with wrong password", () => {
    const username = default_username;
    cy.loginViaApi(username, password).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it("should reject login for non-existing user with wrong password", () => {
    cy.loginViaApi(username, password).then((response) => {
      expect(response.status).to.equal(401);
    });
  });

  it("should reject login with blank username and password", () => {
    cy.loginViaApi(null, null).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it("should reject login with no username key in the body", () => {
    cy.loginViaApi(null, password).then((response) => {
      expect(response.status).to.equal(400);
    });
  });

  it("should reject login with no password provided", () => {
    cy.loginViaApi(username, null).then((response) => {
      expect(response.status).to.equal(400);
    });
  });
});
