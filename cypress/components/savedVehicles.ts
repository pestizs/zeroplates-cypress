import { GlobalSelectors, SavedVehiclesSelectors, VehicleCheckSelectors } from "cypress/selectors/selectors";
import { tooltips } from "cypress/support/helperTexts/helperTexts";
import { checkScrollandView, removeSpacesandCompare } from "cypress/support/utils";
import { checkVehicleDetails } from "./vehicleCheck";
const toasts = require("../fixtures/toasts.json");

export async function checkSavedVehicles(savedVehiclesfromNodeStorage: string[]): Promise<any> {
    const savedVehiclesFromApi = await waitFor_Me_Request()
    cy.log('**Confirm the number of vehicles we have saved in the previous spec equals the number of vehicles we currently have.**')
    expect(savedVehiclesFromApi.length).to.eq(savedVehiclesfromNodeStorage.length)
    checkScrollandView('savedvehicles')
    checkFiltering(savedVehiclesFromApi)
    checkPagination(savedVehiclesFromApi, savedVehiclesfromNodeStorage)
    cy.reload()
    CheckDetailsOfFirstItem(savedVehiclesFromApi)
    DeleteFirstItemAndCheck(savedVehiclesFromApi)
}

async function waitFor_Me_Request(): Promise<any> {
    return new Promise((resolve: any, reject) => {
        let attempts = 0;
        const maxAttempts = 30; // Maximum number of attempts to wait for the request

        function checkRequest() {
            cy.wait("@me").then((MeResponse: any) => {
                attempts++;
                if (MeResponse.response.statusCode === 200) {
                    const savedCars = MeResponse.response.body.savedCars;
                    resolve(savedCars);
                } else if (attempts >= maxAttempts) {
                    reject(new Error("Failed to intercept successfull Me request."));
                } else {
                    // Retry if the request did not meet the condition
                    checkRequest();
                }
            });
        }

        // Start checking for the request
        checkRequest();
    });
}

export function checkFiltering(savedVehiclesFromApi) {
    cy.getByDataCy(SavedVehiclesSelectors.input_filter).should('exist').and('have.attr', 'placeholder', 'Filter:  LK68 WUM').invoke('val').should('be.empty')
    cy.getInputByDataCy_Type_Check(SavedVehiclesSelectors.input_filter, 'fakeReg100')
    filter_check_clear(savedVehiclesFromApi, 0)
    filter_check_clear(savedVehiclesFromApi, 1)
    filter_check_clear(savedVehiclesFromApi, 2)
    filter_check_clear(savedVehiclesFromApi, 3)
    filter_check_clear(savedVehiclesFromApi, 4)
    filter_check_clear(savedVehiclesFromApi, 5)
    filter_check_clear(savedVehiclesFromApi, 6)
    filter_check_clear(savedVehiclesFromApi, 7)
    filter_check_clear(savedVehiclesFromApi, 8)
    filter_check_clear(savedVehiclesFromApi, 9)
    filter_check_clear(savedVehiclesFromApi, 10)
    filter_check_clear(savedVehiclesFromApi, 11)
    filter_check_clear(savedVehiclesFromApi, 12)
}

function checkPagination(savedVehiclesFromApi, savedVehiclesfromNodeStorage) {

    if (savedVehiclesFromApi.length <= 5) {

        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length)
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('not.exist')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[0].registrationNumber)
        })
        CheckDisplayedRegNums(SavedVehiclesSelectors.container_SavedCars, savedVehiclesFromApi, savedVehiclesfromNodeStorage)
        selectFromPageDropdownAndCheck(5, 1, 10)
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('not.exist')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length)
    }

    if (savedVehiclesFromApi.length > 5 && savedVehiclesFromApi.length <= 10) {

        check_ItemsOnPageAndPaginationElements(5, 2, 1)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 5)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[5].registrationNumber)
        })
        selectFromPageDropdownAndCheck(5, 1, 10)
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('not.exist')
        CheckDisplayedRegNums(SavedVehiclesSelectors.container_SavedCars, savedVehiclesFromApi, savedVehiclesfromNodeStorage)
        selectFromPageDropdownAndCheck(10, 2, 20)
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('not.exist')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length)
    }

    if (savedVehiclesFromApi.length > 10 && savedVehiclesFromApi.length <= 15) {

        cy.log('**Check if there are 5 items displayed on the first page**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', 5)
        cy.log('**Check if there are 3 pages and clicks on page 2**')
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('have.length', 3).eq(1).click()
        cy.log('**Check if there are 5 items displayed on the second page**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', 5)
        cy.log('**Check if there are 3 pages and clicks on page 3**')
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('have.length', 3).eq(2).click()
        cy.log('**Check if there are (total number of items - 10) items displayed on the third page**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 10)
        cy.log('**Check if the first items registration number equals the 11th items registration number**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[10].registrationNumber)
        })

        cy.log('**Checks if the current item/page is set to 5, selects 10, and checks if it is set to 10**')
        selectFromPageDropdownAndCheck(5, 1, 10)
        cy.log('**Check if there are 10 items displayed on the first page**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', 10)
        cy.log('**Check if there are 2 pages and clicks on page 2**')
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('have.length', 2).eq(1).click()
        cy.log('**Check if there are (total number of items - 10) items displayed on the second page**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 10)
        cy.log('**Check if the first items registration number equals the 11th items registration number**')
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[10].registrationNumber)
        })

        cy.log('**Checks if the current item/page is set to 10, selects 20, and checks if it is set to 20**')
        selectFromPageDropdownAndCheck(10, 2, 20)
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('not.exist')
        cy.log('**Compares the dispalyed registration numbers to the list of registration numbers we have saved**')
        CheckDisplayedRegNums(SavedVehiclesSelectors.container_SavedCars, savedVehiclesFromApi, savedVehiclesfromNodeStorage)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length)
    }

    if (savedVehiclesFromApi.length > 15 && savedVehiclesFromApi.length <= 20) {

        check_ItemsOnPageAndPaginationElements(5, 4, 1)
        check_ItemsOnPageAndPaginationElements(5, 4, 2)
        check_ItemsOnPageAndPaginationElements(5, 4, 3)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 15)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[15].registrationNumber)
        })

        selectFromPageDropdownAndCheck(5, 1, 10)
        check_ItemsOnPageAndPaginationElements(10, 2, 1)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 10)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[10].registrationNumber)
        })

        selectFromPageDropdownAndCheck(10, 2, 20)
        cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('not.exist')
        CheckDisplayedRegNums(SavedVehiclesSelectors.container_SavedCars, savedVehiclesFromApi, savedVehiclesfromNodeStorage)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length)
    }

    if (savedVehiclesFromApi.length > 20 && savedVehiclesFromApi.length <= 25) {

        const first20RegsFromApi = savedVehiclesFromApi.slice(0, 20);
        const first20RegsFromNode = savedVehiclesfromNodeStorage.slice(0, 20);

        check_ItemsOnPageAndPaginationElements(5, 5, 1)
        check_ItemsOnPageAndPaginationElements(5, 5, 2)
        check_ItemsOnPageAndPaginationElements(5, 5, 3)
        check_ItemsOnPageAndPaginationElements(5, 5, 4)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 20)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[20].registrationNumber)
        })

        selectFromPageDropdownAndCheck(5, 1, 10)
        check_ItemsOnPageAndPaginationElements(10, 3, 1)
        check_ItemsOnPageAndPaginationElements(10, 3, 2)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 20)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[20].registrationNumber)
        })

        selectFromPageDropdownAndCheck(10, 2, 20)
        CheckDisplayedRegNums(SavedVehiclesSelectors.container_SavedCars, first20RegsFromApi, first20RegsFromNode)
        check_ItemsOnPageAndPaginationElements(20, 2, 1)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', savedVehiclesFromApi.length - 20)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[20].registrationNumber)
        })
    }

    if (savedVehiclesFromApi.length > 25) {

        const first20RegsFromApi = savedVehiclesFromApi.slice(0, 20);
        const first20RegsFromNode = savedVehiclesfromNodeStorage.slice(0, 20);
        const numberofPagesPer5 = Math.ceil(savedVehiclesFromApi.length / 5)
        const numberofPagesPer10 = Math.ceil(savedVehiclesFromApi.length / 10)
        const numberofPagesPer20 = Math.ceil(savedVehiclesFromApi.length / 20)

        check_ItemsOnPageAndPaginationElements(5, numberofPagesPer5, 1)
        check_ItemsOnPageAndPaginationElements(5, numberofPagesPer5, 2)
        check_ItemsOnPageAndPaginationElements(5, numberofPagesPer5, 3)
        check_ItemsOnPageAndPaginationElements(5, numberofPagesPer5, 4)
        check_ItemsOnPageAndPaginationElements(5, numberofPagesPer5, 5)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[25].registrationNumber)
        })

        selectFromPageDropdownAndCheck(5, 1, 10)
        check_ItemsOnPageAndPaginationElements(10, numberofPagesPer10, 1)
        check_ItemsOnPageAndPaginationElements(10, numberofPagesPer10, 2)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[20].registrationNumber)
        })

        selectFromPageDropdownAndCheck(10, 2, 20)
        CheckDisplayedRegNums(SavedVehiclesSelectors.container_SavedCars, first20RegsFromApi, first20RegsFromNode)
        check_ItemsOnPageAndPaginationElements(20, numberofPagesPer20, 1)
        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0).find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[20].registrationNumber)
        })
    }

}

function filter_check_clear(savedVehicles, numberofVehicles: number) {
    if (savedVehicles.length > numberofVehicles) {
        cy.log('**Confirm that only the filtered Vehicle appears , and check its registration number**')
        cy.getInputByDataCy_Type_Check(SavedVehiclesSelectors.input_filter, savedVehicles[numberofVehicles].registrationNumber)

        cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).then(($el) => {
            if ($el.length > 1) {
                return;
            } else {
                cy.wrap($el).should('have.length', 1)
                cy.getByDataCy(SavedVehiclesSelectors.span_regNum).invoke('text').then((text) => {
                    removeSpacesandCompare(text, savedVehicles[numberofVehicles].registrationNumber)
                })
            }
        })
        cy.getByDataCy(SavedVehiclesSelectors.input_filter).clear()
    }
}

function CheckDisplayedRegNums(selector, savedVehiclesFromApi, savedVehiclesfromNodeStorage) {
    let displayedRegistrationNumbers = [];
    cy.getByDataCy(selector)
        .should('have.length', savedVehiclesFromApi.length)
        .find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`)
        .each(($el) => {
            displayedRegistrationNumbers.push($el.text().replace(/\s+/g, ''));
        })
        .then(() => {
            //In case we saved lower case registration numbers, we convert them to Upper case
            const expectedRegNumsUpperCase = savedVehiclesfromNodeStorage.map(regNum => regNum.toUpperCase());
            expect(displayedRegistrationNumbers).to.deep.eq(expectedRegNumsUpperCase);
        });
}

function selectFromPageDropdownAndCheck(pageNum1: number, toPageNum: number, pageNum2: number) {
    cy.getByDataCy(SavedVehiclesSelectors.button_pageDropdown).should('have.text', pageNum1).click()
    cy.getByDataCy(SavedVehiclesSelectors.dropdown_menu_items).children().should('have.length', 3).eq(toPageNum).click()
    cy.getByDataCy(SavedVehiclesSelectors.button_pageDropdown).should('have.text', pageNum2)
}

function check_ItemsOnPageAndPaginationElements(numberOfElementsOnPage: number, numberOfPages: number, pageToNavigate: number) {
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).should('have.length', numberOfElementsOnPage)
    cy.getByDataCy(SavedVehiclesSelectors.paginationItem).should('have.length', numberOfPages).eq(pageToNavigate).click()
}

function CheckDetailsOfFirstItem(savedVehiclesFromApi) {
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[0].registrationNumber)
        })
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`p[data-cy=${SavedVehiclesSelectors.p_make}]`).invoke('text').then((text) => {
            expect(text).to.equal(savedVehiclesFromApi[0].make)
        })
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`i[data-cy=${SavedVehiclesSelectors.p_year}]`).invoke('text').then((text) => {
            expect(text).to.equal(savedVehiclesFromApi[0].yearOfManufacture.toString())
        })
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`button[data-cy=${SavedVehiclesSelectors.button_details}]`).should('exist').click()
    cy.checkTooltip(GlobalSelectors.hearIcon_full, GlobalSelectors.tooltip_heart, tooltips.fullHearIcon, 500)
    checkVehicleDetails(savedVehiclesFromApi[0], VehicleCheckSelectors)
    cy.getByDataCy(SavedVehiclesSelectors.button_back).should('exist').click()
}

function DeleteFirstItemAndCheck(savedVehiclesFromApi) {
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[0].registrationNumber)
        })
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`button[data-cy=${SavedVehiclesSelectors.button_delete}]`).should('exist').click()
    cy.get('h3').contains(`Delete Saved Vehicle '${savedVehiclesFromApi[0].registrationNumber}'`)
    cy.get(GlobalSelectors.button_confirm).should('exist').click()
    cy.checkToast(toasts.DeleteSuccess)
    cy.reload()
    //Check if first item is the second item from the savedVehicles list // Confirms that item was deleted
    cy.getByDataCy(SavedVehiclesSelectors.container_SavedCars).eq(0)
        .find(`span[data-cy=${SavedVehiclesSelectors.span_regNum}]`).invoke('text').then((text) => {
            removeSpacesandCompare(text, savedVehiclesFromApi[1].registrationNumber)
        })
}

//export async function saveVehiclesViaApiAndCheck()