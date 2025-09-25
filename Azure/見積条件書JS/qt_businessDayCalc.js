// 営業日の計算
// IRET納品日に検収日の3日前を格納

(function () {
    'use strict';

    const config = {
        inputDateFC: '検収日',            // 検収日（入力 or ルックアップコピー先）
        outputDateFC: 'IRET納品日',       // 出力するフィールド
        lookupTriggerFC: 'ヒアリングシート選択', // ルックアップフィールド
        businessDaysBefore: 3               // 何営業日前にするか（数値）
    };

    // ルックアップ取得後（トリガーフィールド）に待ってから処理
    kintone.events.on([
        'app.record.create.change.' + config.lookupTriggerFC,
        'app.record.edit.change.' + config.lookupTriggerFC
    ], (event) => {
        const record = event.record;


        setTimeout(() => {
            setBusinessDaysAgo(record);
            console.log(`${config.outputDateFC} 計算後:`, record[config.outputDateFC].value);
        }, 100); // コピー完了を少し待つ

        return event;
    });

    // 日付を YYYY-MM-DD 文字列に変換
    const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = (`0${date.getMonth() + 1}`).slice(-2);
        const dd = (`0${date.getDate()}`).slice(-2);
        return `${yyyy}-${mm}-${dd}`;
    };

    // 営業日数分さかのぼった日を計算（土日＋祝日除外）
    const calcBusinessDaysBefore = (inputDateStr, daysBefore) => {
        const date = new Date(inputDateStr);
        let count = 0;

        while (count < daysBefore) {
            date.setDate(date.getDate() - 1);
            const day = date.getDay();
            const isWeekend = (day === 0 || day === 6);
            const isHoliday = holiday_jp.isHoliday(date);

            if (!isWeekend && !isHoliday) {
                count++;
            }
        }

        return formatDate(date);
    };

    // 営業日前をフィールドにセット
    const setBusinessDaysAgo = (record) => {
        const inputDate = record[config.inputDateFC].value;
        console.log("inputDate", inputDate);

        if (!inputDate) {
            record[config.outputDateFC].value = '';
            return;
        }

        try {
            const result = calcBusinessDaysBefore(inputDate, config.businessDaysBefore);
            record[config.outputDateFC].value = result;
        } catch (e) {
            console.error('営業日計算エラー:', e);
            record[config.outputDateFC].value = 'エラー';
        }
    };

})();
