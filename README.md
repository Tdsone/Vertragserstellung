# Vertragserstllung Azure FunctionApp

Diese Azure FunctionApp enthält eine HTTP-triggered Function, die aus Sharepoint Informationen automatisch Verträge für Bertungsteams erstellt.
Die Runtime der Function ist Node.js, der package manager ist npm.
Die Function ist in Typescript geschrieben.

## Development
1. `nvm use` // setzt Node Version
2. `npm install` // Installiert packages
3. `npm start` // Startet app lokal

- Auf dem Branch develop kann entwickelt werden, ohne dass die FunctionApp neu deployed wird. 
- Zum lokalen Testen in Visual Studio Code im Menu: Run > Start Debugging
- Um Node Versions Probleme zu vermeiden: `nvm use` im Ordner ausführen. Das im Ordner vorhandene .nvmrc file setzt dann die Node Version automatisch. Falls du einen anderen Node Version manager benutzt, stell bitte sicher, das die Node Version 12.12.0 ist. 
### Requirements
- Node
- Node Version Manager
- npm
- Visual Studio Code

## Deployment
Die FunctionApp wird mit einem push auf den master branch neu deployed.
Die deployte Verision ist hier zu sehen: https://vertragserstellung.azurewebsites.net/api/Vertragserstellung?code=7Sz4f1TaMm1Bahhz1CK1zGnOCNTaVYG37FNQ0KrY0aId8JNkoWhU1A==