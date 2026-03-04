import { OpeningHoursMap } from "./opening-hours";
import { PricingMap } from "./pricing";

export enum StoreField {
  Code = "code",
  Name = "name",
  Zone = "zone",
  Phone = "phone",
  Email = "email",
  Description = "description",
  CompanyName = "companyName",
  TaxId = "taxId",
  BranchNumber = "branchNumber",
  Address = "address",
  SubDistrict = "subDistrict",
  District = "district",
  Province = "province",
  PostalCode = "postalCode",
  Latitude = "latitude",
  Longitude = "longitude",
  O2OStoreId = "o2oStoreId",
  SellerEmail = "sellerEmail",
  SellerPassword = "sellerPassword",
  SaleOpsEmail = "saleOpsEmail",
  SaleOpsPassword = "saleOpsPassword",
  OpeningHours = "openingHours",
  Pricing = "pricing",
}

export interface Store {
  [StoreField.Code]: string;
  [StoreField.Name]: string;
  [StoreField.Zone]: string;
  [StoreField.Phone]: string;
  [StoreField.Email]: string;
  [StoreField.Description]: string;
  [StoreField.CompanyName]: string;
  [StoreField.TaxId]: string;
  [StoreField.BranchNumber]: string;
  [StoreField.Address]: string;
  [StoreField.SubDistrict]: string;
  [StoreField.District]: string;
  [StoreField.Province]: string;
  [StoreField.PostalCode]: string;
  [StoreField.Latitude]: string;
  [StoreField.Longitude]: string;
  [StoreField.O2OStoreId]: string;
  [StoreField.SellerEmail]: string;
  [StoreField.SellerPassword]: string;
  [StoreField.SaleOpsEmail]: string;
  [StoreField.SaleOpsPassword]: string;
  [StoreField.OpeningHours]?: OpeningHoursMap;
  [StoreField.Pricing]?: PricingMap;
}
