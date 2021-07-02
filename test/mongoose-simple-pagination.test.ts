import {
  connect,
  connection,
  disconnect,
  Document,
  model,
  PopulatedDoc,
  Schema,
} from 'mongoose';

import { mongooseSimplePagination, PaginationModel } from '../src';
// eslint-disable-next-line
const contactsMock = require('./../mock/contacts.json');

const MONGODB_URI = 'mongodb://127.0.0.1/mongoose-simple-pagination-test';

interface Address {
  country: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
  {
    country: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const AddressModel = model<Address>(
  'Address',
  addressSchema,
  'addresses'
);

interface Contact extends Document {
  place: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  language: string;
  phone: string;
  address: PopulatedDoc<Address & Document>;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<Contact>(
  {
    place: { type: Number, required: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    language: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: Schema.Types.ObjectId, required: true, ref: 'Address' },
  },
  { timestamps: true }
);

contactSchema.plugin(mongooseSimplePagination);

export const ContactModel = model<Contact, PaginationModel<Contact>>(
  'Contact',
  contactSchema,
  'contacts'
);

describe('mongooseSimplePagination', () => {
  beforeAll(async () => {
    await connect(MONGODB_URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await connection.db.dropDatabase();
    const defaultAddress = await AddressModel.create({
      country: 'United States',
      city: 'New York',
    });
    const contacts = (contactsMock as Contact[]).map((contactMock, i) => {
      return {
        ...contactMock,
        address: defaultAddress.id,
        place: i + 1,
      };
    });
    await ContactModel.create(contacts);
  }, 30000);

  it('should be returns promise', () => {
    const promise = ContactModel.paginate();
    expect(promise.then).toBeInstanceOf(Function);
  });

  describe('paginate', () => {
    it('should be paginate without params', async () => {
      const pagination = await ContactModel.paginate();
      expect(pagination.documents).toBeInstanceOf(Array);
      expect(pagination.documents).toHaveLength(20);
      expect(pagination.page).toEqual(1);
      expect(pagination.perPage).toEqual(20);
      expect(pagination.hasNextPage).toEqual(true);
      expect(pagination.nextPage).toEqual(2);
      expect(pagination.hasPreviousPage).toEqual(false);
      expect(pagination.previousPage).toEqual(null);
      expect(pagination.totalPages).toEqual(50);
      expect(pagination.totalDocuments).toEqual(1000);
    });

    it('should be paginate with page 5 and 12 items', async () => {
      const pagination = await ContactModel.paginate(
        {},
        {
          page: 5,
          perPage: 12,
        }
      );
      expect(pagination.documents).toBeInstanceOf(Array);
      expect(pagination.documents).toHaveLength(12);
      expect(pagination.page).toEqual(5);
      expect(pagination.perPage).toEqual(12);
      expect(pagination.hasNextPage).toEqual(true);
      expect(pagination.nextPage).toEqual(6);
      expect(pagination.hasPreviousPage).toEqual(true);
      expect(pagination.previousPage).toEqual(4);
      expect(pagination.totalPages).toEqual(84);
      expect(pagination.totalDocuments).toEqual(1000);
    });

    it('should be next page null in case of last page', async () => {
      const pagination = await ContactModel.paginate(
        {},
        {
          page: 50,
        }
      );
      expect(pagination.hasNextPage).toEqual(false);
      expect(pagination.nextPage).toEqual(null);
    });

    it('should be working with select', async () => {
      const { documents: contacts } = await ContactModel.paginate(
        {},
        {
          select: 'firstName lastName',
        }
      );
      const contact = contacts[0];
      expect(contact.place).toBeUndefined();
      expect(contact.firstName).toBeDefined();
      expect(contact.lastName).toBeDefined();
      expect(contact.email).toBeUndefined();
      expect(contact.gender).toBeUndefined();
      expect(contact.language).toBeUndefined();
      expect(contact.phone).toBeUndefined();
    });

    it('should be working with sort', async () => {
      const { documents: contacts } = await ContactModel.paginate(
        {},
        {
          sort: '-place',
        }
      );
      expect(contacts[0].place).toEqual(1000);
      expect(contacts[1].place).toEqual(999);
    });

    it('should be working with populate', async () => {
      const { documents: contacts } = await ContactModel.paginate(
        {},
        { populate: { path: 'address' } }
      );
      const contact = contacts[0];
      expect(contact.address.country).toBeDefined();
      expect(contact.address.city).toBeDefined();
    });

    it('should be working with lean true', async () => {
      const { documents: contacts } = await ContactModel.paginate(
        {},
        { lean: true }
      );
      const contact = contacts[0];
      expect(contact instanceof Document).toEqual(false);
    });
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
    await disconnect();
  });
});
