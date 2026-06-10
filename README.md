# すまいPLUS ランディングページ

リフォーム会社「すまいPLUS」の問い合わせ獲得用ランディングページです。

## 構成

1. ファーストビュー（キャッチコピー）
2. お悩み共感セクション
3. 選ばれる理由（3点）
4. ご利用の流れ（5ステップ）
5. お客様の声
6. FAQ
7. 問い合わせCTA（LINEボタン＋フォーム）

## ローカルで確認

```bash
npx serve -l 8000
```

http://localhost:8000 を開いてください。

## 紹介動画スライドショー

LPの内容をもとにした 16:9 のプロモーション動画用スライドショーです。

```bash
npx serve -l 8000
```

http://localhost:8000/promo/promo.html を開いてください。

- 全9スライド・約57秒（各スライドの `data-duration` で秒数を変更可能）
- 自動再生・一時停止・最初から再生・全画面表示
- ⏺ ボタンでブラウザ内画面録画（WebM形式でダウンロード）
- MP4が必要な場合は [CloudConvert](https://cloudconvert.com/webm-to-mp4) などで変換

## カスタマイズ

- LINEのURL（`https://line.me/R/ti/p/@sumaiplus`）を実際のアカウントに変更
- 電話番号・対応エリア・お客様の声を実データに差し替え
- フォーム送信は [Formspree](https://formspree.io/) などと連携可能
