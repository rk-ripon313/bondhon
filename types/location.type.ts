export interface LocationOption {
  _id: string;
  area: string;
  district: string;
  coordinates: {
    type: "Point";
    coordinates: number[];
  };
}
