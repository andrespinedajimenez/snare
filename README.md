
# Snare - Fraud Detection

Snare is a Chrome Extension designed to help users identify potentially fraudulent websites in real-time. By analyzing URL patterns, page content urgency, and other heuristic markers, Snare provides a safety score and alerts users to suspicious activity.

## Features

- **Real-time URL Analysis**: Checks the current URL against known fraud patterns.
- **Content Urgency Detection**: Analyzes page text for high-pressure language often used in scams (e.g., "Act now!", "Limited time!").
- **Visual Safety Score**: Provides an immediate visual indicator of the page's safety level.
- **Detailed Popup**: Shows a breakdown of the analysis and potential risks.

## Installation

### From Source (Developer Mode)

1.  Clone this repository:
    ```bash
    git clone https://github.com/andrespinedajimenez/snare.git
    ```
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** in the top right corner.
4.  Click **Load unpacked**.
5.  Select the `snare` directory from the cloned repository.
6.  The Snare icon should appear in your browser toolbar.

## Usage

1.  Browse the web as usual.
2.  When you land on a page, Snare automatically runs its analysis in the background.
3.  Click the Snare icon in the toolbar to view the safety report.
    *   **Green**: Safe / Low Risk
    *   **Yellow**: Caution / Medium Risk
    *   **Red**: Danger / High Risk
4.  The popup provides details on *why* a page was flagged (e.g., "Suspicious TLD", "High Urgency Content").

## Development

### Prerequisites

*   Node.js (for running tests/linters if applicable in future)
*   A modern web browser (Chrome/Edge/Brave)

### Project Structure

*   `manifest.json`: The extension's configuration file.
*   `background.js`: Service worker for handling background tasks and events.
*   `content.js`: Script injected into web pages to analyze content.
*   `popup.html` & `popup.js`: The user interface for the extension popup.
*   `styles.css`: Styles for the popup.
*   `test_fraud_site.html`: A local HTML file used for testing fraud detection markers.

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or inquiries, please contact:
**Andres Pineda** - andres.pineda@deeploy.co