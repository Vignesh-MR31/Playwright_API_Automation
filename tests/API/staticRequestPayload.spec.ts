import { test, expect } from "@playwright/test";

const URL = "https://restful-booker.herokuapp.com";
//Static request Payload
const requestPayload = {
  firstname: "Jim",
  lastname: "Brown",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2018-01-01",
    checkout: "2019-01-01",
  },
  additionalneeds: "Breakfast",
};

test(`Verify the create booking API response using static request payload`, async ({
  request,
}) => {
  const response = await request.post(`${URL}/booking`, {data: requestPayload});
  //console.log(response);

  //For getting the response body we can use .json
  const responseBody = await response.json();
  console.log(responseBody);

  //Verify the status code
  const statusCode = await response.status();
  expect(statusCode).toBe(200);

  //Verify the status message
  const statusMessage = await response.statusText();
  expect(statusMessage).toBe("OK");

  //Verify the bookingid is present in response and bookingid data type
  await expect(responseBody).toHaveProperty("bookingid");
  await expect(responseBody.bookingid).toEqual(expect.any(Number));

  //Verify the bookingdates Object
  const bookingDates = await responseBody.booking.bookingdates;
  await expect(bookingDates).toMatchObject(requestPayload.bookingdates);
});
