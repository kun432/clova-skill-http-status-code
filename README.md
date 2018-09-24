# clova-skill-http-status-code

### はじめに

Clovaスキル「HTTPステータス検索」

<img src="/img/717OwWXjBKL._SL210_QL95_BG0,0,0,0_FMpng_.png">

### スキルについて

- スキルを利用するには、 Clovaアプリから有効にしてください。
- 「ねぇClova、HTTPステータス検索を開いて」で起動し、その後、「ステータスコード200を教えて」というと、ステータスコードの意味を教えてくれます。
j
[![Youtube動画はこちら](http://img.youtube.com/vi/pkgNYGQvqj4/0.jpg)](http://www.youtube.com/watch?v=pkgNYGQvqj4)

### 使い方

詳細は割愛。手順未検証ですので、不備あればissueまで。

#### 0. 概要

[](design-clova-skill-http-status-code.png)

#### 1. レポジトリをclone

```sh
$ git clone https://github.com/kun432/clova-skill-http-status-code
$ cd clova-skill-http-status-code
```

#### 2. Clovaスキルの設定


- Clova Developer Centerでスキルを作成
  - 「タイプ」は「カスタム」
  - Extension IDは後で使うので控えておく
  - 「AudioPlayerの使用」は「いいえ」
- 対話モデルダッシュボードにアクセスし、カスタムインテント「HttpStatusCodeIntent」を作成
- 「HttpStatusCodeIntent」をクリックし、サンプル発話リスト右上の「アップロード」をクリックして、レポジトリ内の```HttpStatusCodeIntent.tsv```をアップロード
- ビルド

#### 3. Lambdaの設定

- 関数を作成
  - ランタイムは、```Node.js 8.10```
  - 環境変数に以下をセット
    - ```applicationId``` : clovaで作成したExtension ID
- レポジトリ内のソースコードをZIPパッケージ化

```sh
$ cd lambda/custom
$ zip -r ../custom.zip *
```

- Lambdaｍに上記ZIPをアップロード

#### 3. API Gatewayの設定

- API Gatewayから新しいAPI作成
- リソース"/"から、リソースの作成
  - リソースパスは"/clova"
- リソース"/clova"から、メソッドの作成
  - ```POST```を選択
  - ```Lambdaプロキシ統合の使用```にチェック
  - Lambda関数に先ほど作成したLambda関数名を設定
- APIのデプロイを実行
- ```ステージ名/clova```を選択して表示されるURLを控えておく

#### 4. Clovaスキル側のExtension Serverの設定

- API Gatewayで出力されたURLを保存