### EAST contract v1.1.0
- Improved error message for outdated oracle rates
- Fix transfer attachment encoding in claim_overpay operation
- Added validation in "transfer" contract method. If tx sender vault exists AND blocked, transfer will be cancelled
- Completely redesigned automated tests
