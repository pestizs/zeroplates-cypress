/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
    *Get an element by Data-Cy attribute
    *@param data Data-Cy value
    */
    getByDataCy(data: string): Chainable;
    /**
    * 
    * Logging, clearing sessions
    */
    clearSavedSessions(): void;

    logTestData(data: Record<string, any>): void;

    /**
    * Checks the snackbar message.
    */
    checkToast(data: string): Chainable;
    /**
    * Checks the url.
    */
    checkUrl(url: string): Chainable;
    /**
    * Sets intercept for API requests, that can be captured.
    */ //NOT USING IT AT THE MOMENT********************
    setIntercepts(): Chainable<Response<any>>;
    /**
    * Custom request command.
    * @param method request method
    * @param url request url
    * @param headers request headers
    * @param body request body
    * @param options other options //OPTIONAL
    */
    customRequest(method: string, url: string, headers: ReqHeaders, body: ReqBody, options?: any): Chainable<Response<any>>;

    task(
      event: "setGlobalData",
      arg?: any,
    ): Chainable<any>;

    /**
    * 
    */
    checkLocalStorageToken(): Chainable<Response<void>>
    /**
    * Checkk if the checkbox is ticked
    */
    isCheckBoxTicked(checkboxSelector: string): Chainable<Response<void>>

    getInput_Type_Check(selector: string, value: any): Chainable<Response<void>>

    getInputByDataCy_Type_Check(selector: string, value: any): Chainable<Response<void>>

    clickAndSelect()

    /**
    * Clears browser cache
    */
    clearBrowserCache()

    /**
    * Gets all the elements with the selector and checks if it contains the provided text.
    * @param selector
    * @param text
    */
    checkTextContains(selector: string, text: any)

    /**
    * Selects an element, then checks the tooltip
    * @param elementSelector
    * @param tooltipSelector
    * @param tooltipText
    * @param timeout
    */
    checkTooltip(elementSelector: string, tooltipSelector: string, tooltipText: string, timeout: number)

    /**
    * Selects an element, then checks the text
    * @param selector
    * @param text
    */
    getByIdAndCheckText(selector: string, text: string)
  }

  // Define the interface for request headers
  interface ReqHeaders {
    [key: string]: string;
  }

  // Define the interface for request body
  interface ReqBody {
    ['email']: string;
    ['password']: string;
  }
}

