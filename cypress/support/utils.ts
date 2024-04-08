/**
 * @file Helper Methods
*/
import { NavItemSelectors, GlobalSelectors } from "cypress/selectors/selectors";
import { registrationNumbers } from "./helperTexts/helperTexts";
import { firstNames, lastNames, jobTitles } from "./helperTexts/helperTexts";
const baseUrl = Cypress.config("baseUrl");

interface Credentials {
    email: string;
    username: string;
    password: string;
}

/**
 * Returns a randomized password
 */
function generateRandomPassword() {
    //2 random lower case, 2 random Upper case, 3 random numbers + 1 random symbol
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseLetters = lowercaseLetters.toUpperCase();
    const symbols = '!@#$%&*_';

    const getRandomChar = (chars) => chars.charAt(Math.floor(Math.random() * chars.length));

    let password = '';
    password += getRandomChar(lowercaseLetters);
    password += getRandomChar(lowercaseLetters);
    password += getRandomChar(uppercaseLetters);
    password += getRandomChar(uppercaseLetters);
    password += Math.floor(Math.random() * 1000)
    password += getRandomChar(symbols);

    return password;
}
/**
 * Returns an object with randomized credentials
 */
export function randomCredentials(): Credentials {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    const randomPassword = generateRandomPassword()
    return { email: `testuser${randomNumber}@cytest.com`, username: `testuser${randomNumber}`, password: randomPassword }
}
/**
 * The intercepted responses will not contain caching-related headers 
 */
export function InterceptAvoid(url) {
    cy.intercept(
        url,
        { middleware: true },
        (req) => {
            req.on('before:response', (res) => {
                // force all API responses to not be cached
                delete res.headers['cache-control'];
                delete res.headers['expires'];
            })
        }
    )
}

/**
 * Checks the NavBar items in DESKTOP / MOBILE view
 * @param resolution = 'MOBILE' //optional
 */
export function checkNavBar(resoltion) {
    if (resoltion === 'MOBILE') {
        cy.get(NavItemSelectors.menu_mobile).should("exist").click();
        cy.get(NavItemSelectors.panel).should("exist").children().should('have.length.gt', 0)
        cy.get(NavItemSelectors.x_icon).should("exist").click()
        cy.get(NavItemSelectors.panel).should("not.exist");
        return
    } else {
        cy.get(NavItemSelectors.home_navitem).should("exist");
        cy.get(NavItemSelectors.avatar_navitem).should("exist").click();
        cy.get(NavItemSelectors.avatar_menuitem_profile).should("exist");
    }
}

/**
 * If the response is undefined, null, or an empty object, globalData is assigned defaultCredentials
 * @param resolution //optional
 */
export function determineGlobalData(response, defaultCredentials) {
    let globalData;
    //checks if response exists and if it contains any data
    if (response && Object.keys(response).length > 0) {
        globalData = response;
    } else {
        //If the response is undefined, null, or an empty object, globalData is assigned defaultCredentials
        globalData = defaultCredentials;
    }
    return globalData;
}

export function logSessionDetails(defaultCredentials: Credentials) {
    cy.log(`Registration failed. Logged in with default credentials instead:
                    email: ${defaultCredentials.email}
                    username: ${defaultCredentials.username}
                    password: ${defaultCredentials.password}
                    `)
}

export function setLocalStrorage(userDetails) {
    window.localStorage.setItem('access', userDetails.access);
    window.localStorage.setItem('user', JSON.stringify(userDetails));
}

export function getRandomRegistrationNumbers(
    numberOfSelections: number,
    previousSelection?: string[]
): string[] {
    registrationNumbers;

    // Shuffle the array
    for (let i = registrationNumbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [registrationNumbers[i], registrationNumbers[j]] = [registrationNumbers[j], registrationNumbers[i]];
    }

    // Select unique values
    const selectedNumbers: string[] = [];
    let count = 0;
    let currentIndex = 0;

    while (count < numberOfSelections && currentIndex < registrationNumbers.length) {
        const number = registrationNumbers[currentIndex];
        if (!previousSelection?.includes(number)) {
            selectedNumbers.push(number);
            count++;
        }
        currentIndex++;
    }

    return selectedNumbers;
}

export function removeSpacesandCompare(text1, text2) {
    const formattedText = text1.replace(/\s+/g, '').toUpperCase(); // Remove all spaces from the text
    const expectedText = text2.replace(/\s+/g, '').toUpperCase(); // Remove all spaces from the expected text
    expect(formattedText).to.contain(expectedText);
}

export function checkScrollandView(pagetoCheck) {
    cy.checkUrl(baseUrl + pagetoCheck);
    cy.window().its('scrollY').should('equal', 0);
    cy.get(NavItemSelectors.footer).scrollIntoView()
    cy.wait(500)
    cy.window().its('scrollY').should('not.equal', 0);
    cy.get(GlobalSelectors.button_scroll).should('exist').click();
    cy.wait(500)
    cy.window().its('scrollY').should('equal', 0);
}

let usedNames: string[] = [];
export function uniqueRandomNameAndRoleGenerator() {
    let firstname = "";
    let lastname = "";
    let jobtitle = "";

    if (usedNames.length === firstNames.length * lastNames.length) {
        usedNames = []; // Reset usedNames if all combinations have been used //Avoiding infinity loop
    }

    do {
        const randomIndexFirstN = Math.floor(Math.random() * firstNames.length);
        const randomIndexLastN = Math.floor(Math.random() * lastNames.length);
        const randomIndexJobTitle = Math.floor(Math.random() * jobTitles.length);

        firstname = firstNames[randomIndexFirstN];
        lastname = lastNames[randomIndexLastN];
        jobtitle = jobTitles[randomIndexJobTitle];

        // Check if the generated name already exists
        const fullName = `${firstname} ${lastname}`;
        if (!usedNames.includes(fullName)) {
            usedNames.push(fullName);
            break;
        }

    } while (true);

    return { firstname, lastname, jobtitle };
}

export const getRandomNumber = () => {
    return Math.floor(Math.random() * 11) + 5; // Generates a number between 5 and 15
};