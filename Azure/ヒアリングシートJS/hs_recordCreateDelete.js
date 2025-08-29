//案件フォルダの作成・削除を行う

(function () {
    'use strict';

    const appId = 104;                         // 案件フォルダアプリ
    const lookupFieldCode = "ヒアリングシート選択";  // レコードID格納フィールド 
    const firstStatus = "案件受付対応中";           // 初期ステータス
    const deleteStatus = "完了(案件化無し)";        // レコードを削除する際のステータス


    //レコード詳細画面で初期ステータスかつ案件フォルダが存在しない場合、新規作成
    kintone.events.on('app.record.detail.show', async (event) => {
        const record = event.record;
        const nowStatus = record.ステータス.value;
        if (nowStatus !== firstStatus) {
            return event;
        }

        try {
            // 登録済みレコードがあるか確認
            const getResp = await kintone.api(
                kintone.api.url('/k/v1/records.json', true),
                'GET',
                {
                    app: appId,
                    query: `${lookupFieldCode} = ${record.$id.value}`,
                    fields: ['$id']
                }
            );

            if (getResp.records.length > 0) {
                return event; // 登録しない
            }


            const body = {
                app: appId,
                "updateKey": {
                    [lookupFieldCode]: {
                        value: record.$id.value
                    },
                },
                record: {
                    文字列1行_0: {
                        value: 'ABC'
                    }
                }
            };
            await kintone.api(kintone.api.url('/k/v1/record.json', true), 'PUT', body);
            alert('案件フォルダを作成しました。');

        } catch (error) {
            console.error('エラー:', error);
            event.error = 'データ作成中にエラーが発生しました。';
        }

        return event;
    });


    //アクション実行時に削除するステータスに変更になった場合、案件フォルダを削除
    kintone.events.on('app.record.detail.process.proceed', async function (event) {
        const record = event.record;
        const nextStatus = event.nextStatus.value;

        // ステータスが指定したものに変更されたときだけ実行
        if (nextStatus !== deleteStatus) {
            return event;
        }

        try {
            // 該当レコードを検索
            const getResp = await kintone.api(
                kintone.api.url('/k/v1/records', true),
                'GET',
                {
                    app: appId,
                    query: `${lookupFieldCode} = ${record.$id.value}`,
                    fields: ['$id']
                }
            );

            if (getResp.records) {
                // 該当レコードを削除
                await kintone.api(
                    kintone.api.url('/k/v1/records', true),
                    'DELETE',
                    {
                        app: appId,
                        ids: [getResp.records[0].$id.value]
                    }
                );
                alert(`案件フォルダを削除しました。`);
            }
        }
        catch (err) {
            console.error('削除エラー:', err);
        }
        return event;
    });
})();

