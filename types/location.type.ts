export interface LocationOption {
  id: string;
  area: string;
  district: string;
  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };
}
