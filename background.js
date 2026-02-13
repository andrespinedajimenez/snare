// background.js - Handles extension lifecycle and background tasks

// Called when the extension is installed
chrome.runtime.onInstalled.addListener(function() {
    console.log('Extension installed on ' + new Date().toUTCString());
});

// Called when the extension is updated
chrome.runtime.onUpdated.addListener(function() {
    console.log('Extension updated on ' + new Date().toUTCString());
});

// Example: A recurring background task
setInterval(() => {
    console.log('Running a recurring task at ' + new Date().toUTCString());
}, 60000); // Runs every minute