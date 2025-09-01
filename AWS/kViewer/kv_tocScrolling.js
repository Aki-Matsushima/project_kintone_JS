(() => {
    "use strict";

    // ===== ここだけ必要に応じて調整 =====
    // 目次リンクのテキスト → スクロール先のラベル名（完全一致推奨）
    // ラベル名が目次テキストと同じなら MAP は空 {} のままでもOK。
    const MAP = {
        "案件情報": "Q1. ご依頼の案件情報について教えてください。",
        "監視環境": "Q2. インフラや監視環境について教えてください。",
        "開発体制": "Q3. 開発体制について教えてください。",
        "開発スケジュール": "Q4.開発スケジュールについて教えてください。",
        "コミュニケーション": "Q5. 作業開始後のコミュニケーション方法について教えてください。",
        "アウトプットイメージ": "Q6. アウトプットイメージの共有をお願いします。",
        "見積算出": "Q7.各監視項目のリソース数を入力してください",
    };

    // サイドリスト（ご提示のDOM）
    const SIDE_SELECTOR = ".kv-side-content .ql-editor #box";

    // ===== ユーティリティ =====
    const normalize = (s) =>
        (s || "")
            .replace(/\u3000/g, " ") // 全角空白→半角
            .replace(/\s+/g, " ")    // 連続空白→1個
            .trim();

    function allLabels(root = document) {
        // kViewerのラベルに広めに対応
        return Array.from(root.querySelectorAll(".kv-element-label, label.kv-element-label, .kv-element label"));
    }

    function findLabelByText(text, root = document) {
        const needle = normalize(text);
        // 完全一致優先 → 含有一致の順
        const labels = allLabels(root);
        let el = labels.find(el => normalize(el.textContent) === needle);
        if (el) return el;
        return labels.find(el => normalize(el.textContent).includes(needle)) || null;
    }

    // ===== 余白ありスクロール処理 =====
    function getFixedHeaderHeight() {
        const sels = [".kv-header", ".kv-global-header", ".el-header", "header", ".kv-toolbar", ".kv-sticky-header"];
        let h = 0;
        sels.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                const st = getComputedStyle(el);
                if (st.position === "fixed" || st.position === "sticky") {
                    h = Math.max(h, el.getBoundingClientRect().height);
                }
            });
        });
        return h ? Math.ceil(h) + 12 : 80; // デフォルト80pxくらい。環境に合わせて調整可
    }

    function scrollToAndHighlight(el) {
        if (!el) return;
        const offset = getFixedHeaderHeight();

        // ページ全体に対してスクロール
        const top = window.scrollY + el.getBoundingClientRect().top - offset;
        window.scrollTo({ top, behavior: "smooth" });

        // ハイライト（任意）
        const prev = el.style.backgroundColor;
        el.style.backgroundColor = "#fdc2ff";
        setTimeout(() => { el.style.backgroundColor = prev; }, 1500);
    }

    function enhanceLinkLook(a) {
        a.style.cursor = "pointer";
        a.style.textDecoration = "underline";
        if (!a.hasAttribute("tabindex")) a.setAttribute("tabindex", "0");
        if (!a.hasAttribute("role")) a.setAttribute("role", "link");
    }

    // ===== 本処理 =====
    function attachHandlers() {
        const box = document.querySelector(SIDE_SELECTOR);
        if (!box || box.__toc_attached__) return;
        box.__toc_attached__ = true;

        // 見た目強化（任意）
        box.querySelectorAll("a").forEach(enhanceLinkLook);

        // クリックを委譲（リンクが増減してもOK）
        box.addEventListener("click", (ev) => {
            const a = ev.target.closest("a");
            if (!a) return;

            // 1) href="#ID" が有ればまずIDを優先
            const href = a.getAttribute("href") || "";
            if (href.startsWith("#") && href.length > 1) {
                const idTarget = document.getElementById(href.slice(1));
                if (idTarget) {
                    ev.preventDefault();
                    scrollToAndHighlight(idTarget);
                    return;
                }
            }

            // 2) テキスト → ラベル名を解決
            const linkText = normalize(a.textContent);
            const targetLabelName = MAP[linkText] ? MAP[linkText] : linkText;
            const labelEl = findLabelByText(targetLabelName);

            if (labelEl) {
                ev.preventDefault();
                scrollToAndHighlight(labelEl);
            }
            // 見つからなければ通常のリンク動作（# ならページ上部へ）に任せる
        });

        // キーボード操作（Enter/Space）
        box.addEventListener("keydown", (ev) => {
            if (ev.key !== "Enter" && ev.key !== " ") return;
            const a = ev.target.closest("a");
            if (!a) return;
            a.click();
            ev.preventDefault();
        });
    }

    // 初回・遅延・再描画に強く
    const tryAttach = () => attachHandlers();
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", tryAttach, { once: true });
    } else {
        tryAttach();
    }
    new MutationObserver(tryAttach).observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(tryAttach, 300);
    setTimeout(tryAttach, 1000);
})();
