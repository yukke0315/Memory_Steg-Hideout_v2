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

// 画像ファイルとテキストを受け取り、テキストを画像に埋め込む
export async function embedTextInImage(file: File, text: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
        // テキストをバイナリに変換
        const binaryData = textToBinary(text);

        // 埋め込むバイナリの長さを32bitで先頭に
        const lengthBinary: number[] = [];
        const payloadLength = binaryData.length;
        for (let i = 31; i >= 0; i--) {
            lengthBinary.push((payloadLength >> i) & 1);
        }

        // 32bit(長さ)+中身のペイロード
        const payload = [...lengthBinary, ...binaryData];

        // 画像を読み込む（ブラウザ上）
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            // キャンバスを作成して読み込んだ画像を描写
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            
            if (!ctx) {
                reject(new Error("Canvas context is not available"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            // キャンバスから画像のピクセルデータ取得
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 画像が小さすぎて入りきらない場合はエラー
            // Aを除いた数を使う（RGBAのうちR,G,Bのみ）
            const usableChannels = Math.floor(data.length * 3 / 4);
            if (payload.length > usableChannels) {
                reject(new Error("Payload is too large to embed in the image"));
                return;
            }

            // LSBにテキストのバイナリを埋め込む（Aは変更しない）
            let dataIndex = 0;
            for (let i = 0; i < payload.length; ) {
                // Aは毎4バイト目なのでスキップ
                if ((dataIndex + 1) % 4 === 0) {
                    dataIndex++;
                    continue;
                }
                // LSBを0にしてから、埋め込む
                data[dataIndex] = (data[dataIndex] & 254) | payload[i];
                dataIndex++;
                i++;
            }

            // 変更したピクセルデータをキャンバスに戻す
            ctx.putImageData(imageData, 0, 0);

            // キャンバスから画像ファイル（blob）を出力
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error("Failed to create blob"));
                }
                URL.revokeObjectURL(url);
            }, "image/png");
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
            URL.revokeObjectURL(url);
        };

        img.src = url;
    });
}

// 画像からテキストを取り出す
export async function extractTextFromImage(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Canvas context is not available"));
                return;
            }

            ctx.drawImage(img, 0, 0);

            // キャンバスから画像のピクセルデータ取得
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 先頭32bitから長さを取得（Aは無視してR,G,Bのみから読む）
            let payloadLength = 0;
            let dataIndex = 0;
            for (let i = 0; i < 32; ) {
                if ((dataIndex + 1) % 4 === 0) {
                    dataIndex++;
                    continue;
                }
                payloadLength = (payloadLength << 1) | (data[dataIndex] & 1);
                dataIndex++;
                i++;
            }

            // 画像サイズ超えならエラー
            // Aを除いた数でチェック
            const usableChannels = Math.floor(data.length * 3 / 4);
            if (payloadLength <= 0 || payloadLength > usableChannels - 32) {
                reject(new Error("Invalid payload length"));
                return;
            }

            // 長さ分LSBを取り出す
            const binaryData: number[] = [];
            let extracted = 0;
            while (extracted < payloadLength && dataIndex < data.length) {
                if ((dataIndex + 1) % 4 === 0) {
                    dataIndex++;
                    continue;
                }
                binaryData.push(data[dataIndex] & 1);
                dataIndex++;
                extracted++;
            }

            // 1byte毎にまとめて数値配列に
            const bytes: number[] = [];
            for (let i = 0; i < binaryData.length; i += 8) {
                let byte = 0;
                for (let j = 0; j < 8; j++) {
                    byte = (byte << 1) | binaryData[i + j];
                }
                bytes.push(byte);
            }

            // UTF-8に戻す
            const decoder = new TextDecoder();
            const decodedText = decoder.decode(new Uint8Array(bytes));

            resolve(decodedText);
            URL.revokeObjectURL(url);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image"));
            URL.revokeObjectURL(url);
        };

        img.src = url;
    });
}