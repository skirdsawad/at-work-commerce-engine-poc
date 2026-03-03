export enum ProductField {
  Code = "code",
  Name = "name",
  Description = "description",
}

export interface Product {
  [ProductField.Code]: string;
  [ProductField.Name]: string;
  [ProductField.Description]: string;
}

export enum ProductApiMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum DialogMode {
  Create = "create",
  Edit = "edit",
}
