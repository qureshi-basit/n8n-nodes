import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class ClaudePro implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Claude Pro',
		name: 'claudePro',
		icon: 'file:claude.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Claude Pro/Max AI models via Anthropic API',
		defaults: {
			name: 'Claude Pro',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'claudeProApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.anthropic.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'message',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message to Claude',
						action: 'Send a message',
					},
				],
				default: 'send',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				options: [
					{
						name: 'Claude 3 Haiku',
						value: 'claude-3-haiku-20240307',
					},
					{
						name: 'Claude 3 Sonnet',
						value: 'claude-3-sonnet-20240229',
					},
					{
						name: 'Claude 3 Opus',
						value: 'claude-3-opus-20240229',
					},
					{
						name: 'Claude 3.5 Sonnet',
						value: 'claude-3-5-sonnet-20241022',
					},
				],
				default: 'claude-3-5-sonnet-20241022',
				description: 'The Claude model to use',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: '',
				placeholder: 'Enter your message...',
				description: 'The message to send to Claude',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				default: 1024,
				description: 'Maximum number of tokens to generate',
				typeOptions: {
					minValue: 1,
					maxValue: 4096,
				},
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['send'],
					},
				},
				options: [
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 1,
						description: 'Controls randomness in the response (0.0 to 1.0)',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
					},
					{
						displayName: 'System Message',
						name: 'system',
						type: 'string',
						default: '',
						description: 'System message to set the behavior of Claude',
						typeOptions: {
							rows: 2,
						},
					},
					{
						displayName: 'Top P',
						name: 'topP',
						type: 'number',
						default: 1,
						description: 'Controls diversity of the response (0.0 to 1.0)',
						typeOptions: {
							minValue: 0,
							maxValue: 1,
							numberPrecision: 2,
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any = {};

				if (resource === 'message' && operation === 'send') {
					const model = this.getNodeParameter('model', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const maxTokens = this.getNodeParameter('maxTokens', i) as number;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

					const body: IDataObject = {
						model,
						max_tokens: maxTokens,
						messages: [
							{
								role: 'user',
								content: message,
							},
						],
					};

					if (additionalFields.temperature !== undefined) {
						body.temperature = additionalFields.temperature;
					}

					if (additionalFields.system) {
						body.system = additionalFields.system;
					}

					if (additionalFields.topP !== undefined) {
						body.top_p = additionalFields.topP;
					}

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: '/v1/messages',
						body,
						json: true,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'claudeProApi',
						options,
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
