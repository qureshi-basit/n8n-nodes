import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class ClayApi implements ICredentialType {
    name = 'clayApi';
    displayName = 'Clay API';
    documentationUrl = 'https://docs.clay.com/en/';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Your Clay API key',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.apiKey}}',
                'Content-Type': 'application/json',
            },
        },
    };
}
