# gulp-boiler-jade-babel-postcss

- gulp-boiler-jade-babel-postcssリポジトリ


# プレビュー

## MUプレビュー

[sample](sample) 


# ファイルデプロイ先

## テスト

- sample 以下

## テスト CDNかける場合

- sample 以下

## 本番

- sample 以下

## 本番 CDNかける場合

- sample 以下


# Jenkins

## プレビュー

[sample](sample) 

## test-x.gnst デプロイ

[sample](sample) 

## sample 本番 デプロイ

以下の2ステップによりリリースしてください

1.[sample](sample) 

2.[sample](sample) 


# version

- [version.jsonを参照](https://github.com/gurunavi-creators/gnavi-gulp-boiler-jade-babel-postcss/blob/master/version.json) 


# package

## package installed

- [package.jsonを参照](https://github.com/gurunavi-creators/gnavi-gulp-boiler-jade-babel-postcss/blob/master/package.json) 


# config

## install

### install

    npm i

### ready for development

    gulp sprite

### start development with clean & watch

    gulp start

### build

    gulp

## build command

### for Product

    gulp

## watch command

    gulp watch

## sprite command

    gulp sprite

## image optim command

    gulp optim

## es-lint command

    gulp test

## clean dist/、tmp/ command

    gulp clean


# ルートディレクトリ構成

    bin/ ： ビルド・デプロイシェル
    dist/ ： 出力ディレクトリ
    src/ ： 開発ディレクトリ
    tmp/ ： 中間生成物一時保管ディレクトリ
    .editorconfig
    .gitignore
    gulpfile.js
    Makefile ： ビルド・デプロイシェル
    package.json
    README.md


# 開発ディレクトリ構成

編集対象は src/ 以下のみ

    src/
      └ jade/ ： jade view
        └ data/ ： data
        └ html/ ： page
        └ include/ ： parts
      └ img/ ： 画像
      └ js/ ： js
        └ lib/ ： lib.js 素材
        └ common/ ： common.js 素材
      └ css/ ： css
        └ common/ ： common.css
        └ sprite/ ： sprite画像


# CSS開発方針

## 設計方針

- [SMACSS](https://smacss.com/) 

## セレクター命名方針

- [MindBEMding](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) 


