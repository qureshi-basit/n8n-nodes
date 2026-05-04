import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class GPTImage15Api implements ICredentialType {
    name = 'gPTImage15Api';
    displayName = 'GPT Image 1.5 API';
    documentationUrl = 'https://docs.gptimage15.com/api';
    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Your GPT Image 1.5 API key',
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
