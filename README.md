# FormVault
FormVault is a Chrome extension that gives users the ability to save form templates and recover lost
form data from any webpage.

Current Features
  * Automatically saves most current form data whenever the user updates the form. Program detects changes whenever a user alters the value in an html input or select element.
  * Stores all template data into chrome.storage.sync, and auto-save data into chrome.storage.local. Template data persist across different browsers and devices,
  as long as the user has sync enabled for Chrome extensions. 
  * Recovers most recently saved form data for that particular URL. 
  * Allows users to save form data as a template, and later recover the template for that URL.
  * Saving templates overwrites a previously saved template. 
  * Users can clear all form data by clicking the 'Clear History' button. 
  * Clicking 'recover from last save' loads most recently saved form data, as well as delete it. This will allow users to quickly iterate through past form data until they find the desired data.
  * Made buttons look fancy :)
  * Template history button that allows users to search for some url and view, edit, and delete a form template saved to that url.

Site used to test features on: https://www.roboform.com/filling-test-all-fields
