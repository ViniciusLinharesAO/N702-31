export type RequestParams = {
  id: string;
};
export type CreateReviewReqBody = {
  grade: string;
  description: string;
  userId: string;
  serviceId: string;
};

export type RequestResponse = {
  success: boolean;
  message: string;
  items: Array<any>;
};

export type PaginateQuery = {
  pageNumber: number;
  pageSize: number;
};

export type PaginatedResponse = RequestResponse & {
  pageSize: number;
  pageNumber: number;
  totalItems: number;
};
