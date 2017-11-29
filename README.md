# FormVault
FormVault is a Chrome extension that gives users the ability to save form templates and recover lost
form data for any webpage.

Current Features
  * Automatically saves most current form data whenever the user updates the form. Program detects changes whenever a user alters the value in an html input or select element.
  * Stores all data into chrome.storage.sync. Data persists across different browsers and devices,
  as long as the user has sync enabled for Chrome extensions. 
  * Recovers most recently saved form data for that particular URL. 
  * Allows users to save form data as a template, and later recover the template for that URL.
  * Saving templates overwriters a previously saved template. 
  * Users can clear all form data by clicking the 'Clear History' button. 

To-Do
* Implement the form history page. This will allow users to search for some url and view all form data saved to that url. The user should be able to preview and load the form data.
* Make buttons look fancy :)
