import { Document, FilterQuery, Model } from 'mongoose';

import { OptionsOptional } from './options-optional';
import { Pagination } from './pagination';

export interface PaginationModel<T extends Document> extends Model<T> {
  paginate(
    filter?: FilterQuery<T>,
    options?: OptionsOptional
  ): Promise<Pagination<T>>;
}
