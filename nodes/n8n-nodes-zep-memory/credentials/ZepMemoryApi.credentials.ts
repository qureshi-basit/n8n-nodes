import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ZepMemoryApi implements ICredentialType {
    name = 'zepMemoryApi';
    displayName = 'Zep Memory API';
    documentationUrl = 'https://docs.getzep.com/api/';
    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'baseUrl',
            type: 'string',
            default: 'https://api.getzep.com',
            description: 'The base URL of your Zep instance',
        },
        {
            typeOptions: {
                password: true,
            },
            default: '',
            description: 'Your Zep API key',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
            },
            url: '={{$credentials.baseUrl}}',
        },
    };
}
