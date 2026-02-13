// content.js - Content script that runs on every page

console.log('Content script injected');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        // Perform analysis on the current page
        const pageText = document.body.innerText;
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        sendResponse({
            status: 'success',
            data: {
                title: pageTitle,
                url: pageUrl,
                textLength: pageText.length
            }
        });
    }
});

// Analyze the current page when it loads
window.addEventListener('load', () => {
    console.log('Page loaded:', document.title);
});