//This file holds any configuration variables we may need
//'config.js' is usually ignored by git to protect sensitive information, such as your database's username and password
//So you will need to rename this to config.js, not example.config.js

module.exports = {
  db: {
    uri: "", //place the uri of your mongoDB database here
  },
  twilio: {
    accountSID: "", //place your twilio SID here
    authToken: "", //place your twilio authToken here
    from: "", //place your twilio phone number here, starting with +1
  },
  secret: "", //place the secret that will be used to hash jwt tokens
  stripe: {
    secret: "", //place your stripe secret key here, either the live or test version
    familyAPI_ID: "", //place the API ID of the family subscription plan here
    plusAPI_ID: "", //place the API ID of the plus subscription plan here
    standardAPI_ID: "", //place the API ID of the standard subscription plan here
    studentAPI_ID: "", //place the API ID of the student subscription plan here
  },
};
