/*------------------------------------------------------
    フォームブリッジ  JSカスタマイズ　Azure
    作成日：2025/05/09
    更新日：2025/07/04
========================================================
主な処理内容
・入力された値による表示非表示
 （文字列1行、数値、日付）
・選択フィールドの選択による表示非表示
 （ラジオボタン、チェックボックス、ドロップダウン、複数選択）
・テーブルへの初期値の設定
・フィールドの編集不可
 （ドロップダウン、複数選択は非対応）


注意事項
・ステップをまたいだ表示設定不可
・表示非表示を切り替えるタイミングで値もリセットされる
  複数選択とチェックボックスはチェックを付けるたびに値がリセットされるため注意
  テーブル内フィールドは表示非表示のタイミングで値はリセットされない
・フォームブリッジ上でテーブルの行数制限の最小を設定する必要あり

------------------------------------------------------*/


/*----初期状態で非表示にするフィールド-----------------*/
const allHiddenFields = [

    //案件情報
    "超概算見積提出期日",
    "正式見積日は概算見積日から2週間以上空けてください。",
    "indent正式見積日は概算見積日から2週間以上空けてください。",
    "概算見積提出期日",
    "正式見積提出期日",
    "号口日が検収日より前に設定されています理由を記載ください",
    "セキュリティチェック完了予定日",
    "indent超概算見積提出期日",
    "indent概算見積提出期日",
    "indent正式見積提出期日",
    "indent号口日が検収日より前に設定されています理由を記載ください",
    "indentセキュリティチェック完了予定日",

    //環境監視
    "その他の場合はアクセス方式を記載ください1",
    "その他の場合はツール名を記載ください1",
    "Newrelic_Datadogエージェント導入有無1",
    "導入担当1",
    "CloudWatchLogsへ転送しますか1",
    "アプリログへの出力形式1",
    "indentその他の場合はアクセス方式を記載ください1",
    "indentその他の場合はツール名を記載ください1",
    "indentNewrelic_Datadogエージェント導入有無1",
    "indent導入担当1",
    "indentCloudWatchLogsへ転送しますか1",
    "indentアプリログへの出力形式1",

    "システム名2",
    "インフラ環境2",
    "検証アカウントID2",
    "号口アカウントID2",
    "仕向け2",
    "検証環境がない場合理由を記載ください2",
    "インフラの実装方式2",
    "外部からのアクセス方式2",
    "その他の場合はアクセス方式を記載ください2",
    "監視環境2",
    "監視ツール2",
    "その他の場合はツール名を記載ください2",
    "BacklogプロジェクトID2",
    "EC22",
    "Newrelic_Datadogエージェント導入有無2",
    "導入担当2",
    "アプリログ2",
    "CloudWatchLogsへ転送しますか2",
    "アプリログへの出力形式2",

    "indent検証環境がない場合理由を記載ください2",
    "indentその他の場合はアクセス方式を記載ください2",
    "indentその他の場合はツール名を記載ください2",
    "indentNewrelic_Datadogエージェント導入有無2",
    "indent導入担当2",
    "indentCloudWatchLogsへ転送しますか2",
    "indentアプリログへの出力形式2",


    "システム名3",
    "インフラ環境3",
    "検証アカウントID3",
    "号口アカウントID3",
    "仕向け3",
    "検証環境がない場合理由を記載ください3",
    "インフラの実装方式3",
    "外部からのアクセス方式3",
    "その他の場合はアクセス方式を記載ください3",
    "監視環境3",
    "監視ツール3",
    "その他の場合はツール名を記載ください3",
    "BacklogプロジェクトID3",
    "EC23",
    "Newrelic_Datadogエージェント導入有無3",
    "導入担当3",
    "アプリログ3",
    "CloudWatchLogsへ転送しますか3",
    "アプリログへの出力形式3",

    "indent検証環境がない場合理由を記載ください3",
    "indentその他の場合はアクセス方式を記載ください3",
    "indentその他の場合はツール名を記載ください3",
    "indentNewrelic_Datadogエージェント導入有無3",
    "indent導入担当3",
    "indentCloudWatchLogsへ転送しますか3",
    "indentアプリログへの出力形式3",

    //開発体制
    "label開発フェーズ",
    "label運用フェーズ",
    "TC営業2_部署名",
    "TC営業2_主担当者",
    "TC営業2_副担当者1",
    "TC営業2_副担当者2",

    //開発スケジュール
    "アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください",

    //コミュニケーション
    "定例の頻度",
    "所要時間",
    "参加メンバー",
    "報告の仕方",
    "indent定例の頻度",
    "indent参加メンバー",
    "indent報告の仕方",

    //アウトプットイメージ
    "システム構成図作成主体",
    "メッセージ対処表作成主体",
    "一次対処手順作成主体",
    "サービス正常性確認手順作成主体",
    "クラウドメンテナンス設計作成主体",

    //標準監視
    "AWSリソース",
    "外形監視URL",
    "ログ",
    "オプション監視",
    "カスタム監視",
    "運用受入",
    "labelAWSリソース",
    "labelオプション監視",
    "labelカスタム監視",
    "label運用受入",
];

/*----常に非表示にするフィールド-----------------------*/

alwaysHiddenFields = [""];


/*----テーブルの初期値---------------------------------*/
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
// 
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

// 非表示にするフィールドコードを保持するセット
let hiddenFields = new Set();

/*------------------------------------------------------
    フォーム表示
------------------------------------------------------*/
formBridge.events.on('form.show', function (context) {
    // 描画待ち
    setTimeout(() => {
        /*----フォーム表示時にフィールドを非表示にする-----------*/
        const toHide = allHiddenFields.filter(fieldCode => {
            return !shownFields.has(fieldCode);
        });

        if (shownFields === "") {
            formHiddenFields(allHiddenFields);
        } else {
            formHiddenFields(toHide);
        }

        /*----常に非表示にするフィールド-------------------------*/
        alwaysHiddenFields.forEach(fieldCode => {
            const elem = document.querySelector(`[data-field-code="${fieldCode}"]`);
            const parent = elem?.closest('.w-full');
            if (parent) parent.classList.add('hidden');
        });


        /*----フォーム表示時にフィールドを編集不可にする---------*/
        formShowDisabled({
            fieldCodes: [
                'AWSリソース_サービス名',
                'AWSリソース_単位',
                'AWSリソース_監視項目数',
                'AWSリソース_合計',
                '外形監視URL_サービス名',
                '外形監視URL_単位',
                '外形監視URL_監視項目数',
                '外形監視URL_合計',
                'ログ_サービス名',
                'ログ_単位',
                'ログ_監視項目数',
                'ログ_合計',
                'オプション監視_合計',
                'カスタム監視_合計',
                '運用受入_中項目',
                '運用受入_小項目',
                '運用受入_合計']
        });


        /*----テーブルに初期値を設定--------------------------*/

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

    }, 200);

    return context;

});


/*------------------------------------------------------
    選択肢フィールドが変更された
------------------------------------------------------*/
const conditionalFieldMaps = {
    /*----チェックボックス変更時まとめ---------------------*/
    '見積有無': {
        '超概算見積': ['超概算見積提出期日', 'indent超概算見積提出期日'],
        '概算見積': ['概算見積提出期日', 'indent概算見積提出期日'],
        '正式見積': ['正式見積提出期日', 'indent正式見積提出期日'],
    },

    '大項目選択': {
        '監視対象（インフラ）': ['AWSリソース', 'labelAWSリソース'],
        '外形監視（URL）': ['外形監視URL', 'labelAWSリソース'],
        '監視対象（アプリ）': ['ログ', 'labelAWSリソース'],
        'オプション監視': ['オプション監視', 'labelオプション監視'],
        'カスタム監視': ['カスタム監視', 'labelカスタム監視'],
        '運用受入': ['運用受入', 'label運用受入'],
    },


    /*----ラジオボタン変更時まとめ-------------------------*/

    'セキュリティチェック': {
        '済': ['セキュリティチェックURL', 'indentセキュリティチェックURL'],
        '未': ['セキュリティチェック完了予定日', 'indentセキュリティチェック完了予定日'],
    },

    'システム数': {
        '1': [
            "システム名1",
            "インフラ環境1",
            "検証アカウントID1",
            "号口アカウントID1",
            "仕向け1",
            "インフラの実装方式1",
            "外部からのアクセス方式1",
            "監視環境1",
            "監視ツール1",
            "BacklogプロジェクトID1",
            "EC21",
            "アプリログ1",
        ],
        '2': [
            "システム名1",
            "インフラ環境1",
            "検証アカウントID1",
            "号口アカウントID1",
            "仕向け1",
            "インフラの実装方式1",
            "外部からのアクセス方式1",
            "監視環境1",
            "監視ツール1",
            "BacklogプロジェクトID1",
            "EC21",
            "アプリログ1",
            "システム名2",
            "インフラ環境2",
            "検証アカウントID2",
            "検証環境がない場合理由を記載ください2",
            "indent検証環境がない場合理由を記載ください2",
            "号口アカウントID2",
            "仕向け2",
            "インフラの実装方式2",
            "外部からのアクセス方式2",
            "監視環境2",
            "監視ツール2",
            "BacklogプロジェクトID2",
            "EC22",
            "アプリログ2",
        ],
        '3': [
            "システム名1",
            "インフラ環境1",
            "検証アカウントID1",
            "号口アカウントID1",
            "仕向け1",
            "インフラの実装方式1",
            "外部からのアクセス方式1",
            "監視環境1",
            "監視ツール1",
            "BacklogプロジェクトID1",
            "EC21",
            "アプリログ1",

            "システム名2",
            "インフラ環境2",
            "検証アカウントID2",
            "号口アカウントID2",
            "仕向け2",
            "インフラの実装方式2",
            "外部からのアクセス方式2",
            "監視環境2",
            "監視ツール2",
            "BacklogプロジェクトID2",
            "EC22",
            "アプリログ2",

            "システム名3",
            "インフラ環境3",
            "検証アカウントID3",
            "検証環境がない場合理由を記載ください3",
            "indent検証環境がない場合理由を記載ください3",
            "号口アカウントID3",
            "仕向け3",
            "インフラの実装方式3",
            "外部からのアクセス方式3",
            "監視環境3",
            "監視ツール3",
            "BacklogプロジェクトID3",
            "EC23",
            "アプリログ3",
        ]
    },

    //環境変数 システム1
    '外部からのアクセス方式1': {
        'その他': ['その他の場合はアクセス方式を記載ください1', 'indentその他の場合はアクセス方式を記載ください1'],
    },
    '監視ツール1': {
        'その他': ['その他の場合はツール名を記載ください1', 'indentその他の場合はツール名を記載ください1'],
    },
    'EC21': {
        '有': ['Newrelic_Datadogエージェント導入有無1', 'indentNewrelic_Datadogエージェント導入有無1'],
    },
    'Newrelic_Datadogエージェント導入有無1': {
        '有': ['導入担当1', 'indent導入担当1'],
    },
    'アプリログ1': {
        '有': ['CloudWatchLogsへ転送しますか1', 'アプリログへの出力形式1', 'indentCloudWatchLogsへ転送しますか1', 'indentアプリログへの出力形式1'],
    },

    //環境変数 システム2
    '外部からのアクセス方式2': {
        'その他': ['その他の場合はアクセス方式を記載ください2', 'indentその他の場合はアクセス方式を記載ください2'],
    },
    '監視ツール2': {
        'その他': ['その他の場合はツール名を記載ください2', 'indentその他の場合はツール名を記載ください2'],
    },
    'EC22': {
        '有': ['Newrelic_Datadogエージェント導入有無2', 'indentNewrelic_Datadogエージェント導入有無2'],
    },
    'Newrelic_Datadogエージェント導入有無2': {
        '有': ['導入担当2', 'indent導入担当2'],
    },
    'アプリログ2': {
        '有': ['CloudWatchLogsへ転送しますか2', 'アプリログへの出力形式2', 'indentCloudWatchLogsへ転送しますか2', 'indentアプリログへの出力形式2'],
    },

    //環境変数 システム3
    '外部からのアクセス方式3': {
        'その他': ['その他の場合はアクセス方式を記載ください3', 'indentその他の場合はアクセス方式を記載ください3'],
    },
    '監視ツール3': {
        'その他': ['その他の場合はツール名を記載ください3', 'indentその他の場合はツール名を記載ください3'],
    },
    'EC23': {
        '有': ['Newrelic_Datadogエージェント導入有無3', 'indentNewrelic_Datadogエージェント導入有無3'],
    },
    'Newrelic_Datadogエージェント導入有無3': {
        '有': ['導入担当3', 'indent導入担当3'],
    },
    'アプリログ3': {
        '有': ['CloudWatchLogsへ転送しますか3', 'アプリログへの出力形式3', 'indentCloudWatchLogsへ転送しますか3', 'indentアプリログへの出力形式3'],
    },

    //開発体制
    '開発フェーズと運用フェーズの営業担当者は別か': {
        '別々': [
            'label開発フェーズ',
            'label運用フェーズ',
            'TC営業2_部署名',
            'TC営業2_主担当者',
            'TC営業2_副担当者1',
            'TC営業2_副担当者2'
        ],
    },

    //コミュニケーション
    '週次定例の実施': {
        '有': ['定例の頻度', '所要時間', '参加メンバー', 'indent定例の頻度', 'indent参加メンバー'],

    },
    '週次進捗報告会の実施': {
        '有': ['報告の仕方', 'indent報告の仕方'],
    },


    /*----ドロップダウン変更時まとめ-------------------------*/
    'システム構成図': {
        '新規作成': [`システム構成図作成主体`],
        '更新あり': [`システム構成図作成主体`],
    },
    'メッセージ対処表': {
        '新規作成': [`メッセージ対処表作成主体`],
        '更新あり': [`メッセージ対処表作成主体`],
    },
    '一次対処手順': {
        '新規作成': [`一次対処手順作成主体`],
        '更新あり': [`一次対処手順作成主体`],
    },
    'サービス正常性確認手順': {
        '新規作成': [`サービス正常性確認手順作成主体`],
        '更新あり': [`サービス正常性確認手順作成主体`],
    },
    'クラウドメンテナンス設計': {
        '新規作成': [`クラウドメンテナンス設計作成主体`],
        '更新あり': [`クラウドメンテナンス設計作成主体`],
    },

};

/*----チェックボックス変更時まとめ---------------------*/
formBridge.events.on('form.field.change.見積有無', toggleSelectVisibility({ fieldCode: '見積有無' }));
formBridge.events.on('form.field.change.大項目選択', toggleSelectVisibility({ fieldCode: '大項目選択' }));

/*----ラジオボタン変更時まとめ-------------------------*/
formBridge.events.on('form.field.change.セキュリティチェック', toggleSelectVisibility({ fieldCode: 'セキュリティチェック' }));

formBridge.events.on('form.field.change.システム数', toggleSelectVisibility_systemNum({ fieldCode: 'システム数' }));

//環境変数 システム1
formBridge.events.on('form.field.change.外部からのアクセス方式1', toggleSelectVisibility({ fieldCode: '外部からのアクセス方式1' }));
formBridge.events.on('form.field.change.監視ツール1', toggleSelectVisibility({ fieldCode: '監視ツール1' }));
formBridge.events.on('form.field.change.EC21', toggleSelectVisibility({ fieldCode: 'EC21' }));
formBridge.events.on('form.field.change.Newrelic_Datadogエージェント導入有無1', (context) => {
    toggleSelectVisibility({ fieldCode: 'Newrelic_Datadogエージェント導入有無1' })(context)
    context.setFieldValue("導入担当1", "運用構築");
});
formBridge.events.on('form.field.change.アプリログ1', toggleSelectVisibility({ fieldCode: 'アプリログ1' }));

//環境変数 システム2
formBridge.events.on('form.field.change.外部からのアクセス方式2', toggleSelectVisibility({ fieldCode: '外部からのアクセス方式2' }));
formBridge.events.on('form.field.change.監視ツール2', toggleSelectVisibility({ fieldCode: '監視ツール2' }));
formBridge.events.on('form.field.change.EC22', toggleSelectVisibility({ fieldCode: 'EC22' }));
formBridge.events.on('form.field.change.Newrelic_Datadogエージェント導入有無2', (context) => {
    toggleSelectVisibility({ fieldCode: 'Newrelic_Datadogエージェント導入有無2' })(context)
    context.setFieldValue("導入担当2", "運用構築");
});
formBridge.events.on('form.field.change.アプリログ2', toggleSelectVisibility({ fieldCode: 'アプリログ2' }));

//環境変数 システム3
formBridge.events.on('form.field.change.外部からのアクセス方式3', toggleSelectVisibility({ fieldCode: '外部からのアクセス方式3' }));
formBridge.events.on('form.field.change.監視ツール3', toggleSelectVisibility({ fieldCode: '監視ツール3' }));
formBridge.events.on('form.field.change.EC23', toggleSelectVisibility({ fieldCode: 'EC23' }));
formBridge.events.on('form.field.change.Newrelic_Datadogエージェント導入有無3', (context) => {
    toggleSelectVisibility({ fieldCode: 'Newrelic_Datadogエージェント導入有無3' })(context)
    context.setFieldValue("導入担当3", "運用構築");
});
formBridge.events.on('form.field.change.アプリログ3', toggleSelectVisibility({ fieldCode: 'アプリログ3' }));


formBridge.events.on('form.field.change.開発フェーズと運用フェーズの営業担当者は別か', toggleSelectVisibility({ fieldCode: '開発フェーズと運用フェーズの営業担当者は別か' }));
formBridge.events.on('form.field.change.週次定例の実施', toggleSelectVisibility({ fieldCode: '週次定例の実施' }));
formBridge.events.on('form.field.change.週次進捗報告会の実施', toggleSelectVisibility({ fieldCode: '週次進捗報告会の実施' }));


/*----ドロップダウン変更時まとめ-------------------------*/
formBridge.events.on('form.field.change.システム構成図', toggleSelectVisibility({ fieldCode: 'システム構成図' }));
formBridge.events.on('form.field.change.メッセージ対処表', toggleSelectVisibility({ fieldCode: 'メッセージ対処表' }));
formBridge.events.on('form.field.change.一次対処手順', toggleSelectVisibility({ fieldCode: '一次対処手順' }));
formBridge.events.on('form.field.change.サービス正常性確認手順', toggleSelectVisibility({ fieldCode: 'サービス正常性確認手順' }));
formBridge.events.on('form.field.change.クラウドメンテナンス設計', toggleSelectVisibility({ fieldCode: 'クラウドメンテナンス設計' }));


/*------------------------------------------------------
    フィールドの値が変更された（文字列/数値/日付）
------------------------------------------------------*/
const rules = [
    {
        type: 'date',
        fields: ['概算見積提出期日', '正式見積提出期日'],
        showField: ['正式見積日は概算見積日から2週間以上空けてください。', 'indent正式見積日は概算見積日から2週間以上空けてください。'],
        condition: (a, b) => {
            if (!(a instanceof Date) || !(b instanceof Date)) return false;

            const diffInMs = Math.abs(b - a);
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

            return diffInDays < 14;  // 14日未満だったら true（＝エラー表示）
        },
    },
    {
        type: 'date',
        fields: ['号口日_サービスイン', '号口環境_インフラリソース構築日'],
        showField: ['アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください', 'indentアプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください'],
        condition: (a, b) => a.getTime() === b.getTime(),
    },
    {
        type: 'date',
        fields: ['号口日_サービスイン', '号口環境_アプリデプロイ日'],
        showField: ['アプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください', 'indentアプリデプロイ日やインフラリソース構築日が号口日と同日です理由を記載ください'],
        condition: (a, b) => a.getTime() === b.getTime(),
    },
    {
        type: 'date',
        fields: ['号口日', '検収日'],
        showField: ['号口日が検収日より前に設定されています理由を記載ください', 'indent号口日が検収日より前に設定されています理由を記載ください'],
        condition: (a, b) => a < b,
    },
    {
        type: 'string',
        fields: ['検証アカウントID1'],
        showField: ['検証環境がない場合理由を記載ください1', 'indent検証環境がない場合理由を記載ください1'],
        condition: (status) => status === ''
    },
    {
        type: 'string',
        fields: ['検証アカウントID2'],
        showField: ['検証環境がない場合理由を記載ください2', 'indent検証環境がない場合理由を記載ください2'],
        condition: (status) => status === ''
    },
    {
        type: 'string',
        fields: ['検証アカウントID3'],
        showField: ['検証環境がない場合理由を記載ください3', 'indent検証環境がない場合理由を記載ください3'],
        condition: (status) => status === ''
    },


]


formBridge.events.on('form.field.change.概算見積提出期日', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.正式見積提出期日', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.号口日_サービスイン', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.号口環境_アプリデプロイ日', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.号口環境_インフラリソース構築日', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.号口日', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.検収日', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.検証アカウントID1', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.検証アカウントID2', toggleInputVisibility(rules));
formBridge.events.on('form.field.change.検証アカウントID3', toggleInputVisibility(rules));



//
// formBridge.events.on('confirm.show', function (context) {

//     console.log("oknnnisa");
//     // setTimeout(() => {
//     /*----フォーム表示時にフィールドを非表示にする-----------*/
//     const toHide = allHiddenFields.filter(fieldCode => {
//         return !shownFields.has(fieldCode);
//     });
//     console.log("toHide", toHide);
//     formHiddenFields(toHide);

//     // }, 100);

//     return context;
// });





/*------------------------------------------------------
    関数
------------------------------------------------------*/

/*----フィールドを非表示にする---------*/
function formHiddenFields(fieldCodes) {
    fieldCodes.forEach(fieldCode => {

        // フィールドコードに対応する要素を取得
        const fieldElem = document.querySelector(`[data-field-code="${fieldCode}"]`);
        if (!fieldElem) return;

        const parentDiv = fieldElem.closest('.w-full');
        if (parentDiv) parentDiv.classList.add('hidden');

        shownFields.delete(fieldCode);
        hiddenFields.add(fieldCode);

    });
}

/*----フィールドを表示する----------------*/
function formShowFields(fieldCodes) {
    fieldCodes.forEach(fieldCode => {
        const fieldElem = document.querySelector(`[data-field-code="${fieldCode}"]`);
        if (!fieldElem) return;

        const parentDiv = fieldElem.closest('.w-full');
        if (parentDiv) parentDiv.classList.remove('hidden');

        shownFields.add(fieldCode);
        hiddenFields.delete(fieldCode);
    });
}


/*----フィールドを編集不可にする--------------------------
    formShowDisabled({
        fieldCodes: ['XXX', 'XXX', 'XXX', 'XXX']
    });
 
 ※通常フィールド、サブテーブル内フィールドどちらにも対応
   同じ配列に格納
   ドロップダウンと複数選択は非対応
*/
function formShowDisabled({ fieldCodes }) {
    if (!Array.isArray(fieldCodes)) return;

    fieldCodes.forEach(fieldCode => {
        const fieldElems = document.querySelectorAll(
            `[data-field-code="${fieldCode}"] input, 
             [data-field-code="${fieldCode}"] textarea, 
             [data-field-code="${fieldCode}"] select`
        );

        if (!fieldElems.length) return;

        const style = {
            backgroundColor: '#e3e7e8',
            color: '#888'
        };

        fieldElems.forEach(elem => {

            //編集不可
            elem.disabled = true;

            //styleの適応
            Object.entries(style).forEach(([key, value]) => {
                elem.style[key] = value;
            });
        });
    });
}


function formShowDisabled({ fieldCodes }) {
    if (!Array.isArray(fieldCodes)) return;

    // スピンボタンを非表示＆入力欄編集不可にするスタイル
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        /* Chrome・Edge・Safari のスピンボタン非表示 */
        [data-field-code] input[type=number]::-webkit-inner-spin-button,
        [data-field-code] input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        /* Firefox の場合は数値フィールドをテキスト風に */
        [data-field-code] input[type=number] {
            -moz-appearance: textfield;
        }
    `;
    document.head.appendChild(styleSheet);

    fieldCodes.forEach(fieldCode => {
        const fieldElems = document.querySelectorAll(
            `[data-field-code="${fieldCode}"] input, 
             [data-field-code="${fieldCode}"] textarea, 
             [data-field-code="${fieldCode}"] select`
        );

        fieldElems.forEach(elem => {
            elem.disabled = true;
            elem.style.backgroundColor = '#e3e7e8';
            elem.style.color = '#888';
        });
    });
}


/*----テーブルに初期値を設定--------------------------
    formShowTableInitialValues(context, {
        tableCode: 'テーブルのフィールドコード',
        fieldCode: '初期値を設定するテーブル内フィールドコード',
        initValues: ['XXX', 'XXX', 'XXX', 'XXX']
    });
 
 ※行数設定の最小値にinitValuesの数以上の値を設定
*/
function formShowTableInitialValues(context, { tableCode, fieldCode, initValues }) {
    initValues.forEach((value, index) => {
        context.setSubtableFieldValue(tableCode, fieldCode, index, value);
    });
}



/*----選択フィールド変更時の表示非表示----------------
    const conditionalFieldMaps = {
        '選択フィールド１': {
            '選択肢A': ['表示するフィールド', '表示するフィールド'],
            '選択肢B': ['表示するフィールド', '表示するフィールド'],
            '選択肢C': ['選択フィールド２'],
            ...
        },
        '選択フィールド２': {
            '選択肢A': ['表示するフィールド','選択フィールド３'],
            ...
        },
        '選択フィールド３': {
            '選択肢A': ['表示するフィールド'],
            ...
        },
        ...
    }

    formBridge.events.on('form.field.change.選択フィールド', toggleSelectVisibility({ fieldCode: '選択フィールド' }));
 
 
    ※選択フィールドの表示設定は1つのマップにまとめる
      親フィールドが非表示の場合、子,孫フィールドは非表示になる
      上記の場合 ) 選択フィールド１ > 選択フィールド２ > 選択フィールド３
 
*/
function toggleSelectVisibility({ fieldCode }) {
    return function (context) {
        const value = context.value;
        const values = Array.isArray(value) ? value : [value];

        const fieldMap = conditionalFieldMaps[fieldCode];
        if (!fieldMap) return;

        //表示するフィールド
        const showFields = [...new Set(values.flatMap(val => fieldMap[val] || []))];

        //変更されたフィールドの直下の子フィールド
        const directChildren = [...new Set(Object.values(fieldMap).flat())];

        //制御するすべてのフィールド
        const allControlledFields = new Set();

        //制御するフィールドを再帰的に集める関数
        function collectAllControlledFields(fc) {
            if (allControlledFields.has(fc)) return;
            allControlledFields.add(fc);

            if (fc in conditionalFieldMaps) {
                const map = conditionalFieldMaps[fc];
                const children = Object.values(map).flat();
                children.forEach(child => collectAllControlledFields(child));
            }
        }

        directChildren.forEach(fc => collectAllControlledFields(fc));

        //フィールドの非表示と値のリセット
        allControlledFields.forEach(fieldCode => {
            const elem = document.querySelector(`[data-field-code="${fieldCode}"]`);
            const wrapper = elem?.closest('[data-field-type]');
            const fieldType = wrapper?.getAttribute('data-field-type');
            const parent = elem?.closest('.w-full');

            if (parent) parent.classList.add('hidden');

            if (fieldType === 'RADIO_BUTTON') {
                context.setFieldValue(fieldCode, "---");

            } else if (fieldType !== 'SUBTABLE') {
                context.setFieldValue(fieldCode, '');
            }

            shownFields.delete(fieldCode);
            hiddenFields.add(fieldCode);

        });

        //フィールドの表示
        showFields.forEach(fieldCode => {
            const elem = document.querySelector(`[data-field-code="${fieldCode}"]`);
            const parent = elem?.closest('.w-full');
            if (parent) parent.classList.remove('hidden');

            shownFields.add(fieldCode);
            hiddenFields.delete(fieldCode);
        });
    };
}


//システム数用表示切替
function toggleSelectVisibility_systemNum({ fieldCode }) {
    return function (context) {
        const value = context.value;
        const values = Array.isArray(value) ? value : [value];

        const fieldMap = conditionalFieldMaps[fieldCode];
        if (!fieldMap) return;

        // 表示対象のフィールド
        const showFields = [...new Set(values.flatMap(val => fieldMap[val] || []))];

        // 変更されたフィールドの直下の子フィールド
        const directChildren = [...new Set(Object.values(fieldMap).flat())];

        // 再帰的にすべての制御対象フィールドを集める
        const allControlledFields = new Set();
        function collectAllControlledFields(fc) {
            if (allControlledFields.has(fc)) return;
            allControlledFields.add(fc);

            if (fc in conditionalFieldMaps) {
                const map = conditionalFieldMaps[fc];
                const children = Object.values(map).flat();
                children.forEach(child => collectAllControlledFields(child));
            }
        }
        directChildren.forEach(fc => collectAllControlledFields(fc));

        // 非表示にすべきフィールド（表示対象から除外）
        const fieldsToHide = [...allControlledFields].filter(fc => !showFields.includes(fc));

        // 非表示処理（表示制御＋shown/hiddenセット更新）
        formHiddenFields(fieldsToHide);

        // 非表示フィールドの値をクリア
        fieldsToHide.forEach(fieldCode => {
            const wrapper = document.querySelector(`[data-field-code="${fieldCode}"]`)?.closest('[data-field-type]');
            const fieldType = wrapper?.getAttribute('data-field-type');

            if (fieldType === 'RADIO_BUTTON') {
                context.setFieldValue(fieldCode, "---");
            } else if (fieldType !== 'SUBTABLE') {
                context.setFieldValue(fieldCode, '');
            }
        });

        // 表示対象フィールドの表示処理
        formShowFields(showFields);
    };
}

/*----フィールド変更時の表示非表示--------------------
const rules = [
    {
        type: '変更するフィールドの型',                         // string, number, date
        fields: ['比較するフィールドA', '比較するフィールドB'],  // 1 or 2フィールド
        showField: ['表示するフィールド'],                     // １～複数フィールド
        condition: 条件,
    },
   {   例)
        type: 'date',
        fields: ['日付A', '日付B'],
        showField: ['日_AとBが同日'],
        condition: (a, b) => a.getTime() === b.getTime(),
    },
]

formBridge.events.on('form.field.change.フィールドコード', toggleInputVisibility(rules));

*/

function toggleInputVisibility(rules) {
    const parseMap = {
        date: (val) => val ? new Date(val) : null,
        number: (val) => val !== '' && val != null ? Number(val) : null,
        string: (val) => typeof val === 'string' ? val : (val != null ? String(val) : null)
    };

    return function (context) {
        setTimeout(() => {
            const record = context.getRecord();
            console.log(record)
            //表示フィールドごとに条件をまとめる
            const groupedRules = {};
            rules.forEach(rule => {
                const showFields = Array.isArray(rule.showField) ? rule.showField : [rule.showField];
                showFields.forEach(field => {
                    if (!groupedRules[field]) groupedRules[field] = [];
                    groupedRules[field].push(rule);
                });
            });

            //条件が一つでも当てはまっていたら表示する
            Object.entries(groupedRules).forEach(([showFieldCode, ruleGroup]) => {
                let shouldShow = false;

                for (const rule of ruleGroup) {
                    const parse = parseMap[rule.type];
                    console.log("parse", parse);
                    if (!parse) continue;

                    const [fieldA, fieldB] = rule.fields;

                    // fieldsが非表示だったらスキップ
                    // const fieldCodes = rule.fields.filter(Boolean);
                    // console.log("fieldCodes", fieldCodes);
                    // const allFieldsVisible = fieldCodes.every(code => shownFields.has(code));
                    // console.log("allFieldsVisible", allFieldsVisible);
                    // if (!allFieldsVisible) continue;

                    const rawA = record[fieldA]?.value;
                    const rawB = fieldB ? record[fieldB]?.value : null;
                    const valA = parse(rawA);
                    const valB = fieldB ? parse(rawB) : null;
                    console.log("rawA", rawA);
                    console.log("rawB", rawB);

                    const conditionMet = fieldB != null
                        ? (valA != null && valB != null && rule.condition(valA, valB))
                        : (valA != null && rule.condition(valA));

                    if (conditionMet) {
                        shouldShow = true;
                        break;
                    }
                }

                console.log("shouldShow", shouldShow);
                const fieldElem = document.querySelector(`[data-field-code="${showFieldCode}"]`);
                console.log("fieldElem", fieldElem);
                if (!fieldElem) return;

                const fieldWrapper = fieldElem.closest('[data-field-type]');
                const fieldType = fieldWrapper?.getAttribute('data-field-type');
                const parentDiv = fieldElem.closest('.w-full');

                if (shouldShow) {
                    parentDiv?.classList.remove('hidden');
                    shownFields.add(showFieldCode);
                    hiddenFields.delete(showFieldCode);
                } else {
                    parentDiv?.classList.add('hidden');
                    if (fieldType === 'RADIO_BUTTON') {
                        context.setFieldValue(showFieldCode, "---");
                    } else if (fieldType !== 'SUBTABLE') {
                        context.setFieldValue(showFieldCode, '');
                    }
                    shownFields.delete(showFieldCode);
                    hiddenFields.add(showFieldCode);
                }
            });
        }, 200);
    };
}
