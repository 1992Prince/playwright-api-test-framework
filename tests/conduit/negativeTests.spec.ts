import { consoleLogger } from '../../utils/consoleLoggerSingletonInstance';
import { test } from '../../fixtures/api-fixture';
import testData from '../../resources/test-data/conduit-data.json';


/**
 * Here we will be covering 4 scenarios for error message for username field:
 * we will have 4 tcs for username field and in api doc - its length is specified from range 3-20
 * - when we have username less than 3
 * - when username chars count is 3 we should no see any error message
 * - when username length is 20 then also we should not see any error message
 * - when username length is 21 then we should see error message is to long
 */

const payload = testData["Error messages Validations Test"];
// console.log(Array.isArray(payload));
// console.log(payload)

for (const data of payload) {
    test(`Error messages Validations Test ${data.user.email}`, async ({ api, config }, testInfo) => {

        const baseUrl = config.apiUrl;

        consoleLogger.info('Step start: Error messages Validations Test');

        const newUserResp = await api
        .url(baseUrl)
        .path('/users')
        .body(data)
        .postRequest();

        console.log(newUserResp.status," ",newUserResp.json());

        // now for adding execption, u  can use if condition like if email length is less than 3 then
        // check below expections else is length is greater than 20 then
        // check else block exceptions.
        // This is how u can do data driven testing in playwright and here we are getting json array from json file
        // but u can also create array of object and use foreeach in code directly - make a note of this ex for interview
    });
}