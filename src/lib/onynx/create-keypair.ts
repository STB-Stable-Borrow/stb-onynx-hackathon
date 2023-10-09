import { generateES256KKeyPair, generateEdDSAKeyPair } from "./keygen";
import { readFromUserInput } from "./reader";

export const generateKeyPair = (keyType: string) => {
  switch (keyType) {
    case "1":
      return generateEdDSAKeyPair();
    case "2":
      return generateES256KKeyPair();
    default:
      throw new Error("Invalid key type");
  }
};

