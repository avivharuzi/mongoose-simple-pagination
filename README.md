# mongoose-simple-pagination

![npm](https://img.shields.io/npm/v/mongoose-simple-pagination)
![GitHub package.json version](https://img.shields.io/github/package-json/v/avivharuzi/mongoose-simple-pagination)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/avivharuzi/mongoose-simple-pagination/Run%20tests)
![GitHub](https://img.shields.io/github/license/avivharuzi/mongoose-simple-pagination)

Mongoose simple pagination plugin written specially for typescript and async purposes.

## Why?

I created this package because I met typing problems in alternative libraries such as mongoose-paginate-v2. This package is for people who
looking for typescript solution with typings.

## Installation

```sh
npm i mongoose-simple-pagination
```

## Usage

Add plugin to a schema and then use model `paginate` method:

```ts
import { Document, model, Schema } from 'mongoose';

import { mongooseSimplePagination, PaginationModel } from 'mongoose-simple-pagination';

interface Product extends Document {
  // ...
}

const productSchema = new Schema<Product>(
  {
    // ...
  }
);

productSchema.plugin(mongoosePaginate);

export const ProductModel = model<Product, PaginationModel<Product>>(
  'Product',
  productSchema,
  'products'
);

(async () => {
  const pagination = await ProductModel.paginate();
  const products = pagination.documents; // Our products array.
  const hasNextPage = pagination.hasNextPage; // true.
})();
```

## API

### Model.paginate([filter], [options])

Returns promise

**Parameters**

- `[filter]` {FilterQuery} - Filter query criteria. [Documentation](https://docs.mongodb.org/manual/tutorial/query-documents)
- `[options]` {Options}
  - `[collation]` {CollationDocument} - Specify the collation. [Documentation](https://docs.mongodb.com/manual/reference/collation/)
  - `[lean=false]` {boolean | any} - Should return plain javascript objects instead of Mongoose document object.
  - `[page=1]` {number}
  - `[perPage=20]` {number}
  - `[populate]` {string | PopulateOptions | PopulateOptions[]} - Paths which should be populated with other
    documents. [Documentation](http://mongoosejs.com/docs/api.html#query_Query-populate)
  - `[projection=null]` {any | null} - Get/set the query
    projection. [Documentation](https://mongoosejs.com/docs/api/query.html#query_Query-projection)
  - `[queryOptions={}]` {QueryOptions | null} - Query options passed to Mongoose's `find()`
    function. [Documentation](https://mongoosejs.com/docs/api.html#query_Query-setOptions)
  - `[select='']` {string | any} - Fields to return (by default returns all fields)
    . [Documentation](http://mongoosejs.com/docs/api.html#query_Query-select)
  - `[sort='']` {string | any} - Sort order. [Documentation](http://mongoosejs.com/docs/api.html#query_Query-sort)

**Return value**

Promise fulfilled with Pagination object having properties:

- `documents` {T[]} - Array of documents.
- `hasNextPage` {bool} - Availability of next page.
- `hasPreviousPage` {bool} - Availability of previous page.
- `nextPage` {number} - Next page number if available or NULL.
- `page` {number} - Current page number.
- `perPage` {number} - Number of documents per page.
- `previousPage` {number} - Previous page number if available or NULL.
- `totalDocuments` {number} - Total number of documents in collection that match a query.
- `totalPages` {number} - Total number of pages.

## License

[MIT](LICENSE)
