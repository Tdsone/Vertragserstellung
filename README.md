# Vertragserstllung Azure FunctionApp

Diese Azure FunctionApp enthält eine HTTP-triggered Function, die aus Sharepoint Informationen automatisch Verträge für Bertungsteams erstellt.
Die Runtime der Function ist Node.js, der package manager ist npm.
Die Function ist in Typescript geschrieben.

## Development
- Auf dem Branch develop kann entwickelt werden, ohne dass die FunctionApp neu deployed wird. 
- Zum lokalen Testen in Visual Studio Code im Menu: Run > Start Debugging
- Um Node Versions Probleme zu vermeiden: <pre>nvm use</pre> im Ordner ausführen. Das im Ordner vorhandene .nvmrc file setzt dann die Node Version automatisch.
### Requirements
- Node
- Node Version Manager
- npm
- Visual Studio Code

## Deployment
Die FunctionApp wird mit einem push auf den master branch neu deployed.
Die deployte Verision ist hier zu sehen: https://vertragserstellung.azurewebsites.net/api/Vertragserstellung?code=7Sz4f1TaMm1Bahhz1CK1zGnOCNTaVYG37FNQ0KrY0aId8JNkoWhU1A==