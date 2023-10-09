import { IPaymaster, BiconomyPaymaster, SponsorUserOperationDto, PaymasterMode, IHybridPaymaster } from "@biconomy/paymaster";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { Wallet, providers, ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { DEFAULT_ECDSA_OWNERSHIP_MODULE, ECDSAOwnershipValidationModule } from "@biconomy/modules";



const bundler: IBundler = new Bundler({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  bundlerUrl: "https://bundler.biconomy.io/api/v2/{chain-id-here}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",
  chainId: ChainId.APOTHEM, // or any supported chain of your choice
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  // get from biconomy dashboard https://dashboard.biconomy.io/
  paymasterUrl: "https://paymaster.biconomy.io/api/v1/5/Al_uud9et.0420c6d3-2343-4fca-9022-c8c8b648444b",
});


const initSmartAccount = async(signer: ethers.Signer) => {
  const module = await ECDSAOwnershipValidationModule.create({
    signer: signer,
    moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
    });
  return await BiconomySmartAccountV2.create({
    chainId: ChainId.GOERLI,
    bundler: bundler, 
    paymaster: paymaster,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
    defaultValidationModule: module
  })
}


  const gaslessMint = async (biconomySmartAccount: BiconomySmartAccountV2, contract: any, tokenUrl: any) => {
    try {
      const minTx = await contract.populateTransaction.mint(tokenUrl);
      const tx1 = {
        to: contract.options.address,
        data: minTx.data,
      };
      let userOp = await biconomySmartAccount.buildUserOp([tx1]);
      console.log({ userOp })
      const biconomyPaymaster =
        biconomySmartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
        smartAccountInfo: {
          name: 'BICONOMY',
          version: '2.0.0'
        },
      };
      const paymasterAndDataResponse =
        await biconomyPaymaster.getPaymasterAndData(
          userOp,
          paymasterServiceData
        );
        
      userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      const userOpResponse = await biconomySmartAccount.sendUserOp(userOp);
      const { receipt } = await userOpResponse.wait(1);
      console.log("txHash", receipt.transactionHash);
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  }
  
  export {initSmartAccount, gaslessMint}

