import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GoogleChatApi implements ICredentialType {
	name = 'googleChatApi';
	displayName = 'Google Chat API';
	documentationUrl = 'https://developers.google.com/chat/api';
	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
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
	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://chat.googleapis.com/v1/spaces',
		},
	};
}
