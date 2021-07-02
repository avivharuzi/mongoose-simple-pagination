import { FilterQuery, Model, Schema } from 'mongoose';

import { createPaginationMeta, getFixedPage } from './utils';
import { defaultOptions } from './defaults';
import { Options, OptionsOptional, Pagination } from './types';

async function paginate<T>(
  this: Model<T>,
  filter: FilterQuery<T> = {},
  options: OptionsOptional = defaultOptions
): Promise<Pagination<T>> {
  const mergedOptions: Options = {
    ...defaultOptions,
    ...options,
  };

  mergedOptions.page = getFixedPage(mergedOptions.page);
  mergedOptions.perPage = getFixedPage(mergedOptions.perPage);

  const {
    collation,
    lean,
    page,
    perPage,
    populate,
    projection,
    queryOptions,
    select,
    sort,
  } = mergedOptions;

  const documentsQuery = this.find(filter, projection, queryOptions)
    .select(select)
    .sort(sort)
    .lean(lean);

  if (collation !== undefined) {
    documentsQuery.collation(collation);
  }

  if (populate !== undefined) {
    documentsQuery.populate(populate);
  }

  const skip = (page - 1) * perPage;
  documentsQuery.skip(skip).limit(perPage);

  const [totalDocuments, documents] = await Promise.all([
    this.countDocuments(filter),
    documentsQuery,
  ]);

  return {
    documents: documents as unknown as T[],
    ...createPaginationMeta(totalDocuments, mergedOptions),
  };
}

export const mongooseSimplePagination = <T>(schema: Schema<T>): void => {
  schema.statics.paginate = paginate;
};
