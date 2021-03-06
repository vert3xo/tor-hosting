export type Response<Type> = {
  data: Type | null;
  error: string | null;
};

export type User = {
  ID: number;
  CreatedAt: string | null;
  UpdatedAt: string | null;
  DeletedAt: string | null;
  Username: string;
  Password: string;
  Address: string;
  Disabled: boolean;
  Status: Status;
  Admin: boolean;
};

export enum Status {
  Online = 0,
  Offline = 1,
  Error = 2,
}
