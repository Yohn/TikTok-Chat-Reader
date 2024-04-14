//change some settings
// https://github.com/AucT/b5toast
// https://auct.github.io/b5toast/b5toast_demo
// b5toast.show('warning', 'my message', 'optional title', optionalDelay);
const b5toastContainerElement = document.getElementById("toast-container");

//don't touch code below if you don't know what are you doing
const b5toast = {
    delayInMilliseconds: 7000,
    htmlToElement: function (html) {
        const template = document.createElement("template");
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    },
    show: function (color, message, title, delay) {
        title = title ? title : "";
        const html = `<div class="toast align-items-center mt-1 text-bg-${color} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
                <b>${title}</b>
                <div>${message}</div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>`;
        const toastElement = b5toast.htmlToElement(html);
        b5toastContainerElement.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement, {
            delay: delay?delay:b5toast.delayInMilliseconds,
            animation: true
        });
        toast.show();
        setTimeout(() => toastElement.remove(), delay?delay:b5toast.delayInMilliseconds + 3000); // let a certain margin to allow the "hiding toast animation"
    },

    error: function (message, title, delay) {
        b5toast.show("danger", message, title, delay);
    },
    success: function (message, title, delay) {
        b5toast.show("success", message, title, delay);
    },
};