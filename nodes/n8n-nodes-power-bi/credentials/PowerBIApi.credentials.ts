import {
    IAuthenticateGeneric,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class PowerBIApi implements ICredentialType {
    name = 'powerBIApi';
    displayName = 'Power BI API';
    documentationUrl = 'https://docs.microsoft.com/en-us/power-bi/developer/embedded/register-app';
    properties: INodeProperties[] = [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'Power BI API access token. You can get this from Azure AD app registration.',
        },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                Authorization: '=Bearer {{$credentials.accessToken}}',
            },
        },
    };
}
