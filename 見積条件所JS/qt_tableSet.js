//テーブルへの初期値の設定

(function () {
  "use strict";

  kintone.events.on("app.record.create.show", function (event) {
    const record = event.record;
    const initialRows = [];
    const initialRows_sum = [];
    const itemList = [
      ["01", "要件整理", "要件確認"],
      ["02", "設計", "システム構成図・リソース一覧"],
      ["03", "設計", "監視申請書"],
      ["04", "設計", "メッセージ対処表"],
      ["05", "設計", "一次対処手順"],
      ["06", "設計", "インシデント対応フロー"],
      ["07", "設計", "障害ランク表"],
      ["08", "設計", "緊急連絡体制図"],
      ["09", "設計", "サービス正常性確認手順"],
      ["10", "設計", "パッチ適用・クラウド基盤メンテナンス設計"],
      ["11", "実装", "PagerDuty構築"],
      ["12", "実装", "AMS構築"],
      ["13", "実装", "ResourceVisualizer構築"],
      ["14", "実装", "検証環境_インフラ監視(NewRelic、NewRelic Synthetics、AMS)",],
      ["15", "実装", "検証環境_インフラ監視(NewRelic Synthetics)"],
      ["16", "実装", "検証環境_インフラ監視(AMS)"],
      ["17", "実装", "検証環境_アプリログ監視(ログ転送Lambdaデプロイ)"],
      ["18", "実装", "検証環境_アプリログ監視(NewRelic)"],
      ["19", "実装", "検証環境_アプリログ監視(AMS)"],
      ["20", "実装", "号口環境_インフラ監視(NewRelic)"],
      ["21", "実装", "号口環境_インフラ監視(NewRelic Synthetics)"],
      ["22", "実装", "号口環境_インフラ監視(AMS)"],
      ["23", "実装", "号口環境_アプリログ監視(ログ転送Lambdaデプロイ)"],
      ["24", "実装", "号口環境_アプリログ監視(NewRelic)"],
      ["25", "実装", "号口環境_アプリログ監視(AMS)"],
      ["26", "テスト", "検証単体_テスト設計"],
      ["27", "テスト", "検証単体_テスト実施"],
      ["28", "テスト", "検証単体_テスト結果報告書作成"],
      ["29", "テスト", "運用結合_テスト設計"],
      ["30", "テスト", "運用結合_テスト実施"],
      ["31", "テスト", "運用結合_テスト結果報告書作成"],
      ["32", "テスト", "号口配信_テスト設計"],
      ["33", "テスト", "号口配信_テスト実施"],
      ["34", "テスト", "号口配信_テスト結果報告書作成"],
      ["35", "その他", "運用引継ぎ"],
      ["36", "その他", "運用引継ぎ指摘対応"],
      ["37", "その他", "運用バックログ情報整備"],
      ["38", "その他", "キックオフ"],
      ["39", "その他", "定例会"],
      ["40", "その他", "納品"],
      ["41", "管理", "課題管理"],
      ["42", "管理", "進捗管理"],
      ["43", "管理", "問い合わせ対応"],
    ];

    const itemList_sum = [
      "合計",
      "合計_要件整理（プレ工数）を含まない",
      "合計_精査書作成（プレ工数）を含む",
    ];

    //見積費用明細_運用構築テーブルに初期値セット
    for (var i = 0; i < itemList.length; i++) {
      initialRows.push({
        value: {
          見積費用明細_ID: {
            type: "SINGLE_LINE_TEXT",
            value: itemList[i][0],
          },
          見積費用明細_削除フラグ: {
            type: "NUMBER",
            value: 0,
          },
          見積費用明細_大項目: {
            type: "SINGLE_LINE_TEXT",
            value: itemList[i][1],
          },
          見積費用明細_項目: {
            type: "SINGLE_LINE_TEXT",
            value: itemList[i][2],
          },
          見積費用明細_PM: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_PL: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_メンバ1: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_メンバ2: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_メンバ3: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_運用受入: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_TC小計: {
            type: "CALC",
            value: "",
          },
          見積費用明細_上級SE: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_SE: {
            type: "NUMBER",
            value: "",
          },
          見積費用明細_外注小計: {
            type: "CALC",
            value: "",
          },
          見積費用明細_合計時間: {
            type: "CALC",
            value: "",
          },
        },
      });
    }

    record.見積費用明細_運用構築.value = initialRows;

    //合計テーブルに初期値セット
    for (var i = 0; i < itemList_sum.length; i++) {
      initialRows_sum.push({
        value: {
          合計_項目: {
            type: "SINGLE_LINE_TEXT",
            value: itemList_sum[i],
          },
          合計_PM: {
            type: "NUMBER",
            value: "",
          },
          合計_PL: {
            type: "NUMBER",
            value: "",
          },
          合計_メンバ1: {
            type: "NUMBER",
            value: "",
          },
          合計_メンバ2: {
            type: "NUMBER",
            value: "",
          },
          合計_メンバ3: {
            type: "NUMBER",
            value: "",
          },
          合計_運用受入: {
            type: "NUMBER",
            value: "",
          },
          合計_TC小計: {
            type: "CALC",
            value: "",
          },
          合計_上級SE: {
            type: "NUMBER",
            value: "",
          },
          合計_SE: {
            type: "NUMBER",
            value: "",
          },
          合計_外注小計: {
            type: "CALC",
            value: "",
          },
          合計_合計時間: {
            type: "CALC",
            value: "",
          },
        },
      });
    }

    record.合計.value = initialRows_sum;

    return event;
  });
})();
