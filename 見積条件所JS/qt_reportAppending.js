//新規追加画面、編集画面を開いたとき
(function () {
    "use strict";

    kintone.events.on(
        [
            `app.record.create.submit`,
            `app.record.edit.submit`,
        ],
        (event) => {
            const record = event.record;

            //障害ランク表がを作成する場合、お見積り条件に内容を追加する
            if (record.設計_障害ランク表.value === `障害ランク表`) {
                record[`レポトン用_お見積り条件_制約条件_1隠し`].value =
                    "障害ランク表を作成するにあたり、障害ランク対象機能、シビアリティランク等の情報提供をお願いします。";
            } else {
                record[`レポトン用_お見積り条件_制約条件_1隠し`].value = "";
            }

            //緊急連絡体制図またはインシデント対応フローの作成がある場合、お見積り条件に内容を追加する
            if (record.設計_緊急連絡体制図.value === `緊急連絡体制図` ||
                record.設計_インシデント対応フロー.value === `インシデント対応フロー`) {
                record[`レポトン用_お見積り条件_制約条件_2隠し`].value =
                    "緊急連絡体制図やインシデント対応フローを作成するにあたり、運用維持体制に関わる方の役割や連絡先等の情報提供をお願いします。";
            } else {
                record[`レポトン用_お見積り条件_制約条件_2隠し`].value = "";
            }

            //インシデント対応フローの作成がある場合、お見積り条件に内容を追加する
            if (record.設計_インシデント対応フロー.value === `インシデント対応フロー`) {
                record[`レポトン用_お見積り条件_制約条件_3隠し`].value =
                    "インシデント対応フローは標準に準拠して、作成します。";
            } else {
                record[`レポトン用_お見積り条件_制約条件_3隠し`].value = "";
            }

            //障害ランク表が新規作成の場合、お見積り条件に内容を追加する
            //「レポトン用_お見積り条件_制約条件_4隠し」「レポトン用_お見積り条件_制約条件_5隠し」は
            // ヒアリングシートの参照が必要なためボタン押下時の処理に記載

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
                record[`レポトン用_${classification}_テスト設計隠し`].value = "・テスト設計";
                record[`レポトン用_${classification}_テスト実施隠し`].value = "・テスト実施";
                record[`レポトン用_${classification}_テスト結果報告書作成隠し`].value = "・テスト結果報告書作成";
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
