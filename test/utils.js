const BigNumber = require("bignumber.js");
const { web3 } = require("hardhat");

const divByDecimal = (v, d = 18) => {
  return new BigNumber(v).div(new BigNumber(10).pow(d)).toString(10);
};

const callMethod = async (method, args = []) => {
  const result = await method(...args).call();
  return result;
};

const bnToString = (v, d = 18) => {
  return new BigNumber(v).toString(10);
};

const passTime = async (duration) => {
  const id = Date.now();
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [Number(duration)],
        id: id,
      },
      (err1) => {
        if (err1) return reject(err1);
        web3.currentProvider.send(
          {
            jsonrpc: "2.0",
            method: "evm_mine",
            id: id + 1,
          },
          (err2, res) => {
            return err2 ? reject(err2) : resolve(res);
          }
        );
      }
    );
  });
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

module.exports = {
  divByDecimal,
  bnToString,
  callMethod,
  passTime,
  getRandomInt,
};
