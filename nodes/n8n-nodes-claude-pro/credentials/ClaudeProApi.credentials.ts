import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ClaudeProApi implements ICredentialType {
	name = 'claudeProApi';
	displayName = 'Claude Pro API';
	documentationUrl = 'https://docs.anthropic.com/claude/reference/getting-started-with-the-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Anthropic API key from the Claude Pro/Max subscription',
		},
	];

	authenticate: IAuthenticateGeneric = {
        type: 'generic',
		properties: {
			headers: {
				'x-api-key': '={{$credentials.apiKey}}',
				'Content-Type': 'application/json',
				'anthropic-version': '2023-06-01',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: 'https://api.anthropic.com',
			method: 'POST',
			body: {
				model: 'claude-3-sonnet-20240229',
				max_tokens: 10,
				messages: [
					{
						role: 'user',
						content: 'Hello',
					},
				],
			},
		},
	};
}
