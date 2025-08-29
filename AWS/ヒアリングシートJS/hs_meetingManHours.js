//案件開始日と検収日から、案件期間が何週間あるかを算出する（見積費用明細の定例会工数算出に利用するため）
(function () {
  "use strict";

  kintone.events.on(
    [
      `app.record.create.show`,
      `app.record.edit.show`,
      `app.record.detail.show`,
      `app.record.create.change.定例の頻度`,
      `app.record.edit.change.定例の頻度`,
      `app.record.create.change.所要時間`,
      `app.record.edit.change.所要時間`,
    ],
    (event) => {
      const record = event.record;
      const meetingFrequency = record.定例の頻度.value;
      const meetingTime = record.所要時間.value;

      let numMeetingFrequency = 0;
      let numMeetingTime = 0;

      switch (meetingFrequency) {
        case "週1回":
          numMeetingFrequency = 1;
          break;
        case "週2回":
          numMeetingFrequency = 2;
          break;
        case "週3回":
          numMeetingFrequency = 3;
          break;
        case "週4回":
          numMeetingFrequency = 4;
          break;
        case "週5回":
          numMeetingFrequency = 5;
          break;
      }

      switch (meetingTime) {
        case "15分":
          numMeetingTime = 0.25;
          break;
        case "30分":
          numMeetingTime = 0.5;
          break;
        case "45分":
          numMeetingTime = 0.75;
          break;
        case "60分":
          numMeetingTime = 1;
          break;
      }

      record.見積費用明細計算用_定例工数隠し.value =
        numMeetingFrequency * numMeetingTime;

      return event;
    }
  );
})();
