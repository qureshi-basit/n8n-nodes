import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';

export class GoogleAds implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Ads',
		name: 'googleAds',
		icon: 'file:googleAds.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Google Ads API',
		defaults: {
			name: 'Google Ads',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleAdsApi',
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
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Ad Group',
						value: 'adGroup',
					},
					{
						name: 'Keyword',
						value: 'keyword',
					},
					{
						name: 'Ad',
						value: 'ad',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
				],
				default: 'campaign',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all campaigns',
						action: 'Get all campaigns',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a campaign',
						action: 'Get a campaign',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create a campaign',
						action: 'Create a campaign',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a campaign',
						action: 'Update a campaign',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a campaign',
						action: 'Delete a campaign',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['adGroup'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all ad groups',
						action: 'Get all ad groups',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an ad group',
						action: 'Get an ad group',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create an ad group',
						action: 'Create an ad group',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an ad group',
						action: 'Update an ad group',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['keyword'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all keywords',
						action: 'Get all keywords',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create keywords',
						action: 'Create keywords',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a keyword',
						action: 'Update a keyword',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['ad'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all ads',
						action: 'Get all ads',
					},
					{
						name: 'Create',
						value: 'create',
						description: 'Create an ad',
						action: 'Create an ad',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an ad',
						action: 'Update an ad',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['customer'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get customer information',
						action: 'Get customer information',
					},
					{
						name: 'List Accessible Customers',
						value: 'listAccessibleCustomers',
						description: 'List accessible customers',
						action: 'List accessible customers',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'update', 'delete'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the campaign',
			},
			{
				displayName: 'Ad Group ID',
				name: 'adGroupId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['adGroup'],
						operation: ['get', 'update'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the ad group',
			},
			{
				displayName: 'Campaign Name',
				name: 'campaignName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the campaign',
			},
			{
				displayName: 'Campaign Status',
				name: 'campaignStatus',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'update'],
					},
				},
				options: [
					{
						name: 'Enabled',
						value: 'ENABLED',
					},
					{
						name: 'Paused',
						value: 'PAUSED',
					},
					{
						name: 'Removed',
						value: 'REMOVED',
					},
				],
				default: 'ENABLED',
				description: 'Status of the campaign',
			},
			{
				displayName: 'Ad Group Name',
				name: 'adGroupName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['adGroup'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the ad group',
			},
			{
				displayName: 'Parent Campaign ID',
				name: 'parentCampaignId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['adGroup'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the parent campaign',
			},
			{
				displayName: 'Keywords',
				name: 'keywords',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['keyword'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'Comma-separated list of keywords to create',
			},
			{
				displayName: 'Keyword Ad Group ID',
				name: 'keywordAdGroupId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['keyword'],
						operation: ['create'],
					},
				},
				default: '',
				required: true,
				description: 'ID of the ad group for the keywords',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'GAQL query to filter results',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
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
				const options: IHttpRequestOptions = {
					method: 'GET',
					url: '',
					json: true,
				};

				const baseUrl = 'https://googleads.googleapis.com/v17';

				if (resource === 'campaign') {
					if (operation === 'getAll') {
						const query = this.getNodeParameter('query', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						let gaqlQuery = 'SELECT campaign.id, campaign.name, campaign.status FROM campaign';
						if (query) {
							gaqlQuery = query;
						}

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/googleAds:search`;
						options.body = {
							query: `${gaqlQuery} LIMIT ${limit}`,
						};
					} else if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						options.url = `${baseUrl}/customers/{customer_id}/campaigns/${campaignId}`;
					} else if (operation === 'create') {
						const campaignName = this.getNodeParameter('campaignName', i) as string;
						const campaignStatus = this.getNodeParameter('campaignStatus', i) as string;

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/campaigns:mutate`;
						options.body = {
							operations: [
								{
									create: {
										name: campaignName,
										status: campaignStatus,
										advertising_channel_type: 'SEARCH',
									},
								},
							],
						};
					} else if (operation === 'update') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const campaignStatus = this.getNodeParameter('campaignStatus', i) as string;

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/campaigns:mutate`;
						options.body = {
							operations: [
								{
									update: {
										resource_name: `customers/{customer_id}/campaigns/${campaignId}`,
										status: campaignStatus,
									},
									update_mask: {
										paths: ['status'],
									},
								},
							],
						};
					} else if (operation === 'delete') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/campaigns:mutate`;
						options.body = {
							operations: [
								{
									remove: `customers/{customer_id}/campaigns/${campaignId}`,
								},
							],
						};
					}
				} else if (resource === 'adGroup') {
					if (operation === 'getAll') {
						const query = this.getNodeParameter('query', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						let gaqlQuery = 'SELECT ad_group.id, ad_group.name, ad_group.status FROM ad_group';
						if (query) {
							gaqlQuery = query;
						}

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/googleAds:search`;
						options.body = {
							query: `${gaqlQuery} LIMIT ${limit}`,
						};
					} else if (operation === 'get') {
						const adGroupId = this.getNodeParameter('adGroupId', i) as string;
						options.url = `${baseUrl}/customers/{customer_id}/adGroups/${adGroupId}`;
					} else if (operation === 'create') {
						const adGroupName = this.getNodeParameter('adGroupName', i) as string;
						const parentCampaignId = this.getNodeParameter('parentCampaignId', i) as string;

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/adGroups:mutate`;
						options.body = {
							operations: [
								{
									create: {
										name: adGroupName,
										campaign: `customers/{customer_id}/campaigns/${parentCampaignId}`,
										status: 'ENABLED',
									},
								},
							],
						};
					} else if (operation === 'update') {
						const adGroupId = this.getNodeParameter('adGroupId', i) as string;

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/adGroups:mutate`;
						options.body = {
							operations: [
								{
									update: {
										resource_name: `customers/{customer_id}/adGroups/${adGroupId}`,
										status: 'PAUSED',
									},
									update_mask: {
										paths: ['status'],
									},
								},
							],
						};
					}
				} else if (resource === 'keyword') {
					if (operation === 'getAll') {
						const query = this.getNodeParameter('query', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						let gaqlQuery = 'SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type FROM ad_group_criterion WHERE ad_group_criterion.type = KEYWORD';
						if (query) {
							gaqlQuery = query;
						}

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/googleAds:search`;
						options.body = {
							query: `${gaqlQuery} LIMIT ${limit}`,
						};
					} else if (operation === 'create') {
						const keywords = this.getNodeParameter('keywords', i) as string;
						const adGroupId = this.getNodeParameter('keywordAdGroupId', i) as string;
						const keywordList = keywords.split(',').map(k => k.trim());

						const operations = keywordList.map(keyword => ({
							create: {
								ad_group: `customers/{customer_id}/adGroups/${adGroupId}`,
								keyword: {
									text: keyword,
									match_type: 'EXACT',
								},
							},
						}));

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/adGroupCriteria:mutate`;
						options.body = {
							operations,
						};
					}
				} else if (resource === 'ad') {
					if (operation === 'getAll') {
						const query = this.getNodeParameter('query', i, '') as string;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						let gaqlQuery = 'SELECT ad_group_ad.ad.id, ad_group_ad.ad.text_ad.headline1, ad_group_ad.status FROM ad_group_ad';
						if (query) {
							gaqlQuery = query;
						}

						options.method = 'POST';
						options.url = `${baseUrl}/customers/{customer_id}/googleAds:search`;
						options.body = {
							query: `${gaqlQuery} LIMIT ${limit}`,
						};
					}
				} else if (resource === 'customer') {
					if (operation === 'get') {
						options.url = `${baseUrl}/customers/{customer_id}`;
					} else if (operation === 'listAccessibleCustomers') {
						options.url = `${baseUrl}/customers:listAccessibleCustomers`;
					}
				}

				// Replace {customer_id} placeholder with actual customer ID
				if (options.url && options.url.includes('{customer_id}')) {
					options.url = options.url.replace('{customer_id}', '{customer_id}');
				}

				responseData = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'googleAdsApi',
					options,
				);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({
							error: error instanceof Error ? error.message : String(error),
						}),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
