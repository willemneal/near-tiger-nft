const fs = require("fs");
const { NEAR, Gas } = require("near-units");

const GAS = Gas.parse("200 Tgas");

const isMainnet = () => process.env.NODE_ENV == "mainnet";

//change this
const contractId = isMainnet() ? "misfits.tenk.near" : "v1.tenk.testnet";

const linkdrop_contract = isMainnet() ? "near" : "testnet";

// Fill out must add up to 100
const royalties = {
  accounts: {
    // "tenk.sputnik-dao.near": 2,
    // "misfits.sputnikdao.near": 20,
    // "appalabs.near": 39,
    // "siliconpty.near": 39,
  },
  percent: 15,
};

const CONTRACT_PATH = `target/wasm32-unknown-unknown/release/tenk.wasm`;

async function main({ account, near, nearAPI }) {
  const {
    Account,
    transactions: { deployContract, functionCall },
  } = nearAPI;
  const { connection } = near;

  const contractBytes = fs.readFileSync(`${__dirname}/../${CONTRACT_PATH}`);
  const contractAccount = new Account(connection, contractId);

  console.log("\n\n deploying contractBytes:", contractBytes.length, "\n\n");
  const actions = [deployContract(contractBytes)];
  const state = await contractAccount.state();
  console.log(state);
  
  // When ready
  if (false) {
    if (state.code_hash === "11111111111111111111111111111111") {
      actions.push(
        functionCall(
          "new_default_meta",
          {
            owner_id: "misfits.sputnikdao.near",
            name: "Misfits NFT",
            symbol: "MISFITS",
            uri: "fill_me_in",
            size: 2000, // fill in
            base_cost: NEAR.parse("9.69 N"),
            min_cost: NEAR.parse("9.69 N"),
            royalties,
          },
          GAS
        )
      );
      actions.push(
        functionCall("start_premint", {
          duration: 10000,
        })
      );
      console.log("about to initialize");
    }

    await account.signAndSendTransaction({
      receiverId: contractId,
      actions,
    });
  }
}

module.exports.main = main;
