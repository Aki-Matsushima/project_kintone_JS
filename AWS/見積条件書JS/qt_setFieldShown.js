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

      kintone.app.record.setFieldShown("ヒアリングシートステータス隠し", false);
      kintone.app.record.setFieldShown("案件期間隠し", false);
      kintone.app.record.setFieldShown("PM隠し", false);
      kintone.app.record.setFieldShown("PL隠し", false);
      kintone.app.record.setFieldShown("担当者1隠し", false);
      kintone.app.record.setFieldShown("担当者2隠し", false);
      kintone.app.record.setFieldShown("担当者3隠し", false);

      kintone.app.record.setFieldShown("レポトン用_監視単体_テスト設計隠し", false);
      kintone.app.record.setFieldShown("レポトン用_監視単体_テスト実施隠し", false);
      kintone.app.record.setFieldShown("レポトン用_監視単体_テスト結果報告書作成隠し", false);

      kintone.app.record.setFieldShown("レポトン用_運用_テスト設計隠し", false);
      kintone.app.record.setFieldShown("レポトン用_運用_テスト実施隠し", false);
      kintone.app.record.setFieldShown("レポトン用_運用_テスト結果報告書作成隠し", false);

      kintone.app.record.setFieldShown("レポトン用_配信_テスト設計隠し", false);
      kintone.app.record.setFieldShown("レポトン用_配信_テスト実施隠し", false);
      kintone.app.record.setFieldShown("レポトン用_配信_テスト結果報告書作成隠し", false);

      //見積費用明細テーブルの項目を非表示
      // kintone.app.record.setFieldShown("見積費用明細_大項目", false);
      // kintone.app.record.setFieldShown("見積費用明細_削除フラグ", false);
      // kintone.app.record.setFieldShown("見積費用明細_ID", false);


      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_1隠し", false);
      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_2隠し", false);
      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_3隠し", false);
      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_4隠し", false);
      kintone.app.record.setFieldShown("レポトン用_お見積り条件_制約条件_5隠し", false);

    }
  );
})();
