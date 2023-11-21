// 事件 Event
// 智能合約釋放出的Event -> 儲存於 EVM 的日誌中
// 日誌 -> topics(hash, indexed (方便之後搜索)) & data(沒有indexed變量（不能直接被檢索）可儲存更複雜的數據結構)
// ---------------------------
// Example 
// event Transfer(address indexed from, address indexed to, uint256 amount);

import { ethers } from "ethers";

// 利用Alchemy的rpc节点连接以太坊网络
const ALCHEMY_GOERLI_URL = 'https://eth-goerli.g.alchemy.com/v2/S2JZo8sBezYi2DrE3gV-ln2zU6WArQNO';
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey = '0x227dbb8586117d55284e26620bc76534dfbd2394be34cf4a09cb775d593b6f2b'
const wallet = new ethers.Wallet(privateKey, provider)

// 創建包含檢索事件的abi
// WETH ABI, 只包含我們關心的Transfer事件
const abiWETH = [
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

// 聲明 WETH 合約實例
// 測試網 WETH 地址
const addressWETH = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
// 聲明合約實例
const contract = new ethers.Contract(addressWETH, abiWETH, provider);

const main = async () => {
    // 獲取過去 10 個區塊內的 Transfer 事件，並打印出 1 個
    // topics -> Hash, from, to
    // data -> amount
    // ethers還會根據 ABI 自動解析 Event，結果顯示在 args 成員中

    // 得到當前block
    const block = await provider.getBlockNumber();
    console.log(`當前區塊高度：${block}`);
    console.log(`打印 Event 詳情: `)
    const transferEvents = await contract.queryFilter('Transfer', block - 10, block)
    // 打印第一個 Transfer 事件
    console.log(transferEvents[0])

    // 讀取事件的解析結果
    console.log("\n2. 解析事件: ")
    const amount = ethers.formatUnits(ethers.getBigInt(transferEvents[0].args["amount"], "ether"));
    console.log(`地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`)
}

main()
