import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class ClickHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickHouse',
		name: 'clickHouse',
		icon: 'file:clickhouse.svg',
		group: ['output'],
		version: 1,
		description: 'Execute queries against ClickHouse database',
		defaults: {
			name: 'ClickHouse',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clickHouseApi',
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
						name: 'Execute Query',
						value: 'executeQuery',
						description: 'Execute a SQL query',
						action: 'Execute a SQL query',
					},
					{
						name: 'Insert',
						value: 'insert',
						description: 'Insert data into a table',
						action: 'Insert data into a table',
					},
					{
						name: 'Select',
						value: 'select',
						description: 'Select data from a table',
						action: 'Select data from a table',
					},
					{
						name: 'Create Table',
						value: 'createTable',
						description: 'Create a new table',
						action: 'Create a new table',
					},
					{
						name: 'Drop Table',
						value: 'dropTable',
						description: 'Drop a table',
						action: 'Drop a table',
					},
				],
				default: 'executeQuery',
			},
			{
				displayName: 'SQL Query',
				name: 'query',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
					rows: 5,
				},
				displayOptions: {
					show: {
						operation: ['executeQuery'],
					},
				},
				default: 'SELECT 1',
				description: 'The SQL query to execute',
			},
			{
				displayName: 'Table Name',
				name: 'table',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert', 'select', 'dropTable'],
					},
				},
				default: '',
				description: 'Name of the table',
			},
			{
				displayName: 'Columns',
				name: 'columns',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['select'],
					},
				},
				default: '*',
				description: 'Columns to select (comma separated)',
			},
			{
				displayName: 'Where Condition',
				name: 'where',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['select'],
					},
				},
				default: '',
				description: 'WHERE clause condition',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['select'],
					},
				},
				default: 100,
				description: 'Limit number of results',
			},
			{
				displayName: 'Data Input Mode',
				name: 'dataMode',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['insert'],
					},
				},
				options: [
					{
						name: 'Auto-Map Input Data',
						value: 'autoMapInputData',
						description: 'Use the input data from the previous node',
					},
					{
						name: 'Define Below for Each Column',
						value: 'defineBelow',
						description: 'Set the value for each column manually',
					},
				],
				default: 'autoMapInputData',
			},
			{
				displayName: 'Columns',
				name: 'columnsUi',
				placeholder: 'Add Column',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['insert'],
						dataMode: ['defineBelow'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Column',
						name: 'columnValues',
						values: [
							{
								displayName: 'Column',
								name: 'column',
								type: 'string',
								default: '',
								description: 'Name of the column to insert data to',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value to be inserted',
							},
						],
					},
				],
			},
			{
				displayName: 'Table Schema',
				name: 'schema',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
					rows: 5,
				},
				displayOptions: {
					show: {
						operation: ['createTable'],
					},
				},
				default: '',
				description: 'Table schema definition (e.g., "id UInt64, name String, date Date")',
			},
			{
				displayName: 'Engine',
				name: 'engine',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['createTable'],
					},
				},
				options: [
					{
						name: 'MergeTree',
						value: 'MergeTree',
					},
					{
						name: 'ReplacingMergeTree',
						value: 'ReplacingMergeTree',
					},
					{
						name: 'SummingMergeTree',
						value: 'SummingMergeTree',
					},
					{
						name: 'AggregatingMergeTree',
						value: 'AggregatingMergeTree',
					},
					{
						name: 'Memory',
						value: 'Memory',
					},
					{
						name: 'Log',
						value: 'Log',
					},
				],
				default: 'MergeTree',
				description: 'Table engine type',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createTable'],
						engine: ['MergeTree', 'ReplacingMergeTree', 'SummingMergeTree', 'AggregatingMergeTree'],
					},
				},
				default: '',
				description: 'ORDER BY expression for MergeTree engines',
			},
			{
				displayName: 'Additional Options',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Format',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'JSON',
								value: 'JSON',
							},
							{
								name: 'JSONEachRow',
								value: 'JSONEachRow',
							},
							{
								name: 'TabSeparated',
								value: 'TabSeparated',
							},
							{
								name: 'CSV',
								value: 'CSV',
							},
						],
						default: 'JSON',
						description: 'Output format for the query result',
					},
					{
						displayName: 'Query ID',
						name: 'queryId',
						type: 'string',
						default: '',
						description: 'Query ID for tracking',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		
		const credentials = await this.getCredentials('clickHouseApi');
		const host = credentials.host as string;
		const port = credentials.port as number;
		const useHttps = credentials.useHttps as boolean;
		const protocol = useHttps ? 'https' : 'http';
		const baseUrl = `${protocol}://${host}:${port}`;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
				const format = (additionalFields.format as string) || 'JSON';
				
				let query = '';
				let responseData: any = {};

				if (operation === 'executeQuery') {
					query = this.getNodeParameter('query', i) as string;
				} else if (operation === 'select') {
					const table = this.getNodeParameter('table', i) as string;
					const columns = this.getNodeParameter('columns', i) as string;
					const where = this.getNodeParameter('where', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					
					query = `SELECT ${columns} FROM ${table}`;
					if (where) {
						query += ` WHERE ${where}`;
					}
					if (limit > 0) {
						query += ` LIMIT ${limit}`;
					}
				} else if (operation === 'insert') {
					const table = this.getNodeParameter('table', i) as string;
					const dataMode = this.getNodeParameter('dataMode', i) as string;
					
					if (dataMode === 'autoMapInputData') {
						const inputData = items[i].json;
						const columns = Object.keys(inputData).join(', ');
						const values = Object.values(inputData)
							.map(value => typeof value === 'string' ? `'${value.replace(/'/g, "\\'")}'` : value)
							.join(', ');
						
						query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
					} else {
						const columnsUi = this.getNodeParameter('columnsUi', i) as IDataObject;
						const columnValues = (columnsUi.columnValues as IDataObject[]) || [];
						
						if (columnValues.length === 0) {
							throw new Error('At least one column must be specified');
						}
						
						const columns = columnValues.map(col => col.column).join(', ');
						const values = columnValues
							.map(col => typeof col.value === 'string' ? `'${(col.value as string).replace(/'/g, "\\'")}'` : col.value)
							.join(', ');
						
						query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
					}
				} else if (operation === 'createTable') {
					const table = this.getNodeParameter('table', i) as string;
					const schema = this.getNodeParameter('schema', i) as string;
					const engine = this.getNodeParameter('engine', i) as string;
					const orderBy = this.getNodeParameter('orderBy', i) as string;
					
					query = `CREATE TABLE ${table} (${schema}) ENGINE = ${engine}`;
					if (orderBy && ['MergeTree', 'ReplacingMergeTree', 'SummingMergeTree', 'AggregatingMergeTree'].includes(engine)) {
						query += ` ORDER BY (${orderBy})`;
					}
				} else if (operation === 'dropTable') {
					const table = this.getNodeParameter('table', i) as string;
					query = `DROP TABLE IF EXISTS ${table}`;
				}

				const options: IHttpRequestOptions = {
					method: 'POST',
					url: baseUrl,
					body: query,
					qs: {
						query: query,
					},
				};

				if (format !== 'JSON') {
					options.qs!.format = format;
				}

				if (additionalFields.queryId) {
					options.qs!.query_id = additionalFields.queryId as string;
				}

				responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'clickHouseApi', options);

				if (operation === 'select' || operation === 'executeQuery') {
					if (format === 'JSON' && typeof responseData === 'object') {
						if (responseData.data && Array.isArray(responseData.data)) {
							responseData.data.forEach((row: IDataObject) => {
								returnData.push(row);
							});
						} else {
							returnData.push(responseData);
						}
					} else if (format === 'JSONEachRow') {
						const lines = responseData.split('\n').filter((line: string) => line.trim());
						lines.forEach((line: string) => {
							try {
								const parsed = JSON.parse(line);
								returnData.push(parsed);
							} catch (e) {
								returnData.push({ raw: line });
							}
						});
					} else {
						returnData.push({ result: responseData });
					}
				} else {
					returnData.push({
						success: true,
						query,
						operation,
						result: responseData,
					});
				}

			} catch (error: unknown) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
