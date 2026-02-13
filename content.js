// content.js - Snare Content Analysis

const URGENCY_KEYWORDS = [
    "urgent", "act now", "immediate action", "verify your account",
    "account suspended", "unauthorized access", "click here to login"
];

function analyzePageContent() {
    const text = document.body.innerText.toLowerCase();
    let score = 0;
    let reasons = [];

    let keywordCount = 0;
    URGENCY_KEYWORDS.forEach(keyword => {
        if (text.includes(keyword)) {
            keywordCount++;
        }
    });

    if (keywordCount > 0) {
        score += 10 * keywordCount;
        reasons.push(`Found ${keywordCount} urgency keywords`);
    }

    // Cap content score for sanity
    if (score > 40) score = 40;

    return { riskScore: score, reasons: reasons };
}

function showWarningBanner(reasons) {
    // Check if banner already exists
    if (document.getElementById('snare-warning-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'snare-warning-banner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #D32F2F;
        color: white;
        text-align: center;
        padding: 15px;
        z-index: 999999;
        font-family: sans-serif;
        font-size: 16px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;

    banner.innerHTML = `
        <strong>⚠️ Snare Warning:</strong> This page is flagged as dangerous.
        <span style="font-size: 14px; opacity: 0.9;">(${reasons.join(', ')})</span>
        <button id="snare-close-btn" style="
            margin-left: 20px;
            background: rgba(255,255,255,0.2);
            border: 1px solid white;
            color: white;
            padding: 5px 10px;
            cursor: pointer;
            border-radius: 4px;
        ">Dismiss</button>
    `;

    document.body.prepend(banner);

    document.getElementById('snare-close-btn').addEventListener('click', () => {
        banner.remove();
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze_content') {
        const result = analyzePageContent();
        sendResponse(result);
    } else if (request.action === 'show_warning') {
        showWarningBanner(request.reasons);
    }
});