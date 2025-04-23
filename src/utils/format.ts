// src/utils/format.ts

export function formatAmount(amountRaw: string, decimals: number): string {
    if (!amountRaw) return '0';
    const decimalN = Number(decimals.toString())
    const n = BigInt(amountRaw);
    const divisor = BigInt(10) ** BigInt(decimalN);
    const whole = n / divisor;
    const remainder = n % divisor;

    if (remainder === 0n) {
        return whole.toString();
    }

    // 处理小数部分
    const remainderStr = remainder.toString().padStart(decimalN, '0');
    const decimalPart = remainderStr.slice(0, decimalN).replace(/0+$/, '');
    return decimalPart.length > 0
        ? `${whole}.${decimalPart}`
        : whole.toString();
}