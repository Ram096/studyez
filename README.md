## StudyEZ

StudyEz is an online study tool that will allow students to study in the most effective way possible via spaced repetition. <spaced repetition explanation here maybe> The website will feature a login page with customizable profile pictures, document upload, event creation and modification, and knowledge surveys to recognize how comfortable a student feels with the material. 
  
Users will be able to log in/sign up using a Google account. Such information will be housed in a database. Users will also have the ability to select a profile picture by uploading a picture. 

Users will able to upload and track their study habits by uploading document titles to a dashboard and rating those documents using knowledge surveys..   
 
Users will be able to create events and or modify them on the Google-embedded calendar. 
  
Users will be able to submit knowledge surveys based on how comfortable they feel with the material
  
### Test Strategy
  Each feature should be tested individually to make sure they are working how they are supposed to. If time allows, this will likely be done with Mocha. We will test the Login Page, Document Upload, and Knowledge Surveys. Below outlines the User Acceptance Testing for each feature as formatted in the Project Milestone 5. 
  
  **Login Page** <br>
  * The UAT here will test the login functionality. This will mean that the front end login.ejs page must be tested for mistakes and to ensure it is communicating correctly with Auth0 to call the appropriate Google API. Auth0 does most of the validation work for us by accessing the Google Login API. 
  * For a test, we must supply a test Gmail email and password to login with. Each test user account must have the following:
    - a Gmail email account
    - corresponding password
  * From the provided information, we will only store the email account and name of the user since Google will hold the rest. 
  * There are three possible cases we need to test:
    - a valid user
    - an invalid email
    - an invalid password
    - a non Gmail email
  * We should expect only the first test case to pass and the remaining cases to fail. 
  * In order to test the cases, we will start the app (deploying locally, for now) and initial login procedure by acting as returning users. 
  
  **Document Upload** <br>
  * The UAT will test the document upload functionality. Assuming we are only storing the document titles, we must run the upload.ejs page and check that it is properly displaying a table of documents associated with the user and responding to adding documents. 
  * Each document test must have the following
    - a document title
    - a knowledge level
  * There are two limits on the document title: it must not be blank and it must not be a duplicate of anything currently associated with the user. Backend code should catch both of these errors and report to the user when they occur. 
  * The knowledge level will be set by a dropdown menu of integers 0 to 10 and should default to zero. 
  * There are three test cases to check:
    - a valid document addition
    - a duplicate document
    - a blank document title
  * The test should be initiated by first logging in using an approved account and then trying various uploads as described above. The expected behavior is that the first test will pass and the remaining will fail. 
  
  **Knowledge Surveys** <br>
  * The UAT will test the knowledge survey functionality. Since we store document titles specific to the user, we need to check that the appropriate document titles and knowledge levels are being shown. This means a login session for a logged in user needs to be enacted for this page, and code needs to be added so that the appropriate document titles and their corresponding knowledge levels are pulled. 
  * For this test we need the following:
    - a valid account
    - at least two document titles uploaded with knowledge surveys
  * Much of the testing of this feature will be done by verifying the expected results. When we upload a new document, we expect to see it appear in the knowledge surveys page. When we set a knowledge level, we expect to see that level appear with the document. Additionally, we should prompt the user with the next reccomended study session based on the provided knowledge level. 
  * The key sections of this testing include verifying that a logged in user is passed from page to page and that the appropriate documents are displayed. To initiate this testing, a developer would need to login with an approved testing account, verify the correct documents are being displayed, updated knowledge levels, and add new documents. The developer should check that the information is correctly being stored and displayed. 

### Integration Testing
A type of testing where software modules are integrated logically and tested as a group. A typical software project consists of multiple software modules, coded by different programmers. The purpose of integration testing is to expose defects in the interaction between these software modules when they are integrated.

* The following components where developed independentilly (either by different team members or by the same member in different stages of development) and therefore need to be tested for integration: 
  - SQL Database
  - Node EJS frontend views 
  - Google API
  - File Uploading 

* Testing is needed for the following features: 
  - The integration of our SQL database and the Node EJS upload page so that when the user decides to upload a file, its uuid is created and stored in the database along side the filename. 
  - The integration of the Google API and the NODE EJS home page so that we can embedd the user's google calendar in our own homepage.
  - The integration of Google API, the Database, and the Node EJS upload and home page so that the user can upload files from our webpage to his/her drive. Moreover, the user should also be able to see and access stored files when desired. Another aspect would be so that the event creation can potenntially access and retrieve the user's files.
  - The integration of the page as a whole, the user should be able to safely navigate through the webpage in whatever order he/she wishes to do so, and the webpae should be responsive to all of the user's actions. 
