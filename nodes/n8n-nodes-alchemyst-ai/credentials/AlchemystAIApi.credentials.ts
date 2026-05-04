import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AlchemystAIApi implements ICredentialType {
	name = 'alchemystAIApi';
	displayName = 'Alchemyst AI API';
	description = 'Alchemyst AI API credentials';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Alchemyst AI API key',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
		  default: '',

		}
,
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

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseUrl}}',
			method: 'GET',
		},
	};
}
