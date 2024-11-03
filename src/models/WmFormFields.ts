import { WmCategory } from "./WmCategory";

export default interface WmFormFilds{
    vendorId: number;
    productId: number;
    value:string;
    description:string;
    latitude:number;
    longitude:number;
    dt_insert?:Date | null;
}