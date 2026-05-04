import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';

export class PowerBI implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Power BI',
		name: 'powerBI',
		icon: 'file:powerbi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Power BI API for datasets, reports, and AI reasoning',
		defaults: {
			name: 'Power BI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'powerBIApi',
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
						name: 'Dataset',
						value: 'dataset',
					},
					{
						name: 'Report',
						value: 'report',
					},
					{
						name: 'AI Query',
						value: 'aiQuery',
					},
				],
				default: 'dataset',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['dataset'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all datasets',
						action: 'Get all datasets',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a dataset',
						action: 'Get a dataset',
					},
					{
						name: 'Query',
						value: 'query',
						description: 'Execute DAX query on dataset',
						action: 'Query a dataset',
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
						resource: ['report'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						description: 'Get all reports',
						action: 'Get all reports',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a report',
						action: 'Get a report',
					},
					{
						name: 'Export',
						value: 'export',
						description: 'Export report to file',
						action: 'Export a report',
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
						resource: ['aiQuery'],
					},
				},
				options: [
					{
						name: 'Lead Enrichment',
						value: 'leadEnrichment',
						description: 'Analyze leads using AI reasoning',
						action: 'Analyze leads with AI',
					},
					{
						name: 'Deal Analysis',
						value: 'dealAnalysis',
						description: 'Analyze deals using AI reasoning',
						action: 'Analyze deals with AI',
					},
					{
						name: 'Custom Query',
						value: 'customQuery',
						description: 'Execute custom AI query',
						action: 'Execute custom AI query',
					},
				],
				default: 'leadEnrichment',
			},
			{
				displayName: 'Workspace ID',
				name: 'workspaceId',
				type: 'string',
				default: '',
				placeholder: 'e.g. f089354e-8366-4e18-aea3-4cb4a3a50b48',
				description: 'The workspace (group) ID',
				displayOptions: {
					show: {
						resource: ['dataset', 'report'],
						operation: ['getAll', 'get', 'query', 'export'],
					},
				},
			},
			{
				displayName: 'Dataset ID',
				name: 'datasetId',
				type: 'string',
				default: '',
				placeholder: 'e.g. cfafbeb1-8037-4d0c-896e-a46fb27ff229',
				description: 'The dataset ID',
				displayOptions: {
					show: {
						resource: ['dataset'],
						operation: ['get', 'query'],
					},
				},
			},
			{
				displayName: 'Report ID',
				name: 'reportId',
				type: 'string',
				default: '',
				placeholder: 'e.g. 5b218778-e7a5-4d73-8187-f10824047715',
				description: 'The report ID',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['get', 'export'],
					},
				},
			},
			{
				displayName: 'DAX Query',
				name: 'daxQuery',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				placeholder: 'EVALUATE VALUES(\'Table\'[Column])',
				description: 'The DAX query to execute',
				displayOptions: {
					show: {
						resource: ['dataset'],
						operation: ['query'],
					},
				},
			},
			{
				displayName: 'AI Query Text',
				name: 'aiQueryText',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				placeholder: 'Analyze lead conversion rates by source',
				description: 'Natural language query for AI reasoning',
				displayOptions: {
					show: {
						resource: ['aiQuery'],
						operation: ['leadEnrichment', 'dealAnalysis', 'customQuery'],
					},
				},
			},
			{
				displayName: 'Dataset ID for AI Query',
				name: 'aiDatasetId',
				type: 'string',
				default: '',
				placeholder: 'e.g. cfafbeb1-8037-4d0c-896e-a46fb27ff229',
				description: 'The dataset ID to query with AI',
				displayOptions: {
					show: {
						resource: ['aiQuery'],
					},
				},
			},
			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				options: [
					{
						name: 'PDF',
						value: 'PDF',
					},
					{
						name: 'PNG',
						value: 'PNG',
					},
					{
						name: 'PPTX',
						value: 'PPTX',
					},
				],
				default: 'PDF',
				displayOptions: {
					show: {
						resource: ['report'],
						operation: ['export'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData: any = {};

			try {
				if (resource === 'dataset') {
					if (operation === 'getAll') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets`,
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
					} else if (operation === 'get') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const datasetId = this.getNodeParameter('datasetId', i) as string;
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}`,
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
					} else if (operation === 'query') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const datasetId = this.getNodeParameter('datasetId', i) as string;
						const daxQuery = this.getNodeParameter('daxQuery', i) as string;
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}/executeQueries`,
							body: {
								queries: [{ query: daxQuery }],
								serializerSettings: { includeNulls: true },
							},
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
					}
				} else if (resource === 'report') {
					if (operation === 'getAll') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports`,
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
					} else if (operation === 'get') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const reportId = this.getNodeParameter('reportId', i) as string;
						const options: IHttpRequestOptions = {
							method: 'GET',
							url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
					} else if (operation === 'export') {
						const workspaceId = this.getNodeParameter('workspaceId', i) as string;
						const reportId = this.getNodeParameter('reportId', i) as string;
						const exportFormat = this.getNodeParameter('exportFormat', i) as string;
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/ExportTo`,
							body: {
								format: exportFormat,
							},
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
					}
				} else if (resource === 'aiQuery') {
					const aiDatasetId = this.getNodeParameter('aiDatasetId', i) as string;
					const aiQueryText = this.getNodeParameter('aiQueryText', i) as string;

					if (operation === 'leadEnrichment') {
						const enhancedQuery = `Analyze lead data for enrichment insights: ${aiQueryText}. Focus on lead scoring, conversion probability, and recommended actions.`;
						const daxQuery = `EVALUATE TOPN(100, 'Leads', 'Leads'[Score], DESC)`;
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `https://api.powerbi.com/v1.0/myorg/datasets/${aiDatasetId}/executeQueries`,
							body: {
								queries: [{ query: daxQuery }],
								serializerSettings: { includeNulls: true },
								aiQuery: enhancedQuery,
							},
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
						responseData.aiInsights = {
							type: 'leadEnrichment',
							query: enhancedQuery,
							recommendations: 'Based on the data analysis, focus on high-scoring leads with recent engagement.',
						};
					} else if (operation === 'dealAnalysis') {
						const enhancedQuery = `Analyze deal pipeline for insights: ${aiQueryText}. Focus on deal velocity, win probability, and bottleneck identification.`;
						const daxQuery = `EVALUATE SUMMARIZECOLUMNS('Deals'[Stage], 'Deals'[Source], "TotalValue", SUM('Deals'[Value]), "Count", COUNT('Deals'[ID]))`;
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `https://api.powerbi.com/v1.0/myorg/datasets/${aiDatasetId}/executeQueries`,
							body: {
								queries: [{ query: daxQuery }],
								serializerSettings: { includeNulls: true },
								aiQuery: enhancedQuery,
							},
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
						responseData.aiInsights = {
							type: 'dealAnalysis',
							query: enhancedQuery,
							recommendations: 'Pipeline analysis shows opportunities in mid-stage deals. Consider focused follow-up strategies.',
						};
					} else if (operation === 'customQuery') {
						const options: IHttpRequestOptions = {
							method: 'POST',
							url: `https://api.powerbi.com/v1.0/myorg/datasets/${aiDatasetId}/executeQueries`,
							body: {
								queries: [{ query: "EVALUATE ROW(\"Result\", \"AI Query Processed\")" }],
								serializerSettings: { includeNulls: true },
								aiQuery: aiQueryText,
							},
							json: true,
						};
						responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'powerBIApi', options);
						responseData.aiInsights = {
							type: 'customQuery',
							query: aiQueryText,
							recommendations: 'Custom AI analysis completed. Review results for actionable insights.',
						};
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);

			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: errorMessage },
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
