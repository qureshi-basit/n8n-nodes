import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';

export class ZepMemory implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zep Memory',
		name: 'zepMemory',
		icon: 'fa:brain',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Zep Memory service for AI conversation management',
		defaults: {
			name: 'Zep Memory',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'zepMemoryApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'Memory',
						value: 'memory',
					},
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'session',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['session'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new session',
						action: 'Create a session',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get session information',
						action: 'Get a session',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update session metadata',
						action: 'Update a session',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a session',
						action: 'Delete a session',
					},
				],
				default: 'create',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['memory'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get session memory',
						action: 'Get memory',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search session memory',
						action: 'Search memory',
					},
				],
				default: 'get',
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
						name: 'Add',
						value: 'add',
						description: 'Add message to session',
						action: 'Add a message',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get messages from session',
						action: 'Get messages',
					},
				],
				default: 'add',
			},
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'session-123',
				description: 'Unique identifier for the session',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'User ID associated with the session',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				placeholder: 'Add metadata',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'metadata',
						displayName: 'Metadata',
						values: [
							{
								displayName: 'Key',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Metadata key',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Metadata value',
							},
						],
					},
				],
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['add'],
					},
				},
				options: [
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Assistant',
						value: 'assistant',
					},
					{
						name: 'System',
						value: 'system',
					},
				],
				default: 'user',
				required: true,
				description: 'Role of the message sender',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['add'],
					},
				},
				default: '',
				required: true,
				description: 'Message content',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['memory'],
						operation: ['search'],
					},
				},
				default: '',
				required: true,
				description: 'Search query for memory',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['message'],
						operation: ['get'],
					},
				},
				default: 10,
				description: 'Maximum number of messages to retrieve',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData: any = {};
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const sessionId = this.getNodeParameter('sessionId', i) as string;

				let options: IHttpRequestOptions = {
					method: 'GET',
					url: '',
					json: true,
				};

				if (resource === 'session') {
					if (operation === 'create') {
						const userId = this.getNodeParameter('userId', i) as string;
						const metadata = this.getNodeParameter('metadata', i) as IDataObject;

						const body: IDataObject = {
							session_id: sessionId,
						};

						if (userId) {
							body.user_id = userId;
						}

						if (metadata && metadata.metadata && Array.isArray(metadata.metadata)) {
							const metadataObj: IDataObject = {};
							for (const item of metadata.metadata as IDataObject[]) {
								metadataObj[item.key as string] = item.value;
							}
							body.metadata = metadataObj;
						}

						options = {
							method: 'POST',
							url: '/api/v1/sessions',
							body,
							json: true,
						};
					} else if (operation === 'get') {
						options = {
							method: 'GET',
							url: `/api/v1/sessions/${sessionId}`,
							json: true,
						};
					} else if (operation === 'update') {
						const metadata = this.getNodeParameter('metadata', i) as IDataObject;

						const body: IDataObject = {};

						if (metadata && metadata.metadata && Array.isArray(metadata.metadata)) {
							const metadataObj: IDataObject = {};
							for (const item of metadata.metadata as IDataObject[]) {
								metadataObj[item.key as string] = item.value;
							}
							body.metadata = metadataObj;
						}

						options = {
							method: 'PATCH',
							url: `/api/v1/sessions/${sessionId}`,
							body,
							json: true,
						};
					} else if (operation === 'delete') {
						options = {
							method: 'DELETE',
							url: `/api/v1/sessions/${sessionId}`,
							json: true,
						};
					}
				} else if (resource === 'memory') {
					if (operation === 'get') {
						options = {
							method: 'GET',
							url: `/api/v1/sessions/${sessionId}/memory`,
							json: true,
						};
					} else if (operation === 'search') {
						const query = this.getNodeParameter('query', i) as string;

						options = {
							method: 'POST',
							url: `/api/v1/sessions/${sessionId}/search`,
							body: {
								text: query,
							},
							json: true,
						};
					}
				} else if (resource === 'message') {
					if (operation === 'add') {
						const role = this.getNodeParameter('role', i) as string;
						const content = this.getNodeParameter('content', i) as string;

						options = {
							method: 'POST',
							url: `/api/v1/sessions/${sessionId}/messages`,
							body: {
								messages: [
									{
										role: role,
										content: content,
									},
								],
							},
							json: true,
						};
					} else if (operation === 'get') {
						const limit = this.getNodeParameter('limit', i) as number;

						options = {
							method: 'GET',
							url: `/api/v1/sessions/${sessionId}/messages`,
							qs: {
								limit: limit,
							},
							json: true,
						};
					}
				}

				responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'zepMemoryApi',
					options,
				);

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
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
