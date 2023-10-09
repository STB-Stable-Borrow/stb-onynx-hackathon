import { KeyDIDMethod, createAndSignCredentialJWT } from "@jpmorganchase/onyx-ssi-sdk";
import { camelCase } from "lodash";
import path from "path";
import {
  ISSUER_EDDSA_PRIVATE_KEY,
  VC_DIR_PATH,
} from "../onynx/config";
import { privateKeyBufferFromString } from "./convertions";
import { writeToFile } from "./writer";

export const createVc = async (profileId: string, username: string, bio: string, holderKey: any) => {
  const didKey = new KeyDIDMethod();
  const issuerDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(ISSUER_EDDSA_PRIVATE_KEY)
  );
  const holderDidWithKeys = await didKey.generateFromPrivateKey(
    privateKeyBufferFromString(holderKey)
  );
  const vcDidKey = (await didKey.create()).did;
  const credentialType = "PROOF_OF_PROFILE";
  const subjectData = {
    profileId:  profileId,
    username: username,
    bio: bio
  };
  const additionalParams = {
    id: vcDidKey,
  };
  console.log(
    `\nGenerating a signed verifiable Credential of type ${credentialType}\n`
  );
  const signedVc = await createAndSignCredentialJWT(
    issuerDidWithKeys,
    holderDidWithKeys.did,
    subjectData,
    [credentialType],
    additionalParams
  );

  console.log(signedVc);
  return signedVc;
};

