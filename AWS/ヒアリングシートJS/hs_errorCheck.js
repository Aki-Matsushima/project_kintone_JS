// エラーチェック

(function () {
    "use strict";

    //作成する見積で選択した値が見積有無で選択されていなかった場合エラー
    kintone.events.on('app.record.edit.submit', function (event) {
        const record = event.record;

        const checkbox = record.見積有無.value;
        const radio = record.作成する見積.value;

        if (!checkbox.includes(radio)) {
            event.error = `${radio}は、見積有無で選択されていません。`;
        }

        return event;
    });
})();