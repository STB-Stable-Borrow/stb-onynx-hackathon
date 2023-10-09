import { Magic } from "magic-sdk";
import { ethers } from "ethers";
const { MAGIC_API } = process.env;

const magic = new Magic(MAGIC_API, {
  network: "goerli",
});

const provider = await magic.wallet.getProvider();
const connectMagic = async () => {
  await magic.wallet.connectWithUI();
  const signer = provider.getSigner();
  return signer;
};

// const destination = "0xE0cef4417a772512E6C95cEf366403839b0D6D6D";
// const amount = ethers.utils.parseEther("1.0"); // Convert 1 ether to wei

// // Submit transaction to the blockchain
// const tx = await signer.sendTransaction({
//   to: destination,
//   value: amount,
// });s

// // Wait for transaction to be mined
// const receipt = await tx.wait();
export { connectMagic };
