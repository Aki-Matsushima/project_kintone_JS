//条件によって項目の表示非表示を切り替える処理
//非表示時、値のクリアも行う（誤って不要な項目を入力した後非表示にした場合、値が残ったままになってしまうため）

(() => {
  "use strict";

  //常に非表示
  kintone.events.on(
    ["app.record.create.show", "app.record.edit.show"],
    (event) => {
      kintone.app.record.setFieldShown("セキュリティチェック隠し", false);

      kintone.app.record.setFieldShown("定例の回数と所要時間隠し", false);

      kintone.app.record.setFieldShown(
        "見積費用明細計算用_定例工数隠し",
        false
      );
    }
  );

  /*-------------------------------------------
      案件情報
  -------------------------------------------*/

  //見積有無編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.見積有無",
      "app.record.edit.change.見積有無",
    ],
    (event) => {
      const record = event.record;

      //見積有無でチェックが付いているものだけ提出期限を表示
      const estimate_check = record.見積有無.value;
      if (estimate_check.indexOf("超概算見積") > -1) {
        kintone.app.record.setFieldShown("超概算見積提出期日", true);
      } else {
        kintone.app.record.setFieldShown("超概算見積提出期日", false);
        record.超概算見積提出期日.value = "";
      }

      if (estimate_check.indexOf("概算見積") > -1) {
        kintone.app.record.setFieldShown("概算見積提出期日", true);
      } else {
        kintone.app.record.setFieldShown("概算見積提出期日", false);
        record.概算見積提出期日.value = "";
      }

      if (estimate_check.indexOf("正式見積") > -1) {
        kintone.app.record.setFieldShown("正式見積提出期日", true);
      } else {
        kintone.app.record.setFieldShown("正式見積提出期日", false);
        record.正式見積提出期日.value = "";
      }

      return event;
    }
  );

  //検収日と号口日編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.検収日",
      "app.record.edit.change.検収日",
      "app.record.create.change.号口日",
      "app.record.edit.change.号口日",
    ],
    (event) => {
      const record = event.record;

      const inspectionDate = record.検収日.value; //検収日
      const gouguchiDate = record.号口日.value; //号口日

      //号口日が検収日より前に設定されていた場合に理由記入欄を表示
      if (inspectionDate > gouguchiDate) {
        kintone.app.record.setFieldShown(
          "号口日が検収日より前に設定されています理由を記載ください",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "号口日が検収日より前に設定されています理由を記載ください",
          false
        );
      }
    }
  );

  //セキュリティチェック編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.セキュリティチェック",
      "app.record.edit.change.セキュリティチェック",
    ],
    (event) => {
      const record = event.record;

      //セキュリティチェックが「済」か「否」かで表示するフィールドを切り替える
      if (record.セキュリティチェック.value === "済") {
        record.セキュリティチェック完了予定日.value = "";
        kintone.app.record.setFieldShown("セキュリティチェックURL", true);
        kintone.app.record.setFieldShown(
          "セキュリティチェック完了予定日",
          false
        );
      } else {
        record.セキュリティチェックURL.value = "";
        kintone.app.record.setFieldShown("セキュリティチェックURL", false);
        kintone.app.record.setFieldShown(
          "セキュリティチェック完了予定日",
          true
        );
      }
      return event;
    }
  );

  /*-------------------------------------------
      環境変数 
  -------------------------------------------*/

  //システム数編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.システム数",
      "app.record.edit.change.システム数",
    ],
    (event) => {
      const record = event.record;

      const numberOfSystem = record.システム数.value;

      //システム数が1なら、2と3のフィールドだけ非表示し値もクリア
      //システム数が2なら、3のフィールドだけ非表示し値もクリア
      //システム数が3なら、全部表示
      if (numberOfSystem === "1") {
        SystemCountShownFalse(2, event);
        SystemCountShownFalse(3, event);
      } else if (numberOfSystem === "2") {
        SystemCountShownFalse(3, event);
        SystemCountShownTrue(2, event);
      } else if (numberOfSystem === "3") {
        SystemCountShownTrue(2, event);
        SystemCountShownTrue(3, event);
      }
      return event;
    }
  );

  /*-------------------------------------------
    環境変数　システム1
  -------------------------------------------*/

  //検証アカウントID1編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.検証アカウントID1",
      "app.record.edit.change.検証アカウントID1",
    ],
    (event) => {
      const record = event.record;
      //検証アカウントID1が空欄の場合は理由を記載させる（その他以外に切り替えた場合、その他ツール名の値をクリア）
      if (
        record.検証アカウントID1.value === "" ||
        record.検証アカウントID1.value === undefined
      ) {
        kintone.app.record.setFieldShown(
          "検証環境がない場合理由を記載ください1",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "検証環境がない場合理由を記載ください1",
          false
        );
        record.検証環境がない場合理由を記載ください1.value = "";
      }
      return event;
    }
  );

  //外部からのアクセス方式編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.外部からのアクセス方式1",
      "app.record.edit.change.外部からのアクセス方式1",
    ],
    (event) => {
      const record = event.record;

      //その他の場合はアクセス方式を記載させる（その他以外に切り替えた場合、その他アクセス方式の値をクリア）
      if (record.外部からのアクセス方式1.value === "その他") {
        kintone.app.record.setFieldShown(
          "その他の場合はアクセス方式を記載ください1",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "その他の場合はアクセス方式を記載ください1",
          false
        );
        record.その他の場合はアクセス方式を記載ください1.value = "";
      }
      return event;
    }
  );

  //監視ツール編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.監視ツール1",
      "app.record.edit.change.監視ツール1",
    ],
    (event) => {
      const record = event.record;

      //その他の場合は監視ツールを記載させる（その他以外に切り替えた場合、その他ツール名の値をクリア）
      if (record.監視ツール1.value === "その他") {
        kintone.app.record.setFieldShown(
          "その他の場合はツール名を記載ください1",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "その他の場合はツール名を記載ください1",
          false
        );
        record.その他の場合はツール名を記載ください1.value = "";
      }
      return event;
    }
  );

  //EC2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.EC21",
      "app.record.edit.change.EC21",
    ],
    (event) => {
      const record = event.record;

      //EC2が有の場合はNewrelic_Datadogエージェント導入有無を表示させる
      if (record.EC21.value === "有") {
        kintone.app.record.setFieldShown(
          "Newrelic_Datadogエージェント導入有無1",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "Newrelic_Datadogエージェント導入有無1",
          false
        );
        record.Newrelic_Datadogエージェント導入有無1.value = "---";
      }
      return event;
    }
  );

  //Newrelic/Datadogエージェント導入有無編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.Newrelic_Datadogエージェント導入有無1",
      "app.record.edit.change.Newrelic_Datadogエージェント導入有無1",
    ],
    (event) => {
      const record = event.record;

      //Newrelic_Datadogエージェント導入有無が有だったら導入担当を表示する
      if (record.Newrelic_Datadogエージェント導入有無1.value === "有") {
        kintone.app.record.setFieldShown("導入担当1", true);
        record.導入担当1.value = "運用構築";
      } else {
        kintone.app.record.setFieldShown("導入担当1", false);
        record.導入担当1.value = "---";
      }
      return event;
    }
  );

  //アプリログ編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.アプリログ1",
      "app.record.edit.change.アプリログ1",
    ],
    (event) => {
      const record = event.record;

      //アプリログが有の場合はECSのログ転送方式とアプリログへの出力形式を表示させる
      if (record.アプリログ1.value === "有") {
        kintone.app.record.setFieldShown("ECSのログ転送方式1", true);
        kintone.app.record.setFieldShown("アプリログへの出力形式1", true);
      } else {
        kintone.app.record.setFieldShown("ECSのログ転送方式1", false);
        kintone.app.record.setFieldShown("アプリログへの出力形式1", false);
        record.ECSのログ転送方式1.value = "";
        record.アプリログへの出力形式1.value = "---";
      }
      return event;
    }
  );

  /*-------------------------------------------
    環境変数　システム2
  -------------------------------------------*/

  //検証アカウントID2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.検証アカウントID2",
      "app.record.edit.change.検証アカウントID2",
    ],
    (event) => {
      const record = event.record;
      kintone.app.record.setFieldShown(
        "検証環境がない場合理由を記載ください2",
        false
      );
      //検証アカウントID2が空欄の場合は理由を記載させる（その他以外に切り替えた場合、その他ツール名の値をクリア）
      if (
        (record.検証アカウントID2.value === "" ||
          record.検証アカウントID2.value === undefined) &&
        record.システム数.value !== "1"
      ) {
        kintone.app.record.setFieldShown(
          "検証環境がない場合理由を記載ください2",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "検証環境がない場合理由を記載ください2",
          false
        );
        record.検証環境がない場合理由を記載ください2.value = "";
      }
      return event;
    }
  );

  //外部からのアクセス方式2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.外部からのアクセス方式2",
      "app.record.edit.change.外部からのアクセス方式2",
    ],
    (event) => {
      const record = event.record;

      //その他の場合はアクセス方式を記載させる（その他以外に切り替えた場合、その他アクセス方式の値をクリア）
      if (record.外部からのアクセス方式2.value === "その他") {
        kintone.app.record.setFieldShown(
          "その他の場合はアクセス方式を記載ください2",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "その他の場合はアクセス方式を記載ください2",
          false
        );
        record.その他の場合はアクセス方式を記載ください2.value = "";
      }
      return event;
    }
  );

  //監視ツール2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.監視ツール2",
      "app.record.edit.change.監視ツール2",
    ],
    (event) => {
      const record = event.record;

      //その他の場合は監視ツールを記載させる（その他以外に切り替えた場合、その他ツール名の値をクリア）
      if (record.監視ツール2.value === "その他") {
        kintone.app.record.setFieldShown(
          "その他の場合はツール名を記載ください2",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "その他の場合はツール名を記載ください2",
          false
        );
        record.その他の場合はツール名を記載ください2.value = "";
      }
      return event;
    }
  );

  //EC22編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.EC22",
      "app.record.edit.change.EC22",
    ],
    (event) => {
      const record = event.record;

      //EC2が有の場合はNewrelic_Datadogエージェント導入有無を表示させる
      if (record.EC22.value === "有") {
        kintone.app.record.setFieldShown(
          "Newrelic_Datadogエージェント導入有無2",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "Newrelic_Datadogエージェント導入有無2",
          false
        );
        record.Newrelic_Datadogエージェント導入有無2.value = "---";
      }
      return event;
    }
  );

  //Newrelic/Datadogエージェント導入有無2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.Newrelic_Datadogエージェント導入有無2",
      "app.record.edit.change.Newrelic_Datadogエージェント導入有無2",
    ],
    (event) => {
      const record = event.record;

      //Newrelic_Datadogエージェント導入有無2が有だったら導入担当2を表示する
      if (record.Newrelic_Datadogエージェント導入有無2.value === "有") {
        kintone.app.record.setFieldShown("導入担当2", true);
        record.導入担当2.value = "運用構築";
      } else {
        kintone.app.record.setFieldShown("導入担当2", false);
        record.導入担当2.value = "---";
      }
      return event;
    }
  );

  //アプリログ2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.アプリログ2",
      "app.record.edit.change.アプリログ2",
    ],
    (event) => {
      const record = event.record;

      //アプリログが有の場合はECSのログ転送方式とアプリログへの出力形式を表示させる
      if (record.アプリログ2.value === "有") {
        kintone.app.record.setFieldShown("ECSのログ転送方式2", true);
        kintone.app.record.setFieldShown("アプリログへの出力形式2", true);
      } else {
        kintone.app.record.setFieldShown("ECSのログ転送方式2", false);
        kintone.app.record.setFieldShown("アプリログへの出力形式2", false);
        record.ECSのログ転送方式2.value = "";
        record.アプリログへの出力形式2.value = "---";
      }
      return event;
    }
  );

  /*-------------------------------------------
  環境変数　システム3
-------------------------------------------*/

  //検証アカウントID3編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.検証アカウントID3",
      "app.record.edit.change.検証アカウントID3",
    ],
    (event) => {
      const record = event.record;

      //検証アカウントID3が空欄の場合は理由を記載させる（その他以外に切り替えた場合、その他ツール名の値をクリア）
      if (
        (record.検証アカウントID3.value === "" ||
          record.検証アカウントID3.value === undefined) &&
        record.システム数.value === "3"
      ) {
        kintone.app.record.setFieldShown(
          "検証環境がない場合理由を記載ください3",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "検証環境がない場合理由を記載ください3",
          false
        );
        record.検証環境がない場合理由を記載ください3.value = "";
      }
      return event;
    }
  );

  //外部からのアクセス方式3編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.外部からのアクセス方式3",
      "app.record.edit.change.外部からのアクセス方式3",
    ],
    (event) => {
      const record = event.record;

      //その他の場合はアクセス方式を記載させる（その他以外に切り替えた場合、その他アクセス方式の値をクリア）
      if (record.外部からのアクセス方式3.value === "その他") {
        kintone.app.record.setFieldShown(
          "その他の場合はアクセス方式を記載ください3",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "その他の場合はアクセス方式を記載ください3",
          false
        );
        record.その他の場合はアクセス方式を記載ください3.value = "";
      }
      return event;
    }
  );

  //監視ツール3編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.監視ツール3",
      "app.record.edit.change.監視ツール3",
    ],
    (event) => {
      const record = event.record;

      //その他の場合は監視ツールを記載させる（その他以外に切り替えた場合、その他ツール名の値をクリア）
      if (record.監視ツール3.value === "その他") {
        kintone.app.record.setFieldShown(
          "その他の場合はツール名を記載ください3",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "その他の場合はツール名を記載ください3",
          false
        );
        record.その他の場合はツール名を記載ください3.value = "";
      }
      return event;
    }
  );

  //EC23編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.EC23",
      "app.record.edit.change.EC23",
    ],
    (event) => {
      const record = event.record;

      //EC2が有の場合はNewrelic_Datadogエージェント導入有無を表示させる
      if (record.EC23.value === "有") {
        kintone.app.record.setFieldShown(
          "Newrelic_Datadogエージェント導入有無3",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "Newrelic_Datadogエージェント導入有無3",
          false
        );
        record.Newrelic_Datadogエージェント導入有無3.value = "---";
      }
      return event;
    }
  );

  //Newrelic/Datadogエージェント導入有無2編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.Newrelic_Datadogエージェント導入有無3",
      "app.record.edit.change.Newrelic_Datadogエージェント導入有無3",
    ],
    (event) => {
      const record = event.record;

      //Newrelic_Datadogエージェント導入有無3が有だったら導入担当2を表示する
      if (record.Newrelic_Datadogエージェント導入有無3.value === "有") {
        kintone.app.record.setFieldShown("導入担当3", true);
        record.導入担当3.value = "運用構築";
      } else {
        kintone.app.record.setFieldShown("導入担当3", false);
        record.導入担当3.value = "---";
      }
      return event;
    }
  );

  //アプリログ3編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.アプリログ3",
      "app.record.edit.change.アプリログ3",
    ],
    (event) => {
      const record = event.record;

      //アプリログが有の場合はECSのログ転送方式とアプリログへの出力形式を表示させる
      if (record.アプリログ3.value === "有") {
        kintone.app.record.setFieldShown("ECSのログ転送方式3", true);
        kintone.app.record.setFieldShown("アプリログへの出力形式3", true);
      } else {
        kintone.app.record.setFieldShown("ECSのログ転送方式3", false);
        kintone.app.record.setFieldShown("アプリログへの出力形式3", false);
        record.ECSのログ転送方式3.value = "";
        record.アプリログへの出力形式3.value = "---";
      }
      return event;
    }
  );

  /*-------------------------------------------
      開発体制
  -------------------------------------------*/

  //開発フェーズと運用フェーズの担当者は別か編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.開発フェーズと運用フェーズの担当者は別か",
      "app.record.edit.change.開発フェーズと運用フェーズの担当者は別か",
    ],
    (event) => {
      const record = event.record;

      //開発フェーズと運用フェーズの担当者は別かが別々の場合は運用担当者らを表示させる
      if (record.開発フェーズと運用フェーズの担当者は別か.value === "別々") {
        kintone.app.record.setFieldShown("TC営業運用部署名", true);
        kintone.app.record.setFieldShown("TC営業_運用主担当者", true);
        kintone.app.record.setFieldShown("TC営業_運用副担当者1", true);
        kintone.app.record.setFieldShown("TC営業_運用副担当者2", true);
      } else {
        kintone.app.record.setFieldShown("TC営業運用部署名", false);
        kintone.app.record.setFieldShown("TC営業_運用主担当者", false);
        kintone.app.record.setFieldShown("TC営業_運用副担当者1", false);
        kintone.app.record.setFieldShown("TC営業_運用副担当者2", false);
        record.TC営業運用部署名.value = "";
        record.TC営業_運用主担当者.value = "";
        record.TC営業_運用副担当者1.value = "";
        record.TC営業_運用副担当者2.value = "";
      }
      return event;
    }
  );

  /*-------------------------------------------
      開発スケジュール
  -------------------------------------------*/
  //号口環境：インフラリソース構築日,アプリデプロイ日,（サービスイン）編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.号口環境_インフラリソース構築日",
      "app.record.edit.change.号口環境_インフラリソース構築日",
      "app.record.create.change.号口環境_アプリデプロイ日",
      "app.record.edit.change.号口環境_アプリデプロイ日",
      "app.record.create.change.号口日_サービスイン",
      "app.record.edit.change.号口日_サービスイン",
    ],
    (event) => {
      const record = event.record;

      const buildingDate = record.号口環境_インフラリソース構築日.value; //号口環境：インフラリソース構築日
      const deployDate = record.号口環境_アプリデプロイ日.value; //号口環境：アプリデプロイ日
      const gouguchiDate = record.号口日_サービスイン.value; //号口日（サービスイン）

      //号口日と構築日またはデプロイ日が同日に設定されていた場合に理由記入欄を表示
      if (buildingDate === gouguchiDate || deployDate === gouguchiDate) {
        kintone.app.record.setFieldShown(
          "アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください",
          true
        );
      } else {
        kintone.app.record.setFieldShown(
          "アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください",
          false
        );
        record.アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください.value =
          "";
      }
    }
  );

  /*-------------------------------------------
      コミュニケーション
  -------------------------------------------*/

  //週次定例の実施編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.週次定例の実施",
      "app.record.edit.change.週次定例の実施",
    ],
    (event) => {
      const record = event.record;

      //週次定例の実施が有の場合は定例の頻度と所要時間を表示させる
      if (record.週次定例の実施.value === "有") {
        kintone.app.record.setFieldShown("定例の頻度", true);
        kintone.app.record.setFieldShown("所要時間", true);
        kintone.app.record.setFieldShown("参加メンバー", true);
      } else {
        kintone.app.record.setFieldShown("定例の頻度", false);
        kintone.app.record.setFieldShown("所要時間", false);
        kintone.app.record.setFieldShown("参加メンバー", false);
        record.定例の頻度.value = "";
        record.所要時間.value = "";
        record.参加メンバー.value = [];
      }

      return event;
    }
  );

  //週次進捗報告会の実施編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.週次進捗報告会の実施",
      "app.record.edit.change.週次進捗報告会の実施",
    ],
    (event) => {
      const record = event.record;

      //週次進捗報告会の実施が有の場合は報告の仕方を表示させる
      if (record.週次進捗報告会の実施.value === "有") {
        kintone.app.record.setFieldShown("報告の仕方", true);
      } else {
        kintone.app.record.setFieldShown("報告の仕方", false);
        record.報告の仕方.value = "";
      }
      return event;
    }
  );

  /*-------------------------------------------
      アウトプットイメージ
  -------------------------------------------*/

  OutputImage("システム構成図", 2);
  OutputImage("メッセージ対処表", 2);
  OutputImage("一次対処手順", 2);
  OutputImage("サービス正常性確認手順", 2);
  OutputImage("障害ランク表", 1);
  OutputImage("緊急連絡体制図", 1);
  OutputImage("クラウドメンテナンス設計", 2);
  OutputImage("インシデント対応フロー", 1);
  OutputImage("運用設計書", 1);

  /*-------------------------------------------
      標準監視
  -------------------------------------------*/

  //大項目選択編集時
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      "app.record.create.change.大項目選択",
      "app.record.edit.change.大項目選択",
    ],
    (event) => {
      const record = event.record;

      //見積有無でチェックが付いているものだけ提出期限を表示
      const mainItems = record.大項目選択.value;

      if (mainItems.indexOf("監視対象（インフラ）") > -1) {
        kintone.app.record.setFieldShown("AWSリソース", true);
      } else {
        kintone.app.record.setFieldShown("AWSリソース", false);
      }

      if (mainItems.indexOf("外形監視（URL）") > -1) {
        kintone.app.record.setFieldShown("外形監視URL", true);
      } else {
        kintone.app.record.setFieldShown("外形監視URL", false);
      }

      if (mainItems.indexOf("監視対象（アプリ）") > -1) {
        kintone.app.record.setFieldShown("ログ", true);
      } else {
        kintone.app.record.setFieldShown("ログ", false);
      }

      if (mainItems.indexOf("オプション監視") > -1) {
        kintone.app.record.setFieldShown("オプション監視", true);
      } else {
        kintone.app.record.setFieldShown("オプション監視", false);
      }

      if (mainItems.indexOf("カスタム監視") > -1) {
        kintone.app.record.setFieldShown("カスタム監視", true);
      } else {
        kintone.app.record.setFieldShown("カスタム監視", false);
      }

      if (mainItems.indexOf("運用受入") > -1) {
        kintone.app.record.setFieldShown("運用受入", true);
      } else {
        kintone.app.record.setFieldShown("運用受入", false);
      }

      return event;
    }
  );
})();

//アウトプットイメージの表示非表示を切り替える関数
function OutputImage(fieldcode, optionCount) {
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
      `app.record.create.change.${fieldcode}`,
      `app.record.edit.change.${fieldcode}`,
    ],
    (event) => {
      const record = event.record;
      if (
        record[fieldcode].value === "更新あり" ||
        record[fieldcode].value === "新規作成"
      ) {
        kintone.app.record.setFieldShown(`${fieldcode}作成主体`, true);
        if (optionCount === 1)
          record[`${fieldcode}作成主体`].value = "運用構築担当";
      } else {
        kintone.app.record.setFieldShown(`${fieldcode}作成主体`, false);
        record[`${fieldcode}作成主体`].value = "";
      }
      return event;
    }
  );
}

//引数に指定されたシステム1,2,3それぞれの項目クリア、非表示を行う関数
function SystemCountShownFalse(SystemCount, event) {
  const record = event.record;

  kintone.app.record.setFieldShown(`システム名${SystemCount}`, false);
  kintone.app.record.setFieldShown(`インフラ環境${SystemCount}`, false);
  kintone.app.record.setFieldShown(`検証アカウントID${SystemCount}`, false);
  kintone.app.record.setFieldShown(`号口アカウントID${SystemCount}`, false);
  kintone.app.record.setFieldShown(`仕向け${SystemCount}`, false);
  kintone.app.record.setFieldShown(
    `検証環境がない場合理由を記載ください${SystemCount}`,
    false
  );

  kintone.app.record.setFieldShown(`インフラの実装方式${SystemCount}`, false);
  kintone.app.record.setFieldShown(
    `外部からのアクセス方式${SystemCount}`,
    false
  );
  kintone.app.record.setFieldShown(
    `その他の場合はアクセス方式を記載ください${SystemCount}`,
    false
  );
  kintone.app.record.setFieldShown(`監視環境${SystemCount}`, false);
  kintone.app.record.setFieldShown(`監視ツール${SystemCount}`, false);

  kintone.app.record.setFieldShown(
    `その他の場合はツール名を記載ください${SystemCount}`,
    false
  );
  kintone.app.record.setFieldShown(
    `BacklogプロジェクトID${SystemCount}`,
    false
  );
  kintone.app.record.setFieldShown(`EC2${SystemCount}`, false);
  kintone.app.record.setFieldShown(
    `Newrelic_Datadogエージェント導入有無${SystemCount}`,
    false
  );
  kintone.app.record.setFieldShown(`導入担当${SystemCount}`, false);

  kintone.app.record.setFieldShown(`アプリログ${SystemCount}`, false);
  kintone.app.record.setFieldShown(`ECSのログ転送方式${SystemCount}`, false);
  kintone.app.record.setFieldShown(
    `アプリログへの出力形式${SystemCount}`,
    false
  );

  record[`システム名${SystemCount}`].value = "";
  record[`インフラ環境${SystemCount}`].value = "---";
  record[`検証アカウントID${SystemCount}`].value = "";
  record[`号口アカウントID${SystemCount}`].value = "";
  record[`仕向け${SystemCount}`].value = "";
  record[`検証環境がない場合理由を記載ください${SystemCount}`].value = "";

  record[`インフラの実装方式${SystemCount}`].value = "---";
  record[`外部からのアクセス方式${SystemCount}`].value = "---";
  record[`その他の場合はアクセス方式を記載ください${SystemCount}`].value = "";
  record[`監視環境${SystemCount}`].value = "---";
  record[`監視ツール${SystemCount}`].value = "---";

  record[`その他の場合はツール名を記載ください${SystemCount}`].value = "";
  record[`BacklogプロジェクトID${SystemCount}`].value = "";
  record[`EC2${SystemCount}`].value = "---";
  record[`Newrelic_Datadogエージェント導入有無${SystemCount}`].value = "---";
  record[`導入担当${SystemCount}`].value = "---";

  record[`アプリログ${SystemCount}`].value = "---";
  record[`ECSのログ転送方式${SystemCount}`].value = "";
  record[`アプリログへの出力形式${SystemCount}`].value = "---";

  return event;
}

//引数に指定されたシステム1,2,3それぞれの表示を行う関数
function SystemCountShownTrue(SystemCount, event) {
  const record = event.record;

  kintone.app.record.setFieldShown(`システム名${SystemCount}`, true);
  kintone.app.record.setFieldShown(`インフラ環境${SystemCount}`, true);
  kintone.app.record.setFieldShown(`検証アカウントID${SystemCount}`, true);
  kintone.app.record.setFieldShown(`号口アカウントID${SystemCount}`, true);
  kintone.app.record.setFieldShown(`仕向け${SystemCount}`, true);
  kintone.app.record.setFieldShown(
    `検証環境がない場合理由を記載ください${SystemCount}`,
    true
  );

  kintone.app.record.setFieldShown(`インフラの実装方式${SystemCount}`, true);
  kintone.app.record.setFieldShown(
    `外部からのアクセス方式${SystemCount}`,
    true
  );

  kintone.app.record.setFieldShown(`監視環境${SystemCount}`, true);
  kintone.app.record.setFieldShown(`監視ツール${SystemCount}`, true);

  kintone.app.record.setFieldShown(`BacklogプロジェクトID${SystemCount}`, true);
  kintone.app.record.setFieldShown(`EC2${SystemCount}`, true);

  kintone.app.record.setFieldShown(`アプリログ${SystemCount}`, true);

  return event;
}
