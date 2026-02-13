// background.js - Snare Fraud Detection Logic

// Risk scoring constants
const RISK_THRESHOLDS = {
    SUSPICIOUS: 20,
    DANGEROUS: 50
};

// Simple heuristic checks
function calculateUrlRisk(url) {
    let score = 0;
    let reasons = [];

    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;

        // Check for IP address usage
        if (/^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(hostname)) {
            score += 40;
            reasons.push("IP address used as hostname");
        }

        // Check for long subdomains (potential phishing)
        const parts = hostname.split('.');
        if (parts.length > 3) {
            score += 10;
            reasons.push("Excessive subdomains");
        }

        // Check for sensitive keywords in domain (simplified)
        const sensitive = ['login', 'secure', 'account', 'verify', 'update', 'banking'];
        if (sensitive.some(keyword => hostname.includes(keyword) && !hostname.includes('google') && !hostname.includes('facebook'))) { // Very basic allowlist for demo
            score += 15;
            reasons.push("Sensitive keyword in domain");
        }

    } catch (e) {
        console.error("Invalid URL:", url);
    }

    return { score, reasons };
}

// Store risk state per tab
let tabRisks = {};

// Monitor tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        analyzeTab(tabId, tab.url);
    }
});

// Analyze a tab
function analyzeTab(tabId, url) {
    // 1. URL Analysis
    const urlAnalysis = calculateUrlRisk(url);

    // 2. Content Analysis (ask content script)
    chrome.tabs.sendMessage(tabId, { action: 'analyze_content' }, (response) => {
        if (chrome.runtime.lastError) {
            // Content script might not be loaded yet or unrelated error
            finalizeRisk(tabId, urlAnalysis.score, urlAnalysis.reasons);
            return;
        }

        let finalScore = urlAnalysis.score;
        let finalReasons = urlAnalysis.reasons;

        if (response && response.riskScore) {
            finalScore += response.riskScore;
            finalReasons = finalReasons.concat(response.reasons);
        }

        finalizeRisk(tabId, finalScore, finalReasons);
    });
}

function finalizeRisk(tabId, score, reasons) {
    tabRisks[tabId] = { riskScore: score, reasons: reasons };

    // Update badge
    if (score >= RISK_THRESHOLDS.DANGEROUS) {
        chrome.action.setBadgeText({ text: "!", tabId: tabId });
        chrome.action.setBadgeBackgroundColor({ color: "#D32F2F", tabId: tabId });

        // Trigger warning banner
        chrome.tabs.sendMessage(tabId, { action: 'show_warning', reasons: reasons });

    } else if (score >= RISK_THRESHOLDS.SUSPICIOUS) {
        chrome.action.setBadgeText({ text: "?", tabId: tabId });
        chrome.action.setBadgeBackgroundColor({ color: "#FFA000", tabId: tabId });
    } else {
        chrome.action.setBadgeText({ text: "", tabId: tabId });
    }
}

// Handle messages from Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_status") {
        const tabId = request.tabId;
        sendResponse(tabRisks[tabId] || { riskScore: 0, reasons: [] });
    } else if (request.action === "trigger_scan") {
        analyzeTab(request.tabId, sender.tab ? sender.tab.url : "unknown"); // Simplify for demo
        sendResponse({ status: "started" });
    }
});