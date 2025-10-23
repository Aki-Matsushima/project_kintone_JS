//ユーザー選択フィールドで選択されたユーザーの名字を隠しフィールドに格納する処理
//ユーザー選択フィールドで1人目のみ選択できるようにする処理

(function () {
  'use strict';

  const userFields = [
    "PM",
    "PL",
    "担当者1",
    "担当者2",
    "担当者3",
  ];


  //ユーザー選択フィールドで選択されたユーザーの名字を隠しフィールドに格納
  kintone.events.on(["app.record.create.submit", "app.record.edit.submit"], async function (event) {
    const record = event.record;
    for (const fieldCode of userFields) {
      const userValue = record[fieldCode].value;

      const hiddenFieldCode = fieldCode + "隠し";
      if (!userValue || userValue.length === 0) {
        record[hiddenFieldCode].value = 'TBD';
        continue;
      }

      const userCode = userValue[0].code;

      try {
        const resp = await kintone.api(
          kintone.api.url("/v1/users.json", true),
          "GET",
          {}
        );

        const matchedUser = resp.users.find(user => user.code === userCode);

        if (matchedUser) {
          const surName = matchedUser.surName;
          if (record[hiddenFieldCode]) {
            record[hiddenFieldCode].value = surName;
          }
        }
      } catch (error) {
        console.error("ユーザー取得エラー:", error);
      }
    }

    return event;
  });


  //ユーザー選択フィールドで1人目のみ選択できるように設定
  const events = [];
  userFields.forEach(function (fieldCode) {
    events.push(`app.record.create.change.${fieldCode}`);
    events.push(`app.record.edit.change.${fieldCode}`);
  });

  kintone.events.on(events, function (event) {
    const record = event.record;

    // fieldCode をイベント名から抽出
    const fieldCode = event.type.replace(/^app\.record\.(create|edit)\.change\./, '');

    const selected = record[fieldCode].value;
    if (selected.length > 1) {
      record[fieldCode].value = [selected[0]];
      alert(`${fieldCode} は1人のみ設定してください。\n既に登録されたユーザーまたは1人目のユーザーが設定が選択されます。`);
    }

    return event;
  });


})();