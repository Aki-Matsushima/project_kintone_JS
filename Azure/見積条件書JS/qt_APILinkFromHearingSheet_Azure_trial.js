//ヒアリングシートからAPIで情報を自動転記するボタンの処理
//ヒアリングシートの情報をもとに見積費用明細の工数算出するボタンの処理

(() => {
  "use strict";
  kintone.events.on(
    [
      "app.record.create.show",
      "app.record.edit.show",
    ],
    (event) => {
      const spaceFieldCode = "button";

      if (document.getElementById("api_button")) {
        return event;
      }

      const spaceEl = kintone.app.record.getSpaceElement(spaceFieldCode);
      if (!spaceEl) {
        console.error(`スペースフィールド${spaceFieldCode}が見つかりません`);
      }

      const button = document.createElement("button");
      button.id = "api_button";
      button.textContent = "ヒアリングシートから自動入力";
      button.className = "kintoneplugin-button-normal";

      //ヒアリングシートボタンを押したときの処理
      button.onclick = async function () {
        try {
          const record = kintone.app.record.get().record;

          const APP_ID = 128; //ヒアリングシートアプリのアプリID
          const RECORD_ID = record.ヒアリングシート選択.value;

          const body = {
            app: APP_ID,
            id: RECORD_ID,
          };

          //APIで上記bodyの条件のレコード取得（商談管理番号がユニークなため1件のみ）
          const resp = await kintone.api(
            kintone.api.url("/k/v1/record", true),
            "GET",
            body
          );
          const respRecord = resp.record;

          //設計のチェックボックスにチェックつける
          OutputCheckBox(respRecord, record, "システム構成図");
          OutputCheckBox(respRecord, record, "メッセージ対処表");
          OutputCheckBox(respRecord, record, "一次対処手順");
          OutputCheckBox(respRecord, record, "サービス正常性確認手順");
          OutputCheckBox(respRecord, record, "障害ランク表");
          OutputCheckBox(respRecord, record, "緊急連絡体制図");
          OutputCheckBox(respRecord, record, "インシデント対応フロー");
          let resouCount = 0; //ヒアリングシートの標準監視のリソース数合計を保持する
          //監視申請書のみ、他ドキュメントと条件が違う(標準監視のリソース数が1以上ならチェック)
          for (let i = 0; i < respRecord.Azureリソース.value.length; i++) {
            resouCount +=
              respRecord.Azureリソース.value[i].value.Azureリソース_合計.value;
          }
          if (resouCount > 0) {
            record[`設計_監視申請書`].value[0] = "監視申請書";
          }

          //運用構築基盤消したからいらないはず //運用基盤構築を条件によって記述する処理
          // Infrastructure(respRecord, record, "1");
          // Infrastructure(respRecord, record, "2");
          // Infrastructure(respRecord, record, "3");

          TableTranscription(
            respRecord,
            record,
            "外形監視URL",
            "サービス監視",
            "URL"
          );

          TableTranscription(
            respRecord,
            record,
            "Azureリソース",
            "メトリクス標準監視",
            "Azure"
          );


          TableTranscription(
            respRecord,
            record,
            "カスタム監視",
            "カスタム監視",
            "custom"
          );

          TableTranscription(respRecord, record, "ログ", "ログ監視", "log");

          setBusinessDaysAgo(record, '検収日', 'IRET納品日', 3);

          //障害ランク表が新規作成の場合、お見積り条件に内容を追加する
          if (respRecord.障害ランク表.value === `新規作成`) {
            record[`レポトン用_お見積り条件_制約条件_4隠し`].value =
              "本案件開始時にサービスレベル（シビアリティランク）のご提示をお願いします。";
            record[`レポトン用_お見積り条件_制約条件_5隠し`].value =
              "また本案件にて今後のサービスの展開（STEP1以降）を考慮した運用設計を進めたくSTEP1以降のサービスレベル（シビアリティランク）の変動有無についてもご提示をお願いします。";
          } else {
            record[`レポトン用_お見積り条件_制約条件_4隠し`].value = "";
            record[`レポトン用_お見積り条件_制約条件_5隠し`].value = "";
          }

          kintone.app.record.set({ record });
        } catch (error) {
          console.error(error);
        }
      };
      spaceEl.appendChild(button);

      //見積費用明細工数算出ボタンの設置
      const spaceCalcFieldCode = "calc_button";

      if (document.getElementById("calc_button")) {
        return event;
      }

      const calcSpaceEl =
        kintone.app.record.getSpaceElement(spaceCalcFieldCode);
      if (!calcSpaceEl) {
        console.error(
          `スペースフィールド${spaceCalcFieldCode}が見つかりません`
        );
      }

      const calc_button = document.createElement("calc_button");
      calc_button.id = "calc_button";
      calc_button.textContent = "工数自動算出";
      calc_button.className = "kintoneplugin-button-normal";

      //ボタンを押したときの処理
      calc_button.onclick = async function () {
        // try {
        const record = kintone.app.record.get().record;

        TableDelete(record, "サービス監視");
        TableDelete(record, "メトリクス標準監視");
        TableDelete(record, "カスタム監視");
        TableDelete(record, "ログ監視");

        const APP_ID = 128; //ヒアリングシートアプリのアプリID
        const RECORD_ID = record.ヒアリングシート選択.value;

        const body = {
          app: APP_ID,
          id: RECORD_ID,
        };

        //APIで上記bodyの条件のレコード取得（商談管理番号がユニークなため1件のみ）
        const resp = await kintone.api(
          kintone.api.url("/k/v1/record", true),
          "GET",
          body
        );
        const respRecord = resp.record;

        EstimatedCalc(respRecord, record, "見積費用明細_運用構築");

        ColmunCalc(record, "PM");
        ColmunCalc(record, "PL");
        ColmunCalc(record, "メンバ1");
        ColmunCalc(record, "メンバ2");
        ColmunCalc(record, "メンバ3");
        ColmunCalc(record, "運用受入");
        ColmunCalc(record, "上級SE");
        ColmunCalc(record, "SE");

        kintone.app.record.set({ record });
        // } catch (error) {
        //   console.error(error);
        // }
      };

      calcSpaceEl.appendChild(calc_button);
      return event;
    }
  );
})();


/*------------------------------------------------------
    関数
------------------------------------------------------*/

//ヒアリングシートのアウトプットが有だったら、設計のチェックボックスを入れる関数
function OutputCheckBox(respRecord, record, documentName) {
  if (
    respRecord[documentName].value === "更新あり" ||
    respRecord[documentName].value === "新規作成"
  ) {
    record[`設計_${documentName}`].value[0] = documentName;
  }
}

//ヒアリングシートの監視項目と数量を転記する関数
function TableTranscription(
  respRecord,
  record,
  respTableCode,
  tableCode,
  formBridgeCode
) {
  const temporaryTable = []; //代入用の仮想配列を用意
  record[tableCode].value = [];

  //仮想配列にヒアリングシートのテーブル情報を入れていく
  for (var i = 0; i < respRecord[respTableCode].value.length; i++) {
    if (
      respRecord[respTableCode].value[i].value[`${respTableCode}_合計`]
        .value !== "0"
    ) {
      const subItems =
        respRecord[respTableCode].value[i].value[`${respTableCode}_サービス名`]
          .value;


      temporaryTable.push({
        value: {
          [`${tableCode}_監視対象`]: {
            type: "SINGLE_LINE_TEXT",
            value: subItems,
          },
          [`${tableCode}_号口数量1`]: {
            type: "NUMBER",
            value: Number(
              respRecord[respTableCode].value[i].value[
                `${formBridgeCode}_prod1`
              ].value
            ),
          },
          [`${tableCode}_検証数量1`]: {
            type: "NUMBER",
            value: Number(
              respRecord[respTableCode].value[i].value[
                `${formBridgeCode}_test1`
              ].value
            ),
          },
          [`${tableCode}_号口数量2`]: {
            type: "NUMBER",
            value: Number(
              respRecord[respTableCode].value[i].value[
                `${formBridgeCode}_prod2`
              ].value
            ),
          },
          [`${tableCode}_検証数量2`]: {
            type: "NUMBER",
            value: Number(
              respRecord[respTableCode].value[i].value[
                `${formBridgeCode}_test2`
              ].value
            ),
          },
          [`${tableCode}_号口数量3`]: {
            type: "NUMBER",
            value: Number(
              respRecord[respTableCode].value[i].value[
                `${formBridgeCode}_prod3`
              ].value
            ),
          },
          [`${tableCode}_検証数量3`]: {
            type: "NUMBER",
            value: Number(
              respRecord[respTableCode].value[i].value[
                `${formBridgeCode}_test3`
              ].value
            ),
          },
        },
      });
    }
  }

  //完成した仮想配列を見積条件書へ代入
  record[tableCode].value = temporaryTable;
}

//見積費用明細の計算をする関数
function EstimatedCalc(respRecord, record, tableCode) {
  console.log(record);

  let designCount = 0; //有効な大項目「設計」がいくつあるか
  let designMemberTotal = 0; //メンバー1の大項目「設計」の合計を保持する変数
  let TCTotal = 0; //TC小計を保持する変数（合計テーブル計算前に、管理工数15％を行うため必要）
  DeleteFlag(respRecord, record, tableCode); //入力不要な行に削除フラグを立てる

  for (let i = 0; i < record[tableCode].value.length; i++) {
    //見積工数の算出(テーブル全行をチェックし、項目名が条件に引っかかったときに計算式で工数を入力)
    //削除フラグが1の場合はテーブルをクリアする
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "要件確認"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_PM.value =
          record.PM_有償稼働.value;
        record[tableCode].value[i].value.見積費用明細_PL.value =
          record.PL_有償稼働.value;
        record[tableCode].value[i].value.見積費用明細_メンバ1.value =
          record.メンバ1_有償稼働.value;

        record[tableCode].value[i].value.見積費用明細_メンバ2.value =
          record.メンバ2_有償稼働.value;

        record[tableCode].value[i].value.見積費用明細_メンバ3.value =
          record.メンバ3_有償稼働.value;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "システム構成図・リソース一覧"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);

        if (respRecord.システム構成図.value === "新規作成") {
          record[tableCode].value[i].value.見積費用明細_メンバ1.value =
            1.0 +
            (Number(record.メトリクス標準監視_号口合計.value) +
              Number(record.メトリクス標準監視_検証合計.value)) *
            0.125;
        } else if (respRecord.システム構成図.value === "更新あり") {
          record[tableCode].value[i].value.見積費用明細_メンバ1.value =
            (Number(record.メトリクス標準監視_号口合計.value) +
              Number(record.メトリクス標準監視_検証合計.value)) *
            0.125;
        }
      }
    }

    //監視申請書とメッセージ対処表で使用するためのログ数量を計算する
    let logTotal = 0;
    if (record.ログ監視.value.length !== 0) {
      const logProdNum1 =
        record.ログ監視.value[0].value.ログ監視_号口数量1.value;
      const logProdNum2 =
        record.ログ監視.value[0].value.ログ監視_号口数量2.value;
      const logProdNum3 =
        record.ログ監視.value[0].value.ログ監視_号口数量3.value;
      const logTestNum1 =
        record.ログ監視.value[0].value.ログ監視_検証数量1.value;
      const logTestNum2 =
        record.ログ監視.value[0].value.ログ監視_検証数量2.value;
      const logTestNum3 =
        record.ログ監視.value[0].value.ログ監視_検証数量3.value;
      logTotal =
        Number(logProdNum1) +
        Number(logProdNum2) +
        Number(logProdNum3) +
        Number(logTestNum1) +
        Number(logTestNum2) +
        Number(logTestNum3);
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "監視申請書"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value =
          record.メトリクス標準監視.value.length * 0.5 +
          record.カスタム監視.value.length * 5.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "メッセージ対処表"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);

        record[tableCode].value[i].value.見積費用明細_メンバ1.value =
          1.0 + logTotal * 0.25;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "一次対処手順"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        record[tableCode].value[i].value.見積費用明細_PM.value = "";
        record[tableCode].value[i].value.見積費用明細_PL.value = "";
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = "";
        record[tableCode].value[i].value.見積費用明細_メンバ2.value = "";
        record[tableCode].value[i].value.見積費用明細_メンバ3.value = "";
        record[tableCode].value[i].value.見積費用明細_運用受入.value = "";
        record[tableCode].value[i].value.見積費用明細_上級SE.value = "";
        record[tableCode].value[i].value.見積費用明細_SE.value = "";
      } else {
        Disabled(record, tableCode, i, false);
        if (respRecord.一次対処手順.value === "新規作成") {
          record[tableCode].value[i].value.見積費用明細_メンバ1.value =
            respRecord.運用受入.value[0].value.運用受入_合計.value * 5;
        } else {
          record[tableCode].value[i].value.見積費用明細_メンバ1.value =
            respRecord.運用受入.value[0].value.運用受入_合計.value * 0.5;
        }
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "インシデント対応フロー"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 8.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "障害ランク表"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 8.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "緊急連絡体制図"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 6.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "サービス正常性確認手順"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 8.0;
      }
    }


    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証環境_Web App(AppService、Webjob、API-M含む)"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証環境_APLログ監視(クエリ)"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口環境_Web App(AppService、Webjob、API-M含む)"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口環境_APLログ監視(クエリ)"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証単体_テスト設計"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証単体_テスト実施"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口配信_テスト設計"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口配信_テスト実施"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "CIMS登録"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "課題管理"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "問い合わせ対応"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      }
    }

    //-----------固定値のセット----------------------

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証単体_テスト結果報告書作成"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 1.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用結合_テスト設計"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 5.0;
        record[tableCode].value[i].value.見積費用明細_PL.value = 0.25;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用結合_テスト実施"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 2.0;
        record[tableCode].value[i].value.見積費用明細_運用受入.value = 4.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用結合_テスト結果報告書作成"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 1.0;
        record[tableCode].value[i].value.見積費用明細_PL.value = 0.25;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口配信_テスト結果報告書作成"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 1.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "運用引継ぎ"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 3.0;
        record[tableCode].value[i].value.見積費用明細_PM.value = 1.0;
        record[tableCode].value[i].value.見積費用明細_PL.value = 1.0;

        if (record.運用引継ぎ.value === "回覧") {
          record[tableCode].value[i].value.見積費用明細_運用受入.value = 7.0;
        } else if (record.運用引継ぎ.value === "運用引継ぎ会") {
          record[tableCode].value[i].value.見積費用明細_運用受入.value = 17.0;
        }
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用引継ぎ指摘対応"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 4.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "キックオフ"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_PL.value = 3.0;
      }
    }

    if (record[tableCode].value[i].value.見積費用明細_項目.value === "定例会") {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        const productionCosts =
          respRecord.見積費用明細計算用_定例工数隠し.value *
          record.案件期間隠し.value;
        if (respRecord.参加メンバー.value.includes("PM")) {
          record[tableCode].value[i].value.見積費用明細_PM.value =
            productionCosts;
        }
        if (respRecord.参加メンバー.value.includes("PL")) {
          record[tableCode].value[i].value.見積費用明細_PL.value =
            productionCosts;
        }
        if (respRecord.参加メンバー.value.includes("メンバー")) {
          record[tableCode].value[i].value.見積費用明細_メンバ1.value =
            productionCosts;
        }
      }
    }

    if (record[tableCode].value[i].value.見積費用明細_項目.value === "納品") {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_PL.value = 0.5;
        record[tableCode].value[i].value.見積費用明細_メンバ1.value = 3.0;
        record[tableCode].value[i].value.見積費用明細_メンバ2.value = 3.0;
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "進捗管理"
    ) {
      if (
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "1"
      ) {
        ClearTable(record, tableCode, i);
        Disabled(record, tableCode, i, true);
      } else {
        Disabled(record, tableCode, i, false);
        record[tableCode].value[i].value.見積費用明細_PM.value = 3.0;
      }
    }

    //削除フラグがないものの中で、さらに大項目が「設計」であればdesignCount+1,designMemberTotal+メンバ1の設計工数
    if (
      record[tableCode].value[i].value.見積費用明細_大項目.value === "設計" &&
      record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "0"
    ) {
      record[tableCode].value[i].value.見積費用明細_大項目.value === "設計";

      designCount += 1;
      designMemberTotal += Number(
        record[tableCode].value[i].value.見積費用明細_メンバ1.value
      );
    }
  }

  let Pointflag = false; //切り捨てた小数点を保持する変数
  let decimalPoint = 0;
  for (let i = 0; i < record[tableCode].value.length; i++) {
    if (
      record[tableCode].value[i].value.見積費用明細_大項目.value === "設計" &&
      record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "0"
    ) {
      //メンバ3の設計工数が、合計5になるよう分散して初期値入力
      console.log(decimalPoint);
      console.log(Number(5 / designCount));
      console.log(Math.floor(Number(5 / designCount) * 10) / 10);
      decimalPoint +=
        Number(5 / designCount) - Math.floor(Number(5 / designCount) * 10) / 10;
      console.log("decimalPoint", decimalPoint);

      record[tableCode].value[i].value.見積費用明細_メンバ3.value =
        Math.floor(Number(5 / designCount) * 10) / 10;

      //メンバ1の設計工数が10時間未満なら0.25、以上なら0.5
      if (designMemberTotal < 10) {
        record[tableCode].value[i].value.見積費用明細_PL.value = 0.25;
      } else {
        record[tableCode].value[i].value.見積費用明細_PL.value = 0.5;
      }
    }
  }

  console.log("record[tableCode].value[2].value.見積費用明細_メンバ3.value", record[tableCode].value[2].value.見積費用明細_メンバ3.value);

  record[tableCode].value[2].value.見積費用明細_メンバ3.value += decimalPoint;

  //削除フラグがないもののTC小計を計算(TC小計フィールドを指定すると上手く動作しないため、PM～運用受入を合計する)
  for (let i = 0; i < record[tableCode].value.length; i++) {
    if (
      record[tableCode].value[i].value.見積費用明細_削除フラグ.value === "0"
    ) {
      //PMがNullじゃなければTCTotalにPM工数を足す
      if (record[tableCode].value[i].value.見積費用明細_PM.value) {
        TCTotal += Number(
          record[tableCode].value[i].value.見積費用明細_PM.value
        );
      }
      //PLがNullじゃなければTCTotalにPL工数を足す
      if (record[tableCode].value[i].value.見積費用明細_PL.value) {
        TCTotal += Number(
          record[tableCode].value[i].value.見積費用明細_PL.value
        );
      }
      //メンバ1がNullじゃなければTCTotalにメンバ1工数を足す
      if (record[tableCode].value[i].value.見積費用明細_メンバ1.value) {
        TCTotal += Number(
          record[tableCode].value[i].value.見積費用明細_メンバ1.value
        );
      }
      //メンバ2がNullじゃなければTCTotalにメンバ2工数を足す
      if (record[tableCode].value[i].value.見積費用明細_メンバ2.value) {
        TCTotal += Number(
          record[tableCode].value[i].value.見積費用明細_メンバ2.value
        );
      }
      //メンバ3がNullじゃなければTCTotalにメンバ3工数を足す
      if (record[tableCode].value[i].value.見積費用明細_メンバ3.value) {
        TCTotal += Number(
          record[tableCode].value[i].value.見積費用明細_メンバ3.value
        );
      }
      //運用受入がNullじゃなければTCTotalに運用受入工数を足す
      if (record[tableCode].value[i].value.見積費用明細_運用受入.value) {
        TCTotal += Number(
          record[tableCode].value[i].value.見積費用明細_運用受入.value
        );
      }
    }
  }

  console.log(TCTotal);

  if ((TCTotal * 0.15 - 3) / 6 >= 1) {
    for (let i = 0; i < record[tableCode].value.length; i++) {
      if (
        record[tableCode].value[i].value.見積費用明細_項目.value === "課題管理"
      ) {
        record[tableCode].value[i].value.見積費用明細_PM.value = Math.floor(
          (TCTotal * 0.15 - 3) / 6
        );
        record[tableCode].value[i].value.見積費用明細_PL.value = Math.floor(
          (TCTotal * 0.15 - 3) / 6
        );
      }
      if (
        record[tableCode].value[i].value.見積費用明細_項目.value === "進捗管理"
      ) {
        record[tableCode].value[i].value.見積費用明細_PM.value += Math.floor(
          (TCTotal * 0.15 - 3) / 6
        );
        record[tableCode].value[i].value.見積費用明細_PL.value = Math.floor(
          (TCTotal * 0.15 - 3) / 6
        );
      }
      if (
        record[tableCode].value[i].value.見積費用明細_項目.value ===
        "問い合わせ対応"
      ) {
        record[tableCode].value[i].value.見積費用明細_PM.value = Math.floor(
          (TCTotal * 0.15 - 3) / 6
        );
        record[tableCode].value[i].value.見積費用明細_PL.value = Math.floor(
          (TCTotal * 0.15 - 3) / 6
        );
      }
    }
  }
  //見積費用明細テーブルを小数点第2位まで表示
  for (let i = 0; i < record.見積費用明細_運用構築.value.length; i++) {
    if (record.見積費用明細_運用構築.value[i].value.見積費用明細_PM.value) {
      record.見積費用明細_運用構築.value[i].value.見積費用明細_PM.value =
        Number(
          record.見積費用明細_運用構築.value[i].value.見積費用明細_PM.value
        ).toFixed(2);
    }

    if (record.見積費用明細_運用構築.value[i].value.見積費用明細_PL.value) {
      record.見積費用明細_運用構築.value[i].value.見積費用明細_PL.value =
        Number(
          record.見積費用明細_運用構築.value[i].value.見積費用明細_PL.value
        ).toFixed(2);
    }

    if (
      record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ1.value
    ) {
      record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ1.value =
        Number(
          record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ1.value
        ).toFixed(2);
    }

    if (
      record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ2.value
    ) {
      record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ2.value =
        Number(
          record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ2.value
        ).toFixed(2);
    }

    if (
      record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ3.value
    ) {
      record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ3.value =
        Number(
          record.見積費用明細_運用構築.value[i].value.見積費用明細_メンバ3.value
        ).toFixed(2);
    }

    if (
      record.見積費用明細_運用構築.value[i].value.見積費用明細_運用受入.value
    ) {
      record.見積費用明細_運用構築.value[i].value.見積費用明細_運用受入.value =
        Number(
          record.見積費用明細_運用構築.value[i].value.見積費用明細_運用受入
            .value
        ).toFixed(2);
    }
  }
}




//見積費用明細に削除フラグを立てる
function DeleteFlag(respRecord, record, tableCode) {
  for (let i = 0; i < record[tableCode].value.length; i++) {
    //システム構成図
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "システム構成図・リソース一覧"
    ) {
      if (record.設計_システム構成図.value[0] !== "システム構成図") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }
    //監視申請書
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "監視申請書"
    ) {
      if (record.設計_監視申請書.value[0] !== "監視申請書") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    //メッセージ対処表
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "メッセージ対処表"
    ) {
      if (record.設計_メッセージ対処表.value[0] !== "メッセージ対処表") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    //一次対処手順
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "一次対処手順"
    ) {
      if (record.設計_一次対処手順.value[0] !== "一次対処手順") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    //インシデント対応フロー
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "インシデント対応フロー"
    ) {
      if (
        record.設計_インシデント対応フロー.value[0] !== "インシデント対応フロー"
      ) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    //障害ランク表
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "障害ランク表"
    ) {
      if (record.設計_障害ランク表.value[0] !== "障害ランク表") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    //緊急連絡体制図
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "緊急連絡体制図"
    ) {
      if (record.設計_緊急連絡体制図.value[0] !== "緊急連絡体制図") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    //サービス正常性確認手順
    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "サービス正常性確認手順"
    ) {
      if (
        record.設計_サービス正常性確認手順.value[0] !== "サービス正常性確認手順"
      ) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証環境_Web App(AppService、Webjob、API-M含む)"
    ) {
      if (
        record.検証アカウント1.value === undefined &&
        record.検証アカウント2.value === undefined &&
        record.検証アカウント3.value === undefined
      ) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証環境_APLログ監視(クエリ)"
    ) {
      if (
        record.検証アカウント1.value === undefined &&
        record.検証アカウント2.value === undefined &&
        record.検証アカウント3.value === undefined
      ) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口環境_Web App(AppService、Webjob、API-M含む)"
    ) {
      if (
        record.号口アカウント1.value === undefined &&
        record.号口アカウント2.value === undefined &&
        record.号口アカウント3.value === undefined
      ) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口環境_APLログ監視(クエリ)"
    ) {
      if (
        record.号口アカウント1.value === undefined &&
        record.号口アカウント2.value === undefined &&
        record.号口アカウント3.value === undefined
      ) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証単体_テスト設計"
    ) {
      if (record.監視単体テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証単体_テスト実施"
    ) {
      if (record.監視単体テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "検証単体_テスト結果報告書作成"
    ) {
      if (record.監視単体テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用結合_テスト設計"
    ) {
      if (record.運用テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用結合_テスト実施"
    ) {
      if (record.運用テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用結合_テスト結果報告書作成"
    ) {
      if (record.運用テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口配信_テスト設計"
    ) {
      if (record.配信テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口配信_テスト実施"
    ) {
      if (record.配信テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "号口配信_テスト結果報告書作成"
    ) {
      if (record.配信テスト.value.length === 0) {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "運用引継ぎ"
    ) {
      if (record.運用引継ぎ.value === "無") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "運用引継ぎ指摘対応"
    ) {
      if (record.運用引継ぎ.value === "無") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value ===
      "CIMS登録"
    ) {
      if (record.運用引継ぎ.value === "無") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (
      record[tableCode].value[i].value.見積費用明細_項目.value === "キックオフ"
    ) {
      if (record.キックオフ実施有無.value === "無") {
        Disabled(record, tableCode, i, true);
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }

    if (record[tableCode].value[i].value.見積費用明細_項目.value === "定例会") {
      if (respRecord.週次定例の実施.value === "無") {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "1";
        Disabled(record, tableCode, i, true);
      } else {
        record[tableCode].value[i].value.見積費用明細_削除フラグ.value = "0";
        Disabled(record, tableCode, i, false);
      }
    }
  }
}

//見積費用明細のPMからSEまでをクリアする関数
function ClearTable(record, tableCode, i) {
  record[tableCode].value[i].value.見積費用明細_PM.value = "";
  record[tableCode].value[i].value.見積費用明細_PL.value = "";
  record[tableCode].value[i].value.見積費用明細_メンバ1.value = "";
  record[tableCode].value[i].value.見積費用明細_メンバ2.value = "";
  record[tableCode].value[i].value.見積費用明細_メンバ3.value = "";
  record[tableCode].value[i].value.見積費用明細_運用受入.value = "";
  record[tableCode].value[i].value.見積費用明細_上級SE.value = "";
  record[tableCode].value[i].value.見積費用明細_SE.value = "";
}

function Disabled(record, tableCode, i, boolean) {
  record[tableCode].value[i].value.見積費用明細_PM.disabled = boolean;
  record[tableCode].value[i].value.見積費用明細_PL.disabled = boolean;
  record[tableCode].value[i].value.見積費用明細_メンバ1.disabled = boolean;
  record[tableCode].value[i].value.見積費用明細_メンバ2.disabled = boolean;
  record[tableCode].value[i].value.見積費用明細_メンバ3.disabled = boolean;
  record[tableCode].value[i].value.見積費用明細_運用受入.disabled = boolean;
  //一時的に外注のところだけ入力可能に
  // record[tableCode].value[i].value.見積費用明細_上級SE.disabled = boolean;
  // record[tableCode].value[i].value.見積費用明細_SE.disabled = boolean;
}

//合計テーブルの値計算
function ColmunCalc(record, fieldCode) {
  let calcNum = 0;

  for (let i = 0; i < record.見積費用明細_運用構築.value.length; i++) {
    if (
      record.見積費用明細_運用構築.value[i].value[`見積費用明細_${fieldCode}`]
        .value !== undefined
    ) {
      calcNum += Number(
        record.見積費用明細_運用構築.value[i].value[`見積費用明細_${fieldCode}`]
          .value
      );
    }
  }

  record.合計.value[0].value[`合計_${fieldCode}`].value = calcNum.toFixed(2);

  if (
    fieldCode === "PM" ||
    fieldCode === "PL" ||
    fieldCode === "メンバ1" ||
    fieldCode === "メンバ2" ||
    fieldCode === "メンバ3"
  ) {
    if (record[`${fieldCode}_有償稼働`].value !== undefined) {
      record.合計.value[1].value[`合計_${fieldCode}`].value = (
        calcNum -
        Number(
          record.見積費用明細_運用構築.value[0].value[
            `見積費用明細_${fieldCode}`
          ].value
        )
      ).toFixed(2);
    } else {
      record.合計.value[1].value[`合計_${fieldCode}`].value =
        calcNum.toFixed(2);
    }

    if (record[`${fieldCode}_精査書作成`].value !== undefined) {
      record.合計.value[2].value[`合計_${fieldCode}`].value = (
        calcNum + Number(record[`${fieldCode}_精査書作成`].value)
      ).toFixed(2);
    } else {
      record.合計.value[2].value[`合計_${fieldCode}`].value =
        calcNum.toFixed(2);
    }
  } else {
    record.合計.value[1].value[`合計_${fieldCode}`].value = calcNum.toFixed(2);
    record.合計.value[2].value[`合計_${fieldCode}`].value = calcNum.toFixed(2);
  }
}

//テーブルが空白行で始まっていたら空にする処理
function TableDelete(record, tableCode) {
  if (!record[tableCode].value[0].value[`${tableCode}_監視対象`].value) {
    record[tableCode].value = [];
  }
}


// 指定した日付から〇〇営業日前をフィールドにセットする処理
function setBusinessDaysAgo(record, inputFieldCode, outputFieldCode, businessDaysBefore) {
  const inputValue = record[inputFieldCode].value;

  // 指定した日付が空ならクリア
  if (!inputValue) {
    record[outputFieldCode].value = '';
    return;
  }

  try {
    let date = new Date(inputValue);
    let count = 0;

    //指定した日数分さかのぼる
    while (count < businessDaysBefore) {
      date.setDate(date.getDate() - 1);

      const day = date.getDay();
      const isWeekend = (day === 0 || day === 6);
      const isHoliday = holiday_jp.isHoliday(date);

      if (!isWeekend && !isHoliday) {
        count++;
      }
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const result = `${yyyy}-${mm}-${dd}`;

    record[outputFieldCode].value = result;
    console.log(`${outputFieldCode} に ${result} をセットしました`);
  } catch (error) {
    console.error('営業日計算中にエラーが発生:', error);
    record[outputFieldCode].value = 'エラー';
  }
}