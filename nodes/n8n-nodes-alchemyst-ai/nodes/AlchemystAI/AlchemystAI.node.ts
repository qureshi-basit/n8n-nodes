import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class AlchemystAI implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Alchemyst AI',
		name: 'alchemystAI',
		icon: 'file:alchemyst.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Persistent memory for n8n workflows - store and search data from any LLM step',
		defaults: {
			name: 'Alchemyst AI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'alchemystAIApi',
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
						name: 'Store Data',
						value: 'store',
						description: 'Store data in persistent memory',
						action: 'Store data in memory',
					},
					{
						name: 'Search Data',
						value: 'search',
						description: 'Search stored data using semantic search',
						action: 'Search stored data',
					},
					{
						name: 'List Collections',
						value: 'listCollections',
						description: 'List all available data collections',
						action: 'List all collections',
					},
					{
						name: 'Delete Data',
						value: 'delete',
						description: 'Delete data from memory',
						action: 'Delete data from memory',
					},
				],
				default: 'store',
			},
			{
				displayName: 'Collection Name',
				name: 'collectionName',
				type: 'string',
				default: 'default',
				required: true,
				description: 'Name of the collection to store/search data in',
				displayOptions: {
					show: {
						operation: ['store', 'search', 'delete'],
					},
				},
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				default: '{}',
				required: true,
				description: 'Data to store (JSON format)',
				displayOptions: {
					show: {
						operation: ['store'],
					},
				},
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Additional metadata for the stored data',
				displayOptions: {
					show: {
						operation: ['store'],
					},
				},
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'Search query to find relevant data',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 10,
				description: 'Maximum number of results to return',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Minimum Score',
				name: 'minScore',
				type: 'number',
				default: 0.7,
				description: 'Minimum similarity score for search results (0-1)',
				displayOptions: {
					show: {
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Document ID',
				name: 'documentId',
				type: 'string',
				default: '',
				required: true,
				description: 'ID of the document to delete',
				displayOptions: {
					show: {
						operation: ['delete'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			let responseData: any = {};

			try {
				if (operation === 'store') {
					const collectionName = this.getNodeParameter('collectionName', i) as string;
					const data = this.getNodeParameter('data', i) as IDataObject;
					const metadata = this.getNodeParameter('metadata', i) as IDataObject;

					const body = {
						collection: collectionName,
						data: data,
						metadata: metadata || {},
					};

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: '/api/v1/store',
						body,
						json: true,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'alchemystAIApi',
						options,
					);

				} else if (operation === 'search') {
					const collectionName = this.getNodeParameter('collectionName', i) as string;
					const query = this.getNodeParameter('query', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const minScore = this.getNodeParameter('minScore', i) as number;

					const body = {
						collection: collectionName,
						query: query,
						limit: limit,
						min_score: minScore,
					};

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: '/api/v1/search',
						body,
						json: true,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'alchemystAIApi',
						options,
					);

				} else if (operation === 'listCollections') {
					const options: IHttpRequestOptions = {
						method: 'GET',
						url: '/api/v1/collections',
						json: true,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'alchemystAIApi',
						options,
					);

				} else if (operation === 'delete') {
					const collectionName = this.getNodeParameter('collectionName', i) as string;
					const documentId = this.getNodeParameter('documentId', i) as string;

					const options: IHttpRequestOptions = {
						method: 'DELETE',
						url: `/api/v1/collections/${collectionName}/documents/${documentId}`,
						json: true,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'alchemystAIApi',
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
