# ticket system
This is a complete ticket system, made mainly for my Maturaball.
It has two functions: Creating tickets with a QR-Code, and scanning them.
Security is given by creating a QR-Code consisting of a unique nonce appended to the hash of (password+nonce).
The hash function used is part of the crypto-API.
As this is a static page, it does not support cross-device-syncing of already scanned tickets. 
The verification of the password and saving the already used nonces per device works through.

The site is visible under: <a href="https://ticket.ondasadriel.com">ticket.ondasadriel.com</a>
