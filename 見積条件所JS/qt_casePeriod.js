//案件開始日と検収日から、案件期間が何週間あるかを算出する（見積費用明細の定例会工数算出に利用するため）
(function () {
  "use strict";

  kintone.events.on(
    [
      `app.record.create.change.案件開始日`,
      `app.record.edit.change.案件開始日`,
      `app.record.create.change.検収日`,
      `app.record.edit.change.検収日`,
    ],
    (event) => {
      const record = event.record;
      const startDate = new Date(record.案件開始日.value);
      const endDate = new Date(record.検収日.value);

      if (record.案件開始日.value && record.検収日.value) {
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const weekDiff = Math.floor(dayDiff / 7);
        record.案件期間隠し.value = weekDiff;
      } else {
        record.案件期間隠し.value = 0;
      }

      return event;
    }
  );
})();
