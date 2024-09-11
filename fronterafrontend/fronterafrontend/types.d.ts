export type TCenter = {
  id: number;
  name: string;
  stateID: number | null;
  regionID: number | null;
  address: string;
  poc: string;
  contact: string;
  email: string;
  rooms: TRoom[];
};

export type TNotification = {
  activity: string;
  name: string;
  id: number;
  userID: number;
  createdAt: string;
};

export type TRegion = {
  id: number;
  stateID: number;
  name: string;
  createdAt: string;
};

export type STRoom = {
  name: string;
  specializationID: number | null;
  isDeleted?: boolean;
};

export type TRegion = {
  id: number;
  stateID: number;
  name: string;
  createdAt: string;
};

export type TState = {
  id: number;
  name: string;
  createdAt: string;
};

export type TSpecializations = {
  id: number;
  name: string;
  createdAt: string;
};
