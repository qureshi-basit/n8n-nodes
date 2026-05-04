import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZepMemoryApi implements ICredentialType {
	name = 'zepMemoryApi';
	displayName = 'Zep Memory API';
	documentationUrl = 'https://docs.getzep.com/';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'apiUrl',
			type: 'string',
			default: 'http://localhost:8000',
			placeholder: 'http://localhost:8000',
			description: 'The URL of your Zep server',
		},
		{
			typeOptions: { password: true },
		},
	];

	authenticate: IAuthenticateGeneric = {
        type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.apiUrl}}',
			method: 'GET',
		},
	};
}
