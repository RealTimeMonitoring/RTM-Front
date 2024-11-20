import { WmCategory } from "./WmCategory";

export default interface WmData {
    id: number;
    vendorId: string,
    productId: string;
    latitude: string;
    longitude: string;
    value: string;
    dtInsert: string;
    category: WmCategory | null;
}	