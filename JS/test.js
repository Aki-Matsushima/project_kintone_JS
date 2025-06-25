(function () {
    "use strict";

    kintone.events.on([`app.record.index.show`,], (event) => {
        alert('アラートを出したい');
        return event;
    }
    );
})();
