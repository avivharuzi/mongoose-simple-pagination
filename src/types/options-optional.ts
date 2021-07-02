import { CollationDocument } from 'mongodb';
import { PopulateOptions, QueryOptions } from 'mongoose';

export interface OptionsOptional {
  collation?: CollationDocument;
  lean?: boolean | any;
  page?: number;
  perPage?: number;
  populate?: string | PopulateOptions | PopulateOptions[];
  projection?: any | null;
  queryOptions?: QueryOptions | null;
  select?: string | any;
  sort?: string | any;
}
