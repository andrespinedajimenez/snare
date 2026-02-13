document.addEventListener('DOMContentLoaded', function() {
  const statusDiv = document.getElementById('status');
  const detailsDiv = document.getElementById('details');
  const scanBtn = document.getElementById('scanBtn');

  // Request status from background
  function updateStatus() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.runtime.sendMessage({action: "get_status", tabId: tabs[0].id}, function(response) {
          if (response) {
             renderStatus(response);
          } else {
             statusDiv.textContent = "No Data";
          }
        });
      }
    });
  }

  function renderStatus(data) {
    statusDiv.className = 'status-box'; // reset
    if (data.riskScore === 0) {
      statusDiv.classList.add('status-safe');
      statusDiv.textContent = "SAFE";
      detailsDiv.textContent = "No threats detected.";
    } else if (data.riskScore < 50) {
        statusDiv.classList.add('status-warning');
        statusDiv.textContent = "SUSPICIOUS";
        detailsDiv.textContent = "Some suspicious elements found: " + data.reasons.join(", ");
    } else {
        statusDiv.classList.add('status-danger');
        statusDiv.textContent = "DANGEROUS";
        detailsDiv.textContent = "High risk detected: " + data.reasons.join(", ");
    }
  }

  scanBtn.addEventListener('click', () => {
    statusDiv.textContent = "Scanning...";
    // Trigger re-scan in background
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.runtime.sendMessage({action: "trigger_scan", tabId: tabs[0].id}, function(response) {
         // wait a bit for scan to complete or handle promise if we go that route
         setTimeout(updateStatus, 500);
      });
    });
  });

  updateStatus();
});
