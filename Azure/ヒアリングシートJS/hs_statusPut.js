//ステータスを他アプリに送信

(function () {
    'use strict';

    const appId_gt = 98;            //見積条件書
    const lookupFieldCode = "ヒアリングシート選択";  // 連携フィールド

    kintone.events.on('app.record.detail.process.proceed', async function (event) {
        const record = event.record;
        const nextStatus = event.nextStatus.value;
        const appIds = [appId_gt];

        for (const appId of appIds) {
            try {
                // レコード取得（lookupFieldCode に元レコードIDが設定されているもの）
                const getResp = await kintone.api(
                    kintone.api.url('/k/v1/records', true),
                    'GET',
                    {
                        app: appId,
                        query: `${lookupFieldCode} = "${record.$id.value}"`,
                        fields: ['$id']
                    }
                );


                if (getResp.records.length === 0) {
                    console.log("該当レコードなし");
                    continue;
                }

                console.log("getResp", getResp);

                for (const rec of getResp.records) {
                    const updateParams = {
                        app: appId,
                        id: rec.$id.value,  // ← ここで対象レコードIDを指定
                        record: {
                            ヒアリングシートステータス隠し: {
                                value: nextStatus
                            }
                        }
                    };

                    await kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', updateParams);
                    // console.log(`アプリ ${appId} のレコード ${rec.$id.value} を更新`);
                }

            } catch (error) {
                console.error(`アプリ ${appId} のレコード更新エラー`, error);
            }
        }

        return event;
    });
})();
