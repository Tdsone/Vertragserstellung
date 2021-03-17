import SharePoint from './Sharepoint'
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
        return ""
    }
    
    async generatePlaceholderValueMap() : Promise<Map<string, string>>{
        return new Map()
    }

    async generateContractText(replacePlaceholders){
        
        let templateText : string; 
        let placeholderValueMap : Map<string, string>

        try {
            
            let promises : Promise<any>[] = [this.fetchContractTemplateText(), this.generatePlaceholderValueMap()]
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