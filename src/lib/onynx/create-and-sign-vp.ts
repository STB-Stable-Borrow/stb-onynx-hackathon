import {
  EthrDIDMethod,
  KeyDIDMethod,
  createAndSignPresentationJWT,
  getSubjectFromVP,
} from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase, includes } from "lodash";
import path from "path";
import {
  HOLDER_EDDSA_PRIVATE_KEY,
  HOLDER_ES256K_PRIVATE_KEY,
  VC,
  VC_DIR_PATH,
  VP_DIR_PATH,
  ethrProvider,
} from "./config";
import { privateKeyBufferFromString } from "./convertions";
import { writeToFile } from "./writer";

export const createAndSignVp = async (signedVcJwt: any, holderKey1: any, holderKey2: any) => {
  if (VC) {
    try {
      console.log("\nReading an existing signed VC JWT\n");
      console.log(signedVcJwt);

      console.log("\nGeting User from VC\n");
      const holderDid = getSubjectFromVP(signedVcJwt);
      console.log(holderDid);

      if (includes(holderDid, "ethr")) {
        console.log("VC did method: did:ethr");

        const didEthr = new EthrDIDMethod(ethrProvider);
        const didWithKeys = await didEthr.generateFromPrivateKey(
          holderKey2
        );

        if (didWithKeys.did === holderDid) {
          console.log("\nCreating and signing the VP from VC\n");
          const signedVp = await createAndSignPresentationJWT(didWithKeys, [
            signedVcJwt,
          ]);
          console.log(signedVp);

          writeToFile(
            path.resolve(VP_DIR_PATH, `${VC}.jwt`),
            JSON.stringify(signedVp)
          );
        } else {
          console.log(
            "HOLDER_ES256K_PRIVATE_KEY cannot sign for this verifiable credentail\n"
          );
        }
      } else if (includes(holderDid, "key")) {
        console.log("\nVC did method: did:key\n");

        const didKey = new KeyDIDMethod();
        const didWithKeys = await didKey.generateFromPrivateKey(
          privateKeyBufferFromString(holderKey1)
        );

        if (didWithKeys.did === holderDid) {
          console.log("\nCreating and signing the VP from VC\n");
          const signedVp = await createAndSignPresentationJWT(didWithKeys, [
            signedVcJwt,
          ]);
          console.log(signedVp);
          writeToFile(
            path.resolve(VP_DIR_PATH, `${camelCase(VC)}.jwt`),
            JSON.stringify(signedVp)
          );
          return signedVp
        } else {
          console.log(
            "\nHOLDER_EDDSA_PRIVATE_KEY cannot sign for this verifiable credentail\n"
          );
        }
      }
    } catch (err) {
      console.log("err: ", err)
      console.log("\nFailed to fetch file\n");
      console.log(
        "\nTo run this script you must have a valid VC and a valid signed VC JWT\n"
      );
      console.log(
        "\nPlease refer to issuer scripts to generate and sign a VC\n"
      );
    }
  } else {
    console.log("\nVC not found!\n");
    console.log(
      "\nTo run this script you must have a valid VC and a valid signed VC JWT\n"
    );
    console.log("\nPlease refer to issuer scripts to generate and sign a VC\n");
  }
};
