//担当者への依頼が実行されていない場合、アラートを出す

(function () {
    'use strict';

    kintone.events.on('app.record.detail.show', async function (event) {
        const record = event.record;
        const currentStatus = record.ステータス?.value;
        const repPerson = record.見積担当者?.value || [];

        // 条件に一致したらアラート
        if (currentStatus === "案件受付対応中" && repPerson !== "") {
            alert("「担当者へ依頼」ボタンから、依頼を実行してください。");
        }

        return event;
    });
})();
