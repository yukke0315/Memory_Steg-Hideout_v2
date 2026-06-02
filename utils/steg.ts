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
            if (payload.length > data.length) {
                reject(new Error("Payload is too large to embed in the image"));
                return;
            }
            // LSBにテキストのバイナリを埋め込む（stegano）
            for (let i = 0; i < payload.length; i++) {
                // LSBを0にしてから、埋め込む
                data[i] = (data[i] & 254) | payload[i];
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

            // 先頭32bitから長さを取得
            let payloadLength = 0;
            for (let i = 0; i < 32; i++) {
                // 左にシフトしてLSBを足す
                payloadLength = (payloadLength << 1) | (data[i] & 1);
            }

            // 画像サイズ超えならエラー
            if (payloadLength <= 0 || payloadLength > data.length - 32) {
                reject(new Error("Invalid payload length"));
                return;
            }

            // 長さ分LSBを取り出す
            const binaryData: number[] = [];
            for (let i = 32; i < 32 + payloadLength; i++) {
                binaryData.push(data[i] & 1);
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