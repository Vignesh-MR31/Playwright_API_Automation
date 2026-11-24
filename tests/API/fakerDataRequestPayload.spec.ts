import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

const URL = "https://restful-booker.herokuapp.com";

//Request Payload using Faker
const firstname = faker.person.firstName();
const lastname = faker.person.lastName();
const totalprice = faker.number.int({ min: 1000, max: 6000 });
const depositpaid = faker.datatype.boolean();
const checkin = DateTime.now().toFormat("yyyy-MM-dd");
const checkout = DateTime.now().plus({day:5}).toFormat("yyyy-MM-dd");
const additionalneeds = "NA";

const requestPayload = {
  firstname: firstname,
  lastname: lastname,
  totalprice: totalprice,
  depositpaid: depositpaid,
  bookingdates: {
    checkin: checkin,
    checkout: checkout,
  },
  additionalneeds: additionalneeds,
};

test(`Verify the create booking API response using static request payload`, async ({
  request,
}) => {
  const response = await request.post(`${URL}/booking`, {
    data: requestPayload,
  });
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
  await expect(bookingDates).toMatchObject({
    checkin: requestPayload.bookingdates.checkin,
    checkout: requestPayload.bookingdates.checkout,
  });
});
