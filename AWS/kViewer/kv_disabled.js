// 見えるテキスト優先で取得（複数行OK）
const getVisibleText = (el) => (el?.innerText ?? el?.textContent ?? "");

// 空判定のための正規化
const normalize = (s) =>
    (s ?? "")
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // ゼロ幅
        .replace(/[\u00A0\u3000]/g, " ")       // nbsp/全角→半角
        .replace(/[\r\n\t]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const PLACEHOLDERS = new Set([
    "-", "ー", "—", "―", "----", "---", "--",
    "未選択", "未設定", "なし", "無し", "N/A", "NA", "None", "null"
]);
const isDashOnly = (s) => /^[-‐-‒–—―ー－\s]+$/.test(s);
const isPlaceholderOrEmpty = (raw) => {
    const v = normalize(raw);
    if (!v) return true;
    const lower = v.toLowerCase();
    if (PLACEHOLDERS.has(v) || PLACEHOLDERS.has(lower)) return true;
    if (isDashOnly(v)) return true;
    return false;
};

// kv-element 内の「値」を抽出（テキスト/入力系）
const pickTextValue = (el) => {
    const container = el.querySelector(".kv-element-has-value") || el;
    const textEl =
        container.querySelector(".kv-text-element, .kv-text, .value");
    const inputEl =
        container.querySelector("textarea, [contenteditable='true'], input[type='text'], input:not([type])");

    if (textEl) return getVisibleText(textEl);
    if (inputEl) {
        if (inputEl.matches("[contenteditable='true']")) return getVisibleText(inputEl);
        return inputEl.value ?? getVisibleText(inputEl);
    }
    // 最後の砦：コンテナの見える文字
    return getVisibleText(container);
};

// チェックボックス群の状態を判定（ネイティブ + カスタムUI対応）
const hasAnyChecked = (scope) => {
    // ネイティブ input[type=checkbox]
    const native = scope.querySelectorAll("input[type='checkbox']");
    if ([...native].some(cb => cb.checked)) return true;

    // カスタムUI（role=checkbox / aria-checked / よくあるクラス名）
    const custom = scope.querySelectorAll("[role='checkbox'], .checkbox, .chk, .is-checkbox");
    for (const el of custom) {
        const aria = (el.getAttribute("aria-checked") || "").toLowerCase();
        if (aria === "true") return true;
        // よくある「チェック済み」クラス
        if (/\b(checked|is-checked|active|selected)\b/i.test(el.className)) return true;
        // data-checked="true" など
        const dataChecked = (el.getAttribute("data-checked") || "").toLowerCase();
        if (dataChecked === "true" || dataChecked === "1") return true;
    }
    return false;
};

const hideIfEmpty = (kvEl) => {
    const container = kvEl.querySelector(".kv-element-has-value") || kvEl;

    // 1) チェックボックス群がある場合の専用ロジック
    const hasCheckboxUI =
        container.querySelector("input[type='checkbox'], [role='checkbox'], .checkbox, .chk, .is-checkbox") !== null;

    if (hasCheckboxUI) {
        const anyChecked = hasAnyChecked(container);
        if (!anyChecked) {
            kvEl.style.setProperty("display", "none", "important");
            return;
        } else {
            kvEl.style.removeProperty("display");
            return; // チェックが1つでもあれば表示確定
        }
    }

    // 2) テキスト/ラジオ（--- 等プレースホルダー）判定
    const textValue = pickTextValue(kvEl);
    if (isPlaceholderOrEmpty(textValue)) {
        kvEl.style.setProperty("display", "none", "important");
    } else {
        kvEl.style.removeProperty("display");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".kv-element").forEach(hideIfEmpty);

    // 変化に追従（追加・テキスト変更・属性変更）
    const mo = new MutationObserver((muts) => {
        for (const m of muts) {
            // 追加ノードに .kv-element が含まれたら評価
            for (const node of m.addedNodes) {
                if (!(node instanceof Element)) continue;
                if (node.matches(".kv-element")) hideIfEmpty(node);
                node.querySelectorAll?.(".kv-element").forEach(hideIfEmpty);
            }
            // 既存ノードの変化：テキスト/checked/aria-checked/class など
            const maybeKv = m.target.closest?.(".kv-element");
            if (maybeKv) hideIfEmpty(maybeKv);
        }
    });

    mo.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["checked", "aria-checked", "class", "data-checked"]
    });

    // 変更イベント（信頼できるトリガ）
    document.addEventListener("change", (e) => {
        const kv = e.target.closest?.(".kv-element");
        if (kv) hideIfEmpty(kv);
    }, true);
});
