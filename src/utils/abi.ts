// src/utils/abi.ts

export const ERC20_ABI = [
    // 只包含常用事件
    "event Transfer(address indexed from, address indexed to, uint256 value)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
];

export const UNISWAP_V2_PAIR_ABI = [
    "event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)",
    "event Mint(address indexed sender, uint amount0, uint amount1)",
    "event Burn(address indexed sender, uint amount0, uint amount1, address indexed to)",
    "event Sync(uint112 reserve0, uint112 reserve1)",
];
