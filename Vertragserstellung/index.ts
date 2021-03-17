import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {createDefaultContract} from './main'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    // check if projectID and contractType are specified
    if(req.query.projectID && req.query.contractType){

        const projectID = req.query.projectID
        const contractType = req.query.contractType

        const {info, error} = await createDefaultContract(projectID, contractType)

        if(error){
            context.res = {
                status: 400,
                body: {
                    message: "Something went wrong creating the default contract"
                }
            }
        } else {
            context.res = {
                status: 200,
                body: {
                    message: "The contract was sucessfully created", 
                }
            }
        }
    } else {
        context.res = {
            status: 400, 
            body: `One of the following parameters might be missing: projectID, contractType`
        }
    }
    context.done()
};

export default httpTrigger;