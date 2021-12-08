var faker = require('faker');

const customer_email = faker.internet.email()
const customer_firstname = faker.name.firstName()
const customer_lastname = faker.name.lastName()
const customer_pass = faker.internet.password()

export const customerCreatePayload =`
{
  "customer": {
      "group_id": 1,
      "email": "`+customer_email+`",
      "firstname": "`+customer_firstname+`",
      "lastname": "`+customer_lastname+`",
      "store_id": 1,
      "website_id": 1,
      "addresses": [],
      "disable_auto_group_change": 0,
      "extension_attributes": {
          "is_subscribed": false
      }
  },
  "password": "`+customer_pass+`"
}
`;


export const customerLoginPayload =`
{
  "username": "`+customer_email+`",
  "password": "`+customer_pass+`"
}
`