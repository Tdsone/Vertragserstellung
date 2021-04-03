# Vertragserstellung Azure FunctionApp

Diese Azure FunctionApp enthält eine HTTP-triggered Function, die aus Sharepoint Informationen automatisch Verträge für Bertungsteams erstellt.
Die Runtime der Function ist Node.js, der package manager ist npm.
Die Function ist in Typescript geschrieben.

## API Endpoints

### POST /createContract to create a new contract with default values

- method: POST
- URL: https://vertragserstellung.azurewebsites.net/api/Vertragserstellung/createContract?code=7Sz4f1TaMm1Bahhz1CK1zGnOCNTaVYG37FNQ0KrY0aId8JNkoWhU1A==&projectID=YOUR-PROJECT-ID&contractType=YOUR-CONTRACT-TYPE
- function: this will create a new entry in the Sharepoint List 3_ProjektVertraege with the HTML text of the contract based on the data of the specified project and the template of the contract type provided

## Development

1. `nvm use` // setzt Node Version
2. `npm install` // Installiert packages
3. `npm start` // Startet app lokal

- Auf dem Branch develop kann entwickelt werden, ohne dass die FunctionApp neu deployed wird.
- Zum lokalen Testen in Visual Studio Code im Menu: Run > Start Debugging
- Um Node Versions Probleme zu vermeiden: `nvm use` im Ordner ausführen. Das im Ordner vorhandene .nvmrc file setzt dann die Node Version automatisch. Falls du einen anderen Node Version manager benutzt, stell bitte sicher, das die Node Version 12.12.0 ist.

### Style Guidline

To format the code correctly there are 2 options:

- Run `npm run format` // this will format the code using the prettier npm module
- Use VS Code with the prettier extension installed (see https://khalilstemmler.com/blogs/tooling/prettier/ for instructions)

### Requirements

- Node
- Node Version Manager (nvm)
- npm
- Visual Studio Code (optional, but makes it a lot easier)

## Deployment

Die FunctionApp wird mit einem push auf den master branch neu deployed.
Die deployte Verision ist hier zu sehen: https://vertragserstellung.azurewebsites.net/api/Vertragserstellung?code=7Sz4f1TaMm1Bahhz1CK1zGnOCNTaVYG37FNQ0KrY0aId8JNkoWhU1A==

## Lessons Learned

- Use the [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) by Microsoft to test requests before implementing them.
- Sometimes, Graph API requests work in the Graph Explorer but fail when using OData filters and Axios as the request library. In some cases, this is because the specified column that is filtered is not indexed. Fix: index the column in the respective SharePoint list. => [here is how](https://support.microsoft.com/en-us/office/add-an-index-to-a-list-or-library-column-f3f00554-b7dc-44d1-a2ed-d477eac463b0?ui=en-us&rs=en-us&ad=us)
