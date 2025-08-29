//合計テーブルの計算をする処理
(function () {
  "use strict";
  ChangeColmunCalc("PM");
  ChangeColmunCalc("PL");
  ChangeColmunCalc("メンバ1");
  ChangeColmunCalc("メンバ2");
  ChangeColmunCalc("メンバ3");
  ChangeColmunCalc("運用受入");
  ChangeColmunCalc("上級SE");
  ChangeColmunCalc("SE");
})();

//合計テーブルの計算をする関数
function ChangeColmunCalc(fieldCode) {
  kintone.events.on(
    [
      `app.record.create.change.見積費用明細_${fieldCode}`,
      `app.record.edit.change.見積費用明細_${fieldCode}`,
    ],
    (event) => {
      const record = event.record;

      let calcNum = 0;

      for (let i = 0; i < record.見積費用明細_運用構築.value.length; i++) {
        if (
          record.見積費用明細_運用構築.value[i].value[
            `見積費用明細_${fieldCode}`
          ].value !== undefined
        ) {
          calcNum += Number(
            record.見積費用明細_運用構築.value[i].value[
              `見積費用明細_${fieldCode}`
            ].value
          );
        }
      }

      record.合計.value[0].value[`合計_${fieldCode}`].value = calcNum;

      if (
        fieldCode === "PM" ||
        fieldCode === "PL" ||
        fieldCode === "メンバ1" ||
        fieldCode === "メンバ2" ||
        fieldCode === "メンバ3"
      ) {
        if (record[`${fieldCode}_有償稼働`].value !== undefined) {
          record.合計.value[1].value[`合計_${fieldCode}`].value =
            calcNum -
            Number(
              record.見積費用明細_運用構築.value[0].value[
                `見積費用明細_${fieldCode}`
              ].value
            );
        } else {
          record.合計.value[1].value[`合計_${fieldCode}`].value = calcNum;
        }

        if (record[`${fieldCode}_精査書作成`].value !== undefined) {
          record.合計.value[2].value[`合計_${fieldCode}`].value =
            calcNum + Number(record[`${fieldCode}_精査書作成`].value);
        } else {
          record.合計.value[2].value[`合計_${fieldCode}`].value = calcNum;
        }
      } else {
        record.合計.value[1].value[`合計_${fieldCode}`].value = calcNum;
        record.合計.value[2].value[`合計_${fieldCode}`].value = calcNum;
      }

      return event;
    }
  );
}
