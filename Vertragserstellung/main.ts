import Contract from './models/Contract'

// Create a new contract with default values
export async function createDefaultContract(projectID : string, contractType : string){

    const contract = new Contract(projectID, contractType);
    try {
        await contract.createTextWithDefaultValues(); 
        const linkToSPEntry = await contract.saveToSharepoint();
        return {
            error: null,
            info: linkToSPEntry 
        }
    } catch(error) {
        console.error(error)
        return {
            error, 
            info: null
        } 
    }
}
