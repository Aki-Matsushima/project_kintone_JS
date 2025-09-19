//新規追加画面、編集画面を開いたときに編集不可にしたいフィールドコード一覧

kintone.events.on(
  [
    "app.record.create.change.設計_システム構成図",
    "app.record.edit.change.設計_システム構成図",
    "app.record.create.change.設計_監視申請書",
    "app.record.edit.change.設計_監視申請書",
    "app.record.create.change.設計_メッセージ対処表",
    "app.record.edit.change.設計_メッセージ対処表",
    "app.record.create.change.設計_一次対処手順",
    "app.record.edit.change.設計_一次対処手順",
    "app.record.create.change.設計_インシデント対応フロー",
    "app.record.edit.change.設計_インシデント対応フロー",
    "app.record.create.change.設計_障害ランク表",
    "app.record.edit.change.設計_障害ランク表",
    "app.record.create.change.設計_緊急連絡体制図",
    "app.record.edit.change.設計_緊急連絡体制図",
    "app.record.create.change.設計_サービス正常性確認手順",
    "app.record.edit.change.設計_サービス正常性確認手順"
  ],
  function (event) {
    const record = event.record;

    //リソース運用設計のドキュメントがひとつもない場合、情報提供期限を入力不可(値クリアも行う)
    if (
      record.設計_システム構成図.value.length === 0 &&
      record.設計_監視申請書.value.length === 0 &&
      record.設計_メッセージ対処表.value.length === 0 &&
      record.設計_一次対処手順.value.length === 0
    ) {
      record.リソース運用構築に係る情報提供期限.value = "";
      ShowDisabled(record, "リソース運用構築に係る情報提供期限", true);
    } else {
      ShowDisabled(record, "リソース運用構築に係る情報提供期限", false);
    }

    //インシデント管理設計のドキュメントがひとつもない場合、情報提供期限を入力不可(値クリアも行う)
    if (
      record.設計_インシデント対応フロー.value.length === 0 &&
      record.設計_障害ランク表.value.length === 0 &&
      record.設計_緊急連絡体制図.value.length === 0 &&
      record.設計_サービス正常性確認手順.value.length === 0
    ) {
      record.インシデント管理設計に係る情報提供期限.value = "";
      ShowDisabled(record, "インシデント管理設計に係る情報提供期限", true);
    } else {
      ShowDisabled(record, "インシデント管理設計に係る情報提供期限", false);
    }

    return event;
  }
);

//受け取ったフィールドを編集不可にする関数
function ShowDisabled(record, fieldCode, bool) {
  record[fieldCode].disabled = bool;
}
