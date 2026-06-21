export interface ApiResponse<T = unknown> {
  message: string;
  status: boolean;
  success: boolean;
  statusCode: number;
  data: T;
  error: unknown;
}
