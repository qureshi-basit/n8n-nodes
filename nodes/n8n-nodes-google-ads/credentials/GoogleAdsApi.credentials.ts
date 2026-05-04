import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GoogleAdsApi implements ICredentialType {
	name = 'googleAdsApi';
	displayName = 'Google Ads API';
	documentationUrl = 'https://developers.google.com/google-ads/api/docs/first-call/overview';
	properties: INodeProperties[] = [
		{
			displayName: 'Developer Token',
			name: 'developerToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Developer token for Google Ads API',
		},
		{
		},
		{
		},
		{
		},
		{
		},
	];

	authenticate: IAuthenticateGeneric = {
        type: 'generic',
		properties: {
			headers: {
				'developer-token': '={{$credentials.developerToken}}',
				'login-customer-id': '={{$credentials.customerId}}',
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};
}
