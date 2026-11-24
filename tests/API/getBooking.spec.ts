import { test, expect } from "@playwright/test";
import fs from "fs";

const URL = "https://restful-booker.herokuapp.com";

//Request Payload from JSON file
const jsonFile = "tests/test_data/test_data.json";
const requestPayload = JSON.parse(fs.readFileSync(jsonFile, "utf-8"));

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

test(`Create test for get booking API using path parameter`, async ({
  request,
}) => {
  const id = 1;
  const response = await request.get(`${URL}/booking/${id}`);

  const responseBody = await response.json();
  console.log(responseBody);

  expect(responseBody).toHaveProperty("firstname");
  expect(responseBody).toHaveProperty("lastname");
  expect(responseBody).toHaveProperty("totalprice");
});

test(`Create test for get booking IDs API using path parameter`, async ({
  request,
}) => {
  const firstname = "Yashashwini";
  const lastname = "Prashanth";
  const response = await request.get(`${URL}/booking`, {
    params: { firstname: firstname, lastname: lastname },
  });

  const responseBody = await response.json();
  console.log(responseBody);

  expect(response.status()).toBe(200);
  expect(response.statusText()).toBe("OK");
  for(const id of responseBody){
    expect(id).toHaveProperty("bookingid");
    expect(typeof(id.bookingid)).toBe("number");
  }
});
