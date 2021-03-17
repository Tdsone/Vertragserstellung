import SharePoint from './GraphAPI'
import {} from '../constants'

 // Globals
const GBR_VERTRAG = "Gesellschaftervertrag"
const BERATUNGS_VERTRAG = "Beratungsvertrag"
const TREUH_PROVIS_VERTRAG = "Treuhand- und Provisionsvertrag"
const CONTR_VERTRAG = "Controllervertrag"

// Class
 export default class Contract {
 
    type : string;
    text : string;
    sharePoint : SharePoint;
    templateText : string; 

    constructor(type){
        this.type = type; 
        this.text = "";
        this.sharePoint = null;
    }

    async initialize(){
        this.sharePoint = new SharePoint()
        this.sharePoint.initialize() // TODO provide init details
    }

    async fetchContractTemplateText() : Promise<string>{
        switch(this.type){
            this.sharePoint.getSPListItem()
        }
    }

    async generateGbRVertragPlaceholderMap(){

    }

    async generateControllerVertragPlaceholderMap(){

    }

    async generateTreuhUndProvisVertragPlaceholderMap(){

    }

    async generateBeratVertragPlaceholderMap(){

    }

    // fetches default values and the respective placeholders and save them to a sharepoint list 
    async generateDefaultPlaceholderValueMap(){
        switch(this.type){
            case GBR_VERTRAG: 
                return this.generateGbRVertragPlaceholderMap()
            case BERATUNGS_VERTRAG:
                return this.generateGbRVertragPlaceholderMap()
            case CONTR_VERTRAG: 
                return this.generateControllerVertragPlaceholderMap()
            case TREUH_PROVIS_VERTRAG: 
                return this.generateTreuhUndProvisVertragPlaceholderMap()
            default: 
                throw new Error("There is no matching function for the given contract type")
        }
    }

    // creates a contract text out of a template with placeholders and the replacements
    async generateContractText(replacePlaceholders){
        
        let templateText : string; 
        let placeholderValueMap : Map<string, string>

        try {
            
            let promises : Promise<any>[] = [this.fetchContractTemplateText(), this.generateDefaultPlaceholderValueMap()]
            const data = await Promise.all(promises)
            
            templateText = data[0]
            placeholderValueMap = data[1]

            if(!templateText || !placeholderValueMap){
                throw new Error("An error occurred fetching default values or template")
            }    
        } catch(error){
            console.error(error)
        }

        const text = replacePlaceholders(templateText, placeholderValueMap)
        this.setText(text)
    }

    async saveToSharepoint(){
   
    }

    setText(text : string){
        this.text = text
    }

   
}