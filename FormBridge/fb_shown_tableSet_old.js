/*------------------------------------------------------
    フォームブリッジ　JSカスタマイズ
    作成日：2025/05/09
    更新日：2025/05/12
========================================================
主な処理内容
・選択フィールドの選択による表示非表示
 （ラジオボタン、チェックボックス、ドロップダウン、複数選択）
・日付フィールドの比較による表示非表示
・入力された値による表示非表示
 （文字列1行、数値）
・テーブルへの初期値の設定

注意事項
・ステップをまたいだ表示設定不可
・表示非表示を切り替えるタイミングで値もリセットされる
 複数選択とチェックボックスはチェックを付けるたびに値がリセットされるため注意
 テーブル内フィールドは表示非表示のタイミングで値はリセットされない
・フォームブリッジ上でテーブルの行数制限の最小を設定する必要あり


------------------------------------------------------*/

// 初期状態で非表示にするフィールド
const allHiddenFields = [
  "超概算見積提出期日",
  "概算見積提出期日",
  "正式見積提出期日",
  "号口日が検収日より前に設定されています理由を記載ください",
  "セキュリティチェック完了予定日",
  "TC営業運用部署名",
  "TC営業_運用主担当者",
  "TC営業_運用副担当者1",
  "TC営業_運用副担当者2",
  "定例の頻度",
  "所要時間",
  "参加メンバー",
  "報告の仕方",
  "アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください",
  "システム構成図作成主体",
  "メッセージ対処表作成主体",
  "一次対処手順作成主体",
  "サービス正常性確認手順作成主体",
  "障害ランク表作成主体",
  "緊急連絡体制図作成主体",
  "クラウドメンテナンス設計作成主体",
  "インシデント対応フロー作成主体",
  "運用設計書作成主体",
  "AWSリソース",
  "外形監視URL",
  "ログ",
  "オプション監視",
  "カスタム監視",
  "運用受入",
];

//
const hearingItems = [
  "EC2(Linux)",
  "EC2(Windows)",
  "ECS(Fargate)",
  "ECS(EC2)",
  "ELB(CLB)",
  "ELB(ALB)",
  "ELB(NLB)",
  "RDS",
  "RDS(Aurora)",
  "DynamoDB",
  "Lambda",
  "API Gateway",
  "Kinesis Data Streams",
  "Kinesis Data Firehose",
  "ElastiCache",
  "EFS",
  "CloudFront",
  "Elastic Beanstalk",
  "Redshift",
  "S3",
  "SES",
  "SNS",
  "SQS",
  "SQS（DLQ)",
  "EMR",
  "StepFunction",
  "AWS Backup",
  "EventBridge(Rules)",
  "EventBridge(Scheduler)",
];

const hearingUnit = [
  "インスタンス",
  "インスタンス",
  "サービス",
  "サービス",
  "ターゲットグループ",
  "ターゲットグループ",
  "ターゲットグループ",
  "インスタンス",
  "インスタンス",
  "テーブル",
  "関数",
  "ゲートウェイ",
  "データストリーム",
  "S3, OpenSearch, RedShift",
  "ホスト",
  "ファイルシステム",
  "ディストリビューション",
  "アプリケーション",
  "クラスタ",
  "バケット",
  "SESで送信されるメール",
  "SNSトピック",
  "SQSキュー",
  "SQSキュー",
  "EMRクラスタ",
  "Step Functionsステートマシン",
  "バックアップジョブ",
  "ルールネーム",
  "スケジュールグループ",
];

const hearingCount = [
  10, 8, 3, 3, 2, 2, 1, 3, 2, 4, 3, 4, 5, 1, 3, 2, 3, 1, 4, 2, 2, 1, 1, 1, 2, 2,
  1, 2, 2,
];

// 表示済みフィールドコードを保持するセット
let shownFields = new Set();

/*------------------------------------------------------
    フォーム表示
------------------------------------------------------*/
formBridge.events.on("form.show", function (context) {
  // 描画待ち
  setTimeout(() => {
    /*----フォーム表示時にフィールドを非表示にする---------*/
    const toHide = allHiddenFields.filter((fieldCode) => {
      return !shownFields.has(fieldCode);
    });

    if (shownFields === "") {
      formShowHiddenFields(allHiddenFields);
    } else {
      formShowHiddenFields(toHide);
    }
    /*----フォーム表示時にフィールドを非表示にする---------*/

    //AWSリソーステーブルに初期値を設定
    formShowTableInitialValues(context, {
      tableCode: "AWSリソース",
      fieldCode: "AWSリソース_サービス名",
      initValues: hearingItems,
    });
    formShowTableInitialValues(context, {
      tableCode: "AWSリソース",
      fieldCode: "AWSリソース_単位",
      initValues: hearingUnit,
    });
    formShowTableInitialValues(context, {
      tableCode: "AWSリソース",
      fieldCode: "AWSリソース_監視項目数",
      initValues: hearingCount,
    });
    //外形監視監視テーブルに初期値を設定
    formShowTableInitialValues(context, {
      tableCode: "外形監視URL",
      fieldCode: "外形監視URL_サービス名",
      initValues: ["URL"],
    });
    formShowTableInitialValues(context, {
      tableCode: "外形監視URL",
      fieldCode: "外形監視URL_単位",
      initValues: ["URL"],
    });
    formShowTableInitialValues(context, {
      tableCode: "外形監視URL",
      fieldCode: "外形監視URL_監視項目数",
      initValues: [1],
    });
    //ログテーブルに初期値を設定
    formShowTableInitialValues(context, {
      tableCode: "ログ",
      fieldCode: "ログ_サービス名",
      initValues: ["ロググループ", "ログ"],
    });
    formShowTableInitialValues(context, {
      tableCode: "ログ",
      fieldCode: "ログ_単位",
      initValues: ["ロググループ", "ログ"],
    });
    formShowTableInitialValues(context, {
      tableCode: "ログ",
      fieldCode: "ログ_監視項目数",
      initValues: [1, 1],
    });

    //オプション監視テーブルに初期値を設定
    formShowTableInitialValues(context, {
      tableCode: "オプション監視",
      fieldCode: "オプション監視_サービス名",
      initValues: hearingItems,
    });

    //運用受入テーブルに初期値を設定
    formShowTableInitialValues(context, {
      tableCode: "運用受入",
      fieldCode: "運用受入_中項目",
      initValues: ["一次対処手順数", "保守作業手順数"],
    });
    formShowTableInitialValues(context, {
      tableCode: "運用受入",
      fieldCode: "運用受入_小項目",
      initValues: ["手順数", "手順数"],
    });
  }, 50);

  return context;
});

/*------------------------------------------------------
    チェックボックス変更時まとめ
------------------------------------------------------*/

//見積有無
const estimate = {
  fieldMap: {
    超概算見積: ["超概算見積提出期日"],
    概算見積: ["概算見積提出期日"],
    正式見積: ["正式見積提出期日"],
  },
};
formBridge.events.on(
  "form.field.change.見積有無",
  conditionFieldDisplaySetup(estimate)
);

//見積算出のテーブル
const table = {
  fieldMap: {
    "監視対象（インフラ）": ["AWSリソース"],
    "外形監視（URL）": ["外形監視URL"],
    "監視対象（アプリ）": ["ログ"],
    オプション監視: ["オプション監視"],
    カスタム監視: ["カスタム監視"],
    運用受入: ["運用受入"],
  },
};
formBridge.events.on(
  "form.field.change.大項目選択",
  conditionFieldDisplaySetup(table)
);

/*------------------------------------------------------
    ラジオボタン変更時まとめ
------------------------------------------------------*/

//セキュリティチェック
const securityCheck = {
  fieldMap: {
    済: ["セキュリティチェックURL"],
    未: ["セキュリティチェック完了予定日"],
  },
};
formBridge.events.on(
  "form.field.change.セキュリティチェック",
  conditionFieldDisplaySetup(securityCheck)
);

// const systemNum = {
//   fieldMap: {
//     1: [
//       "システム名1",
//       "インフラ環境1",
//       "検証アカウントID1",
//       "号口アカウントID1",
//       "仕向け1",
//       "検証環境がない場合理由を記載ください1",
//       "インフラの実装方式1",
//       "外部からのアクセス方式1",
//       "その他の場合はアクセス方式を記載ください1",
//       "監視環境1",
//       "監視ツール1",
//       "その他の場合はツール名を記載ください1",
//       "BacklogプロジェクトID1",
//       "EC21",
//       "Newrelic_Datadogエージェント導入有無1",
//       "導入担当1",
//       "アプリログ1",
//       "ECSのログ転送方式1",
//       "アプリログへの出力形式1",
//     ],
//     2: [
//       "システム名1",
//       "インフラ環境1",
//       "検証アカウントID1",
//       "号口アカウントID1",
//       "仕向け1",
//       "検証環境がない場合理由を記載ください1",
//       "インフラの実装方式1",
//       "外部からのアクセス方式1",
//       "その他の場合はアクセス方式を記載ください1",
//       "監視環境1",
//       "監視ツール1",
//       "その他の場合はツール名を記載ください1",
//       "BacklogプロジェクトID1",
//       "EC21",
//       "Newrelic_Datadogエージェント導入有無1",
//       "導入担当1",
//       "アプリログ1",
//       "ECSのログ転送方式1",
//       "アプリログへの出力形式1",
//       "システム名2",
//       "インフラ環境2",
//       "検証アカウントID2",
//       "号口アカウントID2",
//       "仕向け2",
//       "検証環境がない場合理由を記載ください2",
//       "インフラの実装方式2",
//       "外部からのアクセス方式2",
//       "その他の場合はアクセス方式を記載ください2",
//       "監視環境2",
//       "監視ツール2",
//       "その他の場合はツール名を記載ください2",
//       "BacklogプロジェクトID2",
//       "EC22",
//       "Newrelic_Datadogエージェント導入有無2",
//       "導入担当2",
//       "アプリログ2",
//       "ECSのログ転送方式2",
//       "アプリログへの出力形式2",
//     ],
//     3: [
//       "システム名1",
//       "インフラ環境1",
//       "検証アカウントID1",
//       "号口アカウントID1",
//       "仕向け1",
//       "検証環境がない場合理由を記載ください1",
//       "インフラの実装方式1",
//       "外部からのアクセス方式1",
//       "その他の場合はアクセス方式を記載ください1",
//       "監視環境1",
//       "監視ツール1",
//       "その他の場合はツール名を記載ください1",
//       "BacklogプロジェクトID1",
//       "EC21",
//       "Newrelic_Datadogエージェント導入有無1",
//       "導入担当1",
//       "アプリログ1",
//       "ECSのログ転送方式1",
//       "アプリログへの出力形式1",
//       "システム名2",
//       "インフラ環境2",
//       "検証アカウントID2",
//       "号口アカウントID2",
//       "仕向け2",
//       "検証環境がない場合理由を記載ください2",
//       "インフラの実装方式2",
//       "外部からのアクセス方式2",
//       "その他の場合はアクセス方式を記載ください2",
//       "監視環境2",
//       "監視ツール2",
//       "その他の場合はツール名を記載ください2",
//       "BacklogプロジェクトID2",
//       "EC22",
//       "Newrelic_Datadogエージェント導入有無2",
//       "導入担当2",
//       "アプリログ2",
//       "ECSのログ転送方式2",
//       "アプリログへの出力形式2",
//       "システム名3",
//       "インフラ環境3",
//       "検証アカウントID3",
//       "号口アカウントID3",
//       "仕向け3",
//       "検証環境がない場合理由を記載ください3",
//       "インフラの実装方式3",
//       "外部からのアクセス方式3",
//       "その他の場合はアクセス方式を記載ください3",
//       "監視環境3",
//       "監視ツール3",
//       "その他の場合はツール名を記載ください3",
//       "BacklogプロジェクトID3",
//       "EC23",
//       "Newrelic_Datadogエージェント導入有無3",
//       "導入担当3",
//       "アプリログ3",
//       "ECSのログ転送方式3",
//       "アプリログへの出力形式3",
//     ],
//   },
// };
// formBridge.events.on(
//   "form.field.change.システム数",
//   conditionFieldDisplaySetup(systemNum)
// );

//開発フェーズと運用フェーズの担当者は別か
const choosePerson = {
  fieldMap: {
    同じ: [],
    別々: [
      "TC営業運用部署名",
      "TC営業_運用主担当者",
      "TC営業_運用副担当者1",
      "TC営業_運用副担当者2",
    ],
  },
};
formBridge.events.on(
  "form.field.change.開発フェーズと運用フェーズの担当者は別か",
  conditionFieldDisplaySetup(choosePerson)
);

//週次定例の実施
const meeting = {
  fieldMap: {
    有: ["定例の頻度", "所要時間", "参加メンバー"],
    無: [],
    相談したい: [],
  },
};
formBridge.events.on(
  "form.field.change.週次定例の実施",
  conditionFieldDisplaySetup(meeting)
);

//週次定例の実施
const briefing = {
  fieldMap: {
    有: ["報告の仕方"],
    無: [],
    相談したい: [],
  },
};
formBridge.events.on(
  "form.field.change.週次進捗報告会の実施",
  conditionFieldDisplaySetup(briefing)
);

/*------------------------------------------------------
    日付の条件でフィールドを表示する
------------------------------------------------------*/
const rules = [
  {
    label: "AとBが同日",
    fields: ["号口日_サービスイン", "号口環境_インフラリソース構築日"],
    showField:
      "アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください",
    condition: (a, b) => a.getTime() === b.getTime(),
  },
  {
    label: "AとBが同日",
    fields: ["号口日_サービスイン", "号口環境_アプリデプロイ日"],
    showField:
      "アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください",
    condition: (a, b) => a.getTime() === b.getTime(),
  },
  {
    label: "AよりBのほうが大きい",
    fields: ["号口日", "検収日"],
    showField: "号口日が検収日より前に設定されています理由を記載ください",
    condition: (a, b) => a < b,
  },
];

formBridge.events.on("form.field.change.検収日", DateFieldChange(rules));
formBridge.events.on("form.field.change.号口日", DateFieldChange(rules));
formBridge.events.on(
  "form.field.change.号口日_サービスイン",
  DateFieldChange(rules)
);

formBridge.events.on(
  "form.field.change.号口環境_アプリデプロイ日",
  DateFieldChange(rules)
);

formBridge.events.on(
  "form.field.change.号口環境_インフラリソース構築日",
  DateFieldChange(rules)
);

/*------------------------------------------------------
    ドロップダウン変更時まとめ
------------------------------------------------------*/
//作成主体関連
const documentArray = [
  "システム構成図",
  "メッセージ対処表",
  "一次対処手順",
  "サービス正常性確認手順",
  "障害ランク表",
  "緊急連絡体制図",
  "クラウドメンテナンス設計",
  "インシデント対応フロー",
  "運用設計書",
];

for (let i = 0; i < documentArray.length; i++) {
  const documentDrop = {
    fieldMap: {
      新規作成: [`${documentArray[i]}作成主体`],
      更新あり: [`${documentArray[i]}作成主体`],
      更新あり: [`${documentArray[i]}作成主体`],
      "更新なし（資料あり）": [],
      "更新なし（資料なし）": [],
      相談したい: [],
    },
  };
  formBridge.events.on(
    `form.field.change.${documentArray[i]}`,
    conditionFieldDisplaySetup(documentDrop)
  );
}

/*------------------------------------------------------
    関数
------------------------------------------------------*/

/*----フォーム表示時にフィールドを非表示にする---------*/
function formShowHiddenFields(fieldCodes) {
  fieldCodes.forEach((fieldCode) => {
    // フィールドコードに対応する要素を取得
    const fieldElem = document.querySelector(
      `[data-field-code="${fieldCode}"]`
    );
    if (!fieldElem) return;

    const parentDiv = fieldElem.closest(".w-full");
    if (parentDiv) parentDiv.classList.add("hidden");
  });
}

/*----テーブルに初期値を設定--------------------------*/
function formShowTableInitialValues(
  context,
  { tableCode, fieldCode, initValues }
) {
  initValues.forEach((value, index) => {
    context.setSubtableFieldValue(tableCode, fieldCode, index, value);
  });
}

/*----選択フィールド変更時の表示非表示----------------*/
function conditionFieldDisplaySetup({ fieldMap }) {
  return function (context) {
    const value = context.value || [];

    // valueが配列でない場合（ラジオやドロップダウン）、配列化
    const values = Array.isArray(value) ? value : [value];

    // すべての対象フィールドを取得（重複除去）
    const allFields = [...new Set(Object.values(fieldMap).flat())];

    // 全フィールドを非表示＆値をクリア
    allFields.forEach((fieldCode) => {
      // フィールドコードに対応する要素を取得
      const fieldElem = document.querySelector(
        `[data-field-code="${fieldCode}"]`
      );
      if (!fieldElem) return;

      // 対応するフィールドのタイプを取得
      const fieldWrapper = fieldElem.closest("[data-field-type]");
      const fieldType = fieldWrapper?.getAttribute("data-field-type");

      const parentDiv = fieldElem.closest(".w-full");
      if (parentDiv) parentDiv.classList.add("hidden");

      // サブテーブル以外のみ値をクリア
      if (fieldType !== "SUBTABLE") {
        context.setFieldValue(fieldCode, "");
      }
      shownFields.delete(fieldCode);
    });

    // 選択値に対応するフィールドを表示
    const showFields = [
      ...new Set(values.flatMap((val) => fieldMap[val] || [])),
    ];

    showFields.forEach((fieldCode) => {
      // フィールドコードに対応する要素を取得
      const fieldElem = document.querySelector(
        `[data-field-code="${fieldCode}"]`
      );
      if (!fieldElem) return;

      const parentDiv = fieldElem.closest(".w-full");
      if (parentDiv) parentDiv.classList.remove("hidden");

      shownFields.add(fieldCode);
    });
  };
}

/*----フィールド変更時の表示非表示----------------*/
function ValueFieldChange(rules) {
  return function (context) {
    setTimeout(() => {
      const record = context.getRecord();

      rules.forEach((rule) => {
        const values = rule.fields.map((code) => record[code]?.value ?? null);
        const show = rule.condition(...values); // 条件を満たすか判定

        (rule.showFields || []).forEach((showFieldCode) => {
          const fieldElem = document.querySelector(
            `[data-field-code="${showFieldCode}"]`
          );
          if (!fieldElem) return;

          const fieldWrapper = fieldElem.closest("[data-field-type]");
          const fieldType = fieldWrapper?.getAttribute("data-field-type");

          const parentDiv = fieldElem.closest(".w-full");
          if (parentDiv) parentDiv.classList.add("hidden");

          // サブテーブル以外のみ値をクリア
          if (fieldType !== "SUBTABLE") {
            context.setFieldValue(showFieldCode, "");
          }
          shownFields.delete(showFieldCode);

          // 条件を満たすときに表示
          if (show) {
            parentDiv.classList.remove("hidden");
            shownFields.add(showFieldCode);
          }
        });
      });
    }, 50);
  };
}

/*----日付フィールド変更時の表示非表示----------------*/
function DateFieldChange(rules) {
  return function (context) {
    setTimeout(() => {
      const record = context.getRecord();

      // 日付を Date オブジェクトに変換（nullなら null のまま）
      const parseDate = (str) => (str ? new Date(str) : null);

      rules.forEach((rule) => {
        const [fieldA, fieldB] = rule.fields;
        const rawA = record[fieldA]?.value;
        const rawB = record[fieldB]?.value;
        const valA = parseDate(rawA);
        const valB = parseDate(rawB);
        const showFieldCode = rule.showField;

        // フィールドコードに対応する要素を取得
        const fieldElem = document.querySelector(
          `[data-field-code="${showFieldCode}"]`
        );
        if (!fieldElem) return;

        // 対応するフィールドのタイプを取得
        const fieldWrapper = fieldElem.closest("[data-field-type]");
        const fieldType = fieldWrapper?.getAttribute("data-field-type");

        const parentDiv = fieldElem.closest(".w-full");
        if (parentDiv) parentDiv.classList.add("hidden");

        // サブテーブル以外のみ値をクリア
        if (fieldType !== "SUBTABLE") {
          context.setFieldValue(showFieldCode, "");
        }
        shownFields.delete(showFieldCode);

        // 両方日付が入っていて条件を満たせば表示
        if (valA && valB && rule.condition(valA, valB)) {
          parentDiv.classList.remove("hidden");
          shownFields.add(showFieldCode);
        }
      });
    }, 50);
  };
}

/*----本日の日付を取得------------------------------*/
function today() {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // 時間を00:00:00に設定
  return now;
}
