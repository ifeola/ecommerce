import type { Request } from "express";
import type { PublicUser } from "../database/schema.ts";
export interface QueryParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  success: boolean;
  meta: {
    totalRecords: number;
    currentPage: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  data: T[];
}

const pagination = (req: Request): QueryParams => {
  const limit = parseInt(req.params?.limit as string) || 5;
  const page = Math.max(1, parseInt(req.params?.page as string) || 1);
  const offset = (page - 1) * limit;

  return {
    limit,
    page,
    offset,
  };
};

const postResponse = (
  data: Array<PublicUser> | PublicUser | undefined,
  message: string,
) => {
  return {
    success: true,
    message,
    data,
  };
};

const getResponse = <T>(
  limit: number,
  page: number,
  totalRecords: number,
  data: T[],
): PaginatedResult<T> => {
  const totalPages = limit === 0 ? 1 : Math.ceil(totalRecords / limit);

  return {
    success: true,
    meta: {
      totalRecords,
      totalPages,
      limit,
      currentPage: page,
      hasNextPage: limit !== 0 && page < totalPages,
      hasPrevPage: limit !== 0 && page > 1,
    },
    data,
  };
};

export { postResponse, pagination, getResponse };
