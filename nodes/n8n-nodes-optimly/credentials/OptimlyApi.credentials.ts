import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class OptimlyApi implements ICredentialType {
  name = 'optimlyApi';
  displayName = 'Optimly API';
  documentationUrl = 'https://docs.optimly.com/api';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Optimly API key',
    },
    {
    },
  ];

  authenticate: IAuthenticateGeneric = {
        type: 'generic',
    properties: {
      headers: {
        'Authorization': '=Bearer {{$credentials.apiKey}}',
        'Content-Type': 'application/json',
      },
    },
  };
}
