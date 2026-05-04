import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RazorpayApi implements ICredentialType {
	name = 'razorpayApi';
	displayName = 'Razorpay API';
	documentationUrl = 'https://razorpay.com/docs/api/';
	properties: INodeProperties[] = [
		{
			displayName: 'Key ID',
			name: 'keyId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Razorpay Key ID',
		},
		{
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Razorpay Key Secret',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Basic {{ $credentials.keyId + ":" + $credentials.keySecret | base64encode }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: 'https://api.razorpay.com/v1',
			method: 'GET',
			qs: {
				count: 1,
			},
		},
	};
}
