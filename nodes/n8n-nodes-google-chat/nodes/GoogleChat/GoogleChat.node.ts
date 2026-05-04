import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class GoogleChat implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Chat',
		name: 'googleChat',
		icon: 'file:googleChat.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Google Chat API',
		defaults: {
			name: 'Google Chat',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleChatApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a message to a Google Chat space',
						action: 'Send a message',
					},
					{
						name: 'List Messages',
						value: 'listMessages',
						description: 'List messages from a Google Chat space',
						action: 'List messages',
					},
					{
						name: 'Get Message',
						value: 'getMessage',
						description: 'Get a specific message from Google Chat',
						action: 'Get a message',
					},
					{
						name: 'Create Space',
						value: 'createSpace',
						description: 'Create a new Google Chat space',
						action: 'Create a space',
					},
					{
						name: 'List Spaces',
						value: 'listSpaces',
						description: 'List Google Chat spaces',
						action: 'List spaces',
					},
				],
				default: 'sendMessage',
			},
			{
				displayName: 'Space Name',
				name: 'spaceName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage', 'listMessages', 'getMessage'],
					},
				},
				default: '',
				placeholder: 'spaces/SPACE_ID',
				description: 'The name of the space (format: spaces/SPACE_ID)',
			},
			{
				displayName: 'Message',
				name: 'messageText',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['sendMessage'],
					},
				},
				default: '',
				description: 'The text message to send',
			},
			{
				displayName: 'Message Name',
				name: 'messageName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getMessage'],
					},
				},
				default: '',
				placeholder: 'spaces/SPACE_ID/messages/MESSAGE_ID',
				description: 'The name of the message (format: spaces/SPACE_ID/messages/MESSAGE_ID)',
			},
			{
				displayName: 'Space Display Name',
				name: 'spaceDisplayName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createSpace'],
					},
				},
				default: '',
				description: 'The display name for the new space',
			},
			{
				displayName: 'Space Type',
				name: 'spaceType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createSpace'],
					},
				},
				options: [
					{
						name: 'Room',
						value: 'ROOM',
					},
					{
						name: 'DM',
						value: 'DM',
					},
				],
				default: 'ROOM',
				description: 'The type of space to create',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['listMessages', 'listSpaces'],
					},
				},
				default: 100,
				description: 'Maximum number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: any = {};

				if (operation === 'sendMessage') {
					const spaceName = this.getNodeParameter('spaceName', i) as string;
					const messageText = this.getNodeParameter('messageText', i) as string;

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: `https://chat.googleapis.com/v1/${spaceName}/messages`,
						json: true,
						body: {
							text: messageText,
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'googleChatApi',
						options,
					);
				} else if (operation === 'listMessages') {
					const spaceName = this.getNodeParameter('spaceName', i) as string;
					const pageSize = this.getNodeParameter('pageSize', i) as number;

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `https://chat.googleapis.com/v1/${spaceName}/messages`,
						json: true,
						qs: {
							pageSize,
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'googleChatApi',
						options,
					);
				} else if (operation === 'getMessage') {
					const messageName = this.getNodeParameter('messageName', i) as string;

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `https://chat.googleapis.com/v1/${messageName}`,
						json: true,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'googleChatApi',
						options,
					);
				} else if (operation === 'createSpace') {
					const spaceDisplayName = this.getNodeParameter('spaceDisplayName', i) as string;
					const spaceType = this.getNodeParameter('spaceType', i) as string;

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: 'https://chat.googleapis.com/v1/spaces',
						json: true,
						body: {
							displayName: spaceDisplayName,
							spaceType,
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'googleChatApi',
						options,
					);
				} else if (operation === 'listSpaces') {
					const pageSize = this.getNodeParameter('pageSize', i) as number;

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: 'https://chat.googleapis.com/v1/spaces',
						json: true,
						qs: {
							pageSize,
						},
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'googleChatApi',
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
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData.map(item => ({ json: item as any }))];
	}
}
