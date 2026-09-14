export interface LocationOption {
  id: string;
  area: string;
  district: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface LocationData {
  district?: string;
  area?: string;
  address?: string;
  coordinates?: {
    type: "Point";
    coordinates: [number, number];
  };
}
