export type RequestParams = {
  id: string;
};
export type CreateServicesReqBody = {
  title: string;
  description: string;
  image: string;
  userId: string;
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
