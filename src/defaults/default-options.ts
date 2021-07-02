import { Options } from '../types';

export const defaultOptions: Options = {
  collation: undefined,
  lean: false,
  page: 1,
  perPage: 20,
  populate: undefined,
  projection: null,
  select: '',
  sort: '',
  queryOptions: {},
};
