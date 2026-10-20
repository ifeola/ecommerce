import type { Request, Response } from "express";
export interface QueryParams {
  page: number;
  limit: number;
  offset: number;
}

type Meta = {
  totalRecords: number;
  currentPage: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type Single<T> = { success: true; message?: string; data: T };
type Paginated<T> = Single<T[]> & { meta: Meta };

const pagination = (req: Request): QueryParams => {
  const limit = Math.min(parseInt(req.query?.limit as string) ?? 5, 100);
  const page = Math.max(1, parseInt(req.query?.page as string) || 1);
  const offset = (page - 1) * limit;

  return {
    limit,
    page,
    offset,
  };
};

const getResponse = <T>(
  items: T[],
  meta?: Meta,
): Single<T[]> | Paginated<T> => {
  return {
    success: true,
    ...(meta && { meta }),
    data: items,
  };
};

const postResponse = <T>(data: T, message?: string): Single<T> => ({
  success: true,
  ...(message && { message }),
  data,
});

const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>,
) =>
  res
    .status(statusCode)
    .json({ success: false, message, ...(errors && { errors }) });

export { postResponse, pagination, getResponse, errorResponse };
