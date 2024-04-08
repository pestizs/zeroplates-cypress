import { login, loginValidations, logout } from "../components/login";
import { determineGlobalData } from "cypress/support/utils";
import { LoginAPI } from "cypress/components/API/loginAPI";
import { deleteUser } from "cypress/components/API/registerAPI";

const checkResolution = Cypress.env("check_different_resolutions")
const loginvalidations = Cypress.env("extraValidationsOnLogin")
const defaultCredentials = Cypress.env("defaultCredentials")
let globalData;


// Conditionnaly running basic login workflow or login workflow with different resolutions based on 'check_different_resolutions' variable is true or false. (set in cypressConfig)
if (!checkResolution) {

  describe("Testing Login workflow.", () => {
    //Runs first(once) before any of the tests.
    before(() => {
      cy.clearSavedSessions();
      cy.clearBrowserCache()
      //Gets data from node that we set after registration
      cy.task('getGlobalData').then((response: any) => {
        //If the response is undefined, null, or an empty object, then globalData is assigned defaultCredentials
        globalData = determineGlobalData(response, defaultCredentials);
      });
    })

    it("Should log in while checking validations and log out successfully.", () => {
      if (loginvalidations) loginValidations(globalData.email, globalData.password);
      else login(globalData.email, globalData.password);
      logout()
    });
    it("Should log in with API", () => {
      LoginAPI(globalData.email, globalData.password);
    });
    it("Should Delete 'User X' if User is not default 'mainuser'.", () => {
      if (globalData.username !== 'mainuser') {
        cy.log('**Delete User X**')
        deleteUser(globalData.id, globalData.access)
      }
      //Clears node storage
      cy.task('clearGlobalData');
    });
  })
}

else {

  describe("Testing Login workflow in different resolutions.", () => {
    //Runs first(once) before any of the tests.
    before(() => {
      cy.clearSavedSessions();
      cy.clearBrowserCache()
      //Gets data from node that we set after registration
      cy.task('getGlobalData').then((response: any) => {
        //If the response is undefined, null, or an empty object, then globalData is assigned defaultCredentials
        globalData = determineGlobalData(response, defaultCredentials);
      });
    })

    context('Should log in and log out successfully. DESKTOP resolution', () => {
      //Default, set in defineConfig
      it("1024 x 720, Desktop + check validations", () => {
        if (loginvalidations) loginValidations(globalData.email, globalData.password, 'DESKTOP');
        else login(globalData.email, globalData.password, 'DESKTOP');
        logout()
      });

      it("1920 x 1080, Desktop", () => {
        cy.viewport(1920, 1080)
        login(globalData.email, globalData.password, 'DESKTOP');
        logout()
      });
    });

    context('Should log in and log out successfully. MOBILE resolution', () => {
      it("412 x 771 - Google Pixel 7 Pro + check validations", () => {
        cy.viewport(412, 771)
        if (loginvalidations) loginValidations(globalData.email, globalData.password, 'MOBILE');
        else login(globalData.email, globalData.password, 'MOBILE');
        logout('MOBILE')
      });
      it("390 x 844 - Iphone 13 PRO", () => {
        cy.viewport(390, 844)
        login(globalData.email, globalData.password, 'MOBILE');
        logout('MOBILE')
      });
      it("360 x 760 - Samsung S10", () => {
        cy.viewport(360, 760)
        login(globalData.email, globalData.password, 'MOBILE');
        logout('MOBILE')
      });
    });

    context('Should log in and log out successfully. TABLET / MACKBOOK resolution', () => {
      it("768 x 1024 - Ipad Mini", () => {
        cy.viewport(768, 1024)
        login(globalData.email, globalData.password, 'DESKTOP');
        logout()
      });
    });

    context('Log in through API.', () => {
      it("Should log in with API", () => {
        LoginAPI(globalData.email, globalData.password);
      });
    });

    context('Delete "User X".', () => {
      it("Should Delete 'User X' if User is not default 'mainuser'.", () => {
        if (globalData.username !== 'mainuser') {
          cy.log('**Delete User X**')
          deleteUser(globalData.id, globalData.access)
        }
        //Clears node storage
        cy.task('clearGlobalData');
      });
    })
  });

}