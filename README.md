# clova-skill-http-status-code

### はじめに

Clovaスキル「HTTPステータス検索」のリポジトリです

### スキルについて

詳細は以下をご覧ください

https://kun432.github.io/works/clova-skill-http-status-search/

### 必要なもの

- Clova
- LINEアカウント
- AWSアカウント
- AWS Lambda
- AWS API Gateway

### 使い方

詳細は割愛。手順未検証ですので、不備あればissueまで。

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
$ npm install
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