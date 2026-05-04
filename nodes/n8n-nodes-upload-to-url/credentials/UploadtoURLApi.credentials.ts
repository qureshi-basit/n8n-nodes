import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UploadtoURLApi implements ICredentialType {
	name = 'uploadtoURLApi';
	displayName = 'Upload to URL API';
	documentationUrl = 'https://docs.uploadtourl.com/api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Upload to URL API key',
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

	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseUrl}}',
			method: 'GET',
		},
	};
}
