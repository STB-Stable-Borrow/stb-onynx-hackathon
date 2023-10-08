const STC = artifacts.require("STC");
const STB = artifacts.require("STB");
const SBT = artifacts.require("SBT");
const STBSWAP = artifacts.require("STBSWAP");

const STCNAME = "STABLECOIN";
const STCSYMBOL = "STC";
const INITIALCOLRATIO = 60000000000000000000n;
const REGPERCENTAGE = 50000000000000000n;
const INTEREST = 500000000000000000n;
const INTERESTDURATION = 31556926;
const MAXVAULT = 10;
const SBTNAME = "STB SOULBOUND TOKEN";
const SBTSYMBOL = "SSBT";
const GATEWAYCONTRACT = "0xf65b6396df6b7e2d8a6270e3ab6c7bb08baef22e";
const GATEKEPPERNETWORK = 4;
const STCSYMBOL1 = "STC";
const XDCSYMBOL = "XDC";
const MAXFEE = 500000000000000000n;
const STBSWAPPERC = 30000000000000000000n;

module.exports = async function (deployer) {
  await deployer.deploy(STC, STCNAME, STCSYMBOL).then(async (res1) => {
    await deployer
      .deploy(
        STB,
        res1.address,
        INITIALCOLRATIO,
        REGPERCENTAGE,
        INTEREST,
        INTERESTDURATION,
        MAXVAULT
      )
      .then(async (res2) => {
        await deployer
          .deploy(
            STBSWAP,
            res1.address,
            res2.address,
            STCSYMBOL,
            XDCSYMBOL,
            MAXFEE,
            STBSWAPPERC
          )
          .then(async () => {
            await deployer.deploy(
              SBT,
              SBTNAME,
              SBTSYMBOL,
              GATEWAYCONTRACT,
              GATEKEPPERNETWORK
            );
          });
      });
  });
};
