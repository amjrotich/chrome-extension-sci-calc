# Scientific Calculator Chrome Extension

A lightweight, feature-rich scientific calculator as a Chrome extension, providing quick access to mathematical calculations directly from your browser.

## Author
Jeremiah Rotich

## Features

- **Basic Operations**: Addition, subtraction, multiplication, division
- **Scientific Functions**: Sine, cosine, tangent, square root, logarithm, and power
- **User-Friendly Interface**: Clean design with intuitive button layout
- **Calculation History**: View your recent calculations
- **Error Handling**: Robust error detection and recovery
- **Security Compliant**: Built to meet Chrome's Content Security Policy requirements

## Installation

### From Chrome Web Store
*(Coming Soon)*

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the extension folder
5. The calculator will appear in your Chrome extensions toolbar

## Usage

1. Click the calculator icon in your Chrome toolbar
2. Enter your mathematical expression using the calculator buttons
3. Press "=" to calculate the result
4. View your calculation history in the bottom section

## Technical Details

- **No External Dependencies**: Self-contained with no reliance on external libraries
- **Custom Expression Parser**: Secure evaluation without using JavaScript's `eval()`
- **Manifest V3 Compatible**: Built using the latest Chrome extension standards

## Development

### Project Structure
```
scientific-calculator/
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── index.html     # Main calculator interface
├── calculator.js  # Calculator logic
├── manifest.json  # Extension configuration
└── README.md      # Documentation
```

### Building and Testing
1. Make changes to the code as needed
2. Load the unpacked extension in Chrome as described in the Installation section
3. Test all functionality thoroughly

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Memory functions (M+, M-, MR, MC)
- Unit conversion capabilities
- Customizable themes
- Keyboard input support
- Formula saving feature

---

Made with ❤️ by Jeremiah Rotich
