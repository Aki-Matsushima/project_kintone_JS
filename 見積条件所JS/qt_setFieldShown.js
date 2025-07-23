//新規追加画面、編集画面を開いたときに非表示にしたいフィールドコード一覧
(function () {
  "use strict";

  kintone.events.on(
    [
      `app.record.create.show`,
      `app.record.edit.show`,
      `app.record.detail.show`,
    ],
    (event) => {
      const record = event.record;

      kintone.app.record.setFieldShown("案件期間隠し", false);
      kintone.app.record.setFieldShown("PM隠し", false);
      kintone.app.record.setFieldShown("PL隠し", false);
      kintone.app.record.setFieldShown("担当者1隠し", false);
      kintone.app.record.setFieldShown("担当者2隠し", false);
      kintone.app.record.setFieldShown("担当者3隠し", false);

      kintone.app.record.setFieldShown(
        "レポトン用_監視単体_テスト設計隠し",
        false
      );
      kintone.app.record.setFieldShown(
        "レポトン用_監視単体_テスト実施隠し",
        false
      );
      kintone.app.record.setFieldShown(
        "レポトン用_監視単体_テスト結果報告書作成隠し",
        false
      );

      kintone.app.record.setFieldShown("レポトン用_運用_テスト設計隠し", false);
      kintone.app.record.setFieldShown("レポトン用_運用_テスト実施隠し", false);
      kintone.app.record.setFieldShown(
        "レポトン用_運用_テスト結果報告書作成隠し",
        false
      );

      kintone.app.record.setFieldShown("レポトン用_配信_テスト設計隠し", false);
      kintone.app.record.setFieldShown("レポトン用_配信_テスト実施隠し", false);
      kintone.app.record.setFieldShown(
        "レポトン用_配信_テスト結果報告書作成隠し",
        false
      );

      //見積費用明細テーブルの項目を非表示
      kintone.app.record.setFieldShown("見積費用明細_大項目", false);
      kintone.app.record.setFieldShown("見積費用明細_削除フラグ", false);
      kintone.app.record.setFieldShown("見積費用明細_ID", false);


      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_新規1隠し", false);
      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_新規2隠し", false);

    }
  );

  testWrite("監視単体");
  testWrite("運用");
  testWrite("配信");
})();

function testWrite(classification) {
  kintone.events.on(
    [
      `app.record.create.change.${classification}テスト`,
      `app.record.edit.change.${classification}テスト`,
    ],
    (event) => {
      const record = event.record;
      if (
        record[`${classification}テスト`].value[0] === `${classification}テスト`
      ) {
        record[`レポトン用_${classification}_テスト設計隠し`].value =
          "・テスト設計";
        record[`レポトン用_${classification}_テスト実施隠し`].value =
          "・テスト実施";
        record[`レポトン用_${classification}_テスト結果報告書作成隠し`].value =
          "・テスト結果報告書作成";
      } else {
        record[`レポトン用_${classification}_テスト設計隠し`].value = "";
        record[`レポトン用_${classification}_テスト実施隠し`].value = "";
        record[`レポトン用_${classification}_テスト結果報告書作成隠し`].value =
          "";
      }
      return event;
    }
  );
}
