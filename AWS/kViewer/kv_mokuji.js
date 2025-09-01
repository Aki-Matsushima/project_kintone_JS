(() => {
    "use strict";

    // ===== 設定：どのラベル → どのラベルへスクロールするか =====
    // 複数設定したい場合は対にして追加してください。
    const LINKS = [
        { from: "商談件名", to: "Q1. ご依頼の案件情報について教えてください。" }
    ];

    // ===== ユーティリティ =====
    // テキストを比較用に正規化（前後空白/改行/連続空白/全角空白を除去）
    const normalize = (s) =>
        (s || "")
            .replace(/\u3000/g, " ")   // 全角空白 → 半角
            .replace(/\s+/g, " ")      // 連続空白 → 1個
            .trim();

    // ラベル候補を取得（環境差吸収）
    function allLabels(root = document) {
        return Array.from(
            root.querySelectorAll(".kv-element-label, label.kv-element-label, .kv-element label")
        );
    }

    function findLabelByText(text, root = document) {
        const needle = normalize(text);
        return allLabels(root).find(el => normalize(el.textContent) === needle) || null;
    }

    // スクロール＆一時ハイライト
    function scrollToAndHighlight(el) {
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const prev = el.style.backgroundColor;
        el.style.backgroundColor = "#ffff99";
        setTimeout(() => { el.style.backgroundColor = prev; }, 1500);
    }

    // クリック可能な見た目＆アクセシビリティ付加
    function decorateAsLink(el) {
        if (!el) return;
        el.style.cursor = "pointer";
        el.style.textDecoration = "underline";
        el.style.color = el.style.color || "#007bff";
        // キーボード操作対応
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
        if (!el.hasAttribute("role")) el.setAttribute("role", "link");
    }

    // ===== イベントの取り付け（堅牢版） =====
    function attachOnce() {
        // 各ペアごとに存在チェックして、親要素にイベント委譲を設定
        LINKS.forEach(({ from, to }) => {
            const src = findLabelByText(from);
            const dst = findLabelByText(to);

            if (!src || !dst) return; // まだDOMに無い場合は後述のObserverで再試行

            // 直接ラベルに付けると上に被さった要素で拾えないことがあるため、
            // フィールド全体（.kv-element など）の親にイベント委譲する
            const fieldRoot = src.closest(".kv-element, .kv-detail-field") || src.parentElement || document;

            // 複数回付与されないように印をつける
            if (fieldRoot.__my_link_attached__) return;
            fieldRoot.__my_link_attached__ = true;

            // クリック委譲
            fieldRoot.addEventListener("click", (ev) => {
                // クリックされたのが「商談件名」ラベル自身、またはその内側なら発火
                const path = ev.composedPath ? ev.composedPath() : [ev.target];
                const hit = path.find(n => n && n.nodeType === 1 && allLabels().includes(n));
                if (hit && normalize(hit.textContent) === normalize(from)) {
                    ev.preventDefault();
                    scrollToAndHighlight(dst);
                }
            });

            // キーボード操作（Enter/Space）
            const srcLabel = src; // 装飾はラベル見た目に
            decorateAsLink(srcLabel);
            srcLabel.addEventListener("keydown", (ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    scrollToAndHighlight(dst);
                }
            });
        });
    }

    // 初期実行（すでに描画済みのケース）
    attachOnce();

    // 以降の差し替えにも追従（SPA・タブ切替など）
    const obs = new MutationObserver(() => attachOnce());
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // 可視化戻り時にも再確認（仮想遷移対策）
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") attachOnce();
    });

    // 念のため遅延リトライ（描画が遅い環境向け）
    setTimeout(attachOnce, 300);
    setTimeout(attachOnce, 1000);
})();
