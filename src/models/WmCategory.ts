import { ValueType } from "react-native-dropdown-picker";

export type WmCategory = {
  id: number;
  description: string;
  type: string;
  example: string;
  validateExpression: string;
} & ValueType;
