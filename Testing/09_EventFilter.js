// 過濾器 Filter
// 當合約創建日誌（釋放事件）時，最多可以包含 4 條數據作為索引（indexed）
// 布隆過濾器：一種允許有效過濾的數據結構

// 布隆過濾器 -篩選目標事件
// 1. 如果一個主題集為null，則該位置的日誌主題不會被過濾，任何值都匹配
// 2. 如果主題集是單個值，則該位置的日誌主題必須與該值匹配
// 3. 如果主題集是數組，則該位置的日誌主題至少與數組中其中一個匹配

import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/M3UBACOyR8sntCSOzh5e8s9d5R8Ds-Bd';
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 構建過濾器
// const filter = contract.filters.EVENT_NAME(...args)
// 过滤来自myAddress地址的Transfer事件 - contract.filters.Transfer(myAddress)
// 过滤所有发给 myAddress地址的Transfer事件 - contract.filters.Transfer(null, myAddress)
// 过滤所有从 myAddress发给otherAddress的Transfer事件 - contract.filters.Transfer(myAddress, otherAddress)
// 过滤所有发给myAddress或otherAddress的Transfer事件 - contract.filters.Transfer(null, [ myAddress, otherAddress ])

// 監聽交易所的 USDT 轉賬
// 1. 从币安交易所转出USDT的交易
// 先看懂交易日志Logs - topics & data
// address, topics[0], topics[1], topics[2], data

// 2. 創建 provider, abi, 和 USDT 合約變量
// Contract's Address
const addressUSDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
// Exchange's Address
const accountBinance = '0x28C6c06298d514Db089934071355E5743bf21d60';
// 構建 ABI
const abi = [
    "event Transfer(address indexed from, address indexed to, uint value)",
    "function balanceOf(address) public view returns(uint)",
]
// 構建合約對象
const contractUSDT = new ethers.Contract(addressUSDT, abi, provider);

(async () => {
    try {
      // 1. 读取币安热钱包USDT余额
      console.log("\n1. 读取币安热钱包USDT余额")
      const balanceUSDT = await contractUSDT.balanceOf(accountBinance)
      console.log(`USDT余额: ${ethers.formatUnits(balanceUSDT,6)}\n`)
  
      // 2. 创建过滤器，监听转移USDT进交易所
      console.log("\n2. 创建过滤器，监听USDT转进交易所")
      let filterBinanceIn = contractUSDT.filters.Transfer(null, accountBinance);
      console.log("过滤器详情：")
      console.log(filterBinanceIn);
      contractUSDT.on(filterBinanceIn, (res) => {
        console.log('---------监听USDT进入交易所--------');
        console.log(
          `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
        )
      })
  
      // 3. 创建过滤器，监听交易所转出USDT
      let filterToBinanceOut = contractUSDT.filters.Transfer(accountBinance);
      console.log("\n3. 创建过滤器，监听USDT转出交易所")
      console.log("过滤器详情：")
      console.log(filterToBinanceOut);
      contractUSDT.on(filterToBinanceOut, (res) => {
        console.log('---------监听USDT转出交易所--------');
        console.log(
          `${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
        )
      }
      );
    } catch (e) {
      console.log(e);
    }
  })()