// 日本語テキストをバイナリに変換する
export function textToBinary(text: string): number[] {
    // stringをUTF-8バイト列に変換
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);

    // 戻り値用バイナリ格納配列
    const binaryArray: number[] = [];

    // バイト毎に処理
    for (const byte of bytes) {
        // 1byte->8bitに分解
        for (let i = 7; i >= 0; i--) {
            // i右シフトして1bitずつ上から取り出す
            binaryArray.push((byte >> i) & 1);
        }
    }
    return binaryArray;
}