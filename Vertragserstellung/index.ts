import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { createDefaultContract } from './main';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('HTTP trigger function processed a request.');

  if (!req.query.projectID) {
    context.res = {
      status: 400,
      body: `projectID is missing as query parameter.`
    };
    context.done();
  }

  if (!req.query.contractType) {
    context.res = {
      status: 400,
      body: `contractType is missing as query parameter.`
    };
    context.done();
  }

  if (!process.env['CLIENT_ID']) {
    context.res = {
      status: 400,
      body: `CLIENT_ID is missing as env variable.`
    };
    context.done();
  }

  if (!process.env['CLIENT_SECRET']) {
    context.res = {
      status: 400,
      body: `CLIENT_SECRET is missing as env variable.`
    };
    context.done();
  }

  const projectID = req.query.projectID;
  const contractType = req.query.contractType;

  const clientID = process.env['CLIENT_ID'];
  const clientSecret = process.env['CLIENT_SECRET'];

  const { info, error } = await createDefaultContract(
    projectID,
    contractType,
    clientID,
    clientSecret
  );

  if (!error) {
    context.res = {
      status: 200,
      body: {
        message: 'The contract was sucessfully created'
        // TODO pass info
      }
    };
  } else {
    context.res = {
      status: 500,
      body: {
        message: 'We could not create your contract'
      }
    };
  }
  context.done();
};

export default httpTrigger;
