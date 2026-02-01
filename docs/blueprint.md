# **App Name**: PassGenius

## Core Features:

- Password Input and Salt: Accepts user input for the password and salt via text input fields.
- SHA256 Encryption: Encrypts the concatenated password and salt using SHA256 algorithm.
- Password Generation - General: Generates a password by taking the first 10 characters of the SHA256 hash, capitalizing the first letter.
- Password Generation - 6-digit: Generates a password by taking the last 6 digits of the SHA256 hash.
- Password Generation - 8-digit: Generates a password by taking the middle 8 digits of the SHA256 hash.
- PWA Compliance: Ensures the application meets PWA (Progressive Web App) standards for installability and offline functionality.

## Style Guidelines:

- Primary color: Strong Blue (#2962FF) to represent security and reliability.
- Background color: Light grayish-blue (#D2DFF7), complementing the primary blue.
- Accent color: Analogous Purple (#9D4EDD) to highlight actions without being distracting.
- Headline font: 'Space Grotesk', sans-serif, to ensure clear titles. Body font: 'Inter', sans-serif, for comfortable reading. Code font: 'Source Code Pro' for password display.
- Use lock and key icons to represent security and password generation. Minimize decorative icons to keep interface clean.
- Simple and intuitive layout with clear labels for inputs and password options.
- Subtle fade-in animations for password display and interactive elements.