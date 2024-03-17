"use strict";
//When making updates to the JSON schema (the data structure of SETUP, USER_DATA and HISTORY) I'll need to update older users to the new schema before the app can use the data at all
const APP_VERSION = 1;
//Asssume storage.js has already been loaded
//Initialise global variables
const TODAY_DATE = new Date();
const SETUP = GetData(SETUP_KEY);
const USER_DATA = GetData(USER_DATA_KEY); //load from local storage
const HISTORY = GetData(HISTORY_KEY);
//Apply migrations to this this data depending on the app version (stored in setup)
