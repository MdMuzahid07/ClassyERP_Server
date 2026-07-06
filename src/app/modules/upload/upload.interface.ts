export interface IUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  original_filename?: string;
}

export interface IUploadOptions {
  folder: string;
  resourceType?: 'image' | 'video' | 'raw';
  transformation?: object[];
}
