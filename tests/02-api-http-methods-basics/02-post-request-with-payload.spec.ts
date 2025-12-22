import { test, expect } from '@playwright/test';

test('POST request - create user', async ({ request }) => {
  // Request body as TypeScript object
  const payload = {
    "firstname" : "Jim",
    "lastname" : "Brown",
    "totalprice" : 111,
    "depositpaid" : true,
    "bookingdates" : {
        "checkin" : "2018-01-01",
        "checkout" : "2019-01-01"
    },
    "additionalneeds" : "Breakfast"
};

  const response = await request.post(
    'https://restful-booker.herokuapp.com/booking',
    {
      data: payload
    }
  );

  expect(response.status()).toBe(200); // or mostly 201 for creation
});
