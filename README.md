# TracerJS

TracerJS is a lightweight JavaScript library for generating unique and consistent browser identifiers (fingerprints) by collecting various environmental data points. The library can be used for security purposes, bot detection, fraud prevention, and analytics. However, it may raise privacy concerns, and users must be aware of the ethical implications of using browser fingerprinting.

## Disclaimer

**Warning:** TracerJS is a tool that can be used for tracking users across different browsing sessions. It is important to comply with privacy laws and regulations (e.g., GDPR, CCPA) when using this library. Inform users if fingerprinting is employed and provide an option to opt out. The author of TracerJS is not responsible for any misuse of the library or violations of privacy laws by developers using this tool.

## Installation

Simply copy the `Tracer.JS` content into your JavaScript file or include it as a script in your project.

## Usage

Use the `getConsistentFingerprint` function to generate a unique fingerprint for a user's browser environment:

```javascript
getConsistentFingerprint().then(fingerprint => {
    console.log('Consistent Fingerprint:', fingerprint);
});
