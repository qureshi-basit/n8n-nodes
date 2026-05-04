import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PowerBIApi implements ICredentialType {
	name = 'powerBIApi';
	displayName = 'Power BI API';
	documentationUrl = 'https://docs.microsoft.com/en-us/rest/api/power-bi/';
	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
			description: 'The Client ID of your Azure AD application',
		},
		{
			typeOptions: { password: true },
		},
		{
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
