import { WmCategory } from "./WmCategory";

export default interface WmData {
    id: number;
    vendorId: string,
    productId: string;
    latitude: string;
    longitude: string;
    value: string;
    description: string;
    dtInsert: string;
    category: WmCategory | null;
    status: 'OPEN' | 'CLOSED';
}	