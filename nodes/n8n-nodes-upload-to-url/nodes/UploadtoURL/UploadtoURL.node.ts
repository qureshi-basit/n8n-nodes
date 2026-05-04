import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class UploadtoURL implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Upload to URL',
		name: 'uploadtoURL',
		icon: 'file:uploadtourl.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Upload binary files to CDN and get public URLs',
		defaults: {
			name: 'Upload to URL',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'uploadtoURLApi',
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
						name: 'Upload File',
						value: 'upload',
						description: 'Upload a binary file and get a public URL',
						action: 'Upload a file',
					},
					{
						name: 'Delete File',
						value: 'delete',
						description: 'Delete a previously uploaded file',
						action: 'Delete a file',
					},
					{
						name: 'Get File Info',
						value: 'info',
						description: 'Get information about an uploaded file',
						action: 'Get file information',
					},
				],
				default: 'upload',
			},
			{
				displayName: 'Binary Property',
				name: 'binaryPropertyName',
				type: 'string',
				default: 'data',
				required: true,
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				description: 'Name of the binary property containing the file to upload',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['delete', 'info'],
					},
				},
				description: 'ID of the file to delete or get info for',
			},
			{
				displayName: 'Expiration Time',
				name: 'expirationTime',
				type: 'options',
				options: [
					{
						name: '1 Hour',
						value: '1h',
					},
					{
						name: '24 Hours',
						value: '24h',
					},
					{
						name: '7 Days',
						value: '7d',
					},
					{
						name: '30 Days',
						value: '30d',
					},
					{
						name: 'Never',
						value: 'never',
					},
				],
				default: '24h',
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				description: 'How long the file should remain accessible',
			},
			{
				displayName: 'Custom Filename',
				name: 'customFilename',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				description: 'Optional custom filename for the uploaded file',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['upload'],
					},
				},
				description: 'Comma-separated tags for organizing files',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any = {};

				if (operation === 'upload') {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const expirationTime = this.getNodeParameter('expirationTime', i) as string;
					const customFilename = this.getNodeParameter('customFilename', i) as string;
					const tags = this.getNodeParameter('tags', i) as string;

					const binaryData = items[i].binary![binaryPropertyName];
					if (!binaryData) {
						throw new Error(`No binary data found in property "${binaryPropertyName}"`);
					}

					const formData = new FormData();
					const buffer = Buffer.from(binaryData.data, 'base64');
					const filename = customFilename || binaryData.fileName || 'file';
					
					formData.append('file', new Blob([buffer]), filename);
					formData.append('expiration', expirationTime);
					
					if (tags) {
						formData.append('tags', tags);
					}

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: '/upload',
						body: formData,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'uploadtoURLApi',
						options,
					);

				} else if (operation === 'delete') {
					const fileId = this.getNodeParameter('fileId', i) as string;

					const options: IHttpRequestOptions = {
						method: 'DELETE',
						url: `/files/${fileId}`,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'uploadtoURLApi',
						options,
					);

				} else if (operation === 'info') {
					const fileId = this.getNodeParameter('fileId', i) as string;

					const options: IHttpRequestOptions = {
						method: 'GET',
						url: `/files/${fileId}`,
					};

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'uploadtoURLApi',
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

		return [returnData];
	}
}
