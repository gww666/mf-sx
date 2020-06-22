let toastDiv;
let timer = null;
export const Toast = (options) => {
    let container = document.body;
    if (container.querySelector(".toast-box")) {
		container.removeChild(container.querySelector(".toast-box"));
		clearTimeout(timer);
		timer = null;
    };

	let _options = {
		duration: 2000,
		message: "处理成功",
		type: "normal"
    }
    // 只传一个字符串，默认2s，type normal
    if(typeof options === "string") {
        _options.message = options;
    }

    let config = Object.assign({}, _options);
    
	if (Object.prototype.toString.call(options) === "[object Object]") {
		config = Object.assign({}, config, options);
    }
    toastDiv = document.createElement("div");
    toastDiv.className = "toast-container";
    
    container.appendChild(toastDiv);

    let toastClassName = "toast-box toast_default";
	if (config.type === "failed") {
		toastClassName = "toast-box toast_fail";
	} else if (config.type === "warning") {
		toastClassName = "toast-box toast_warning";
    } else if (config.type === "success") {
        toastClassName = "toast-box toast_success";
    };
    toastDiv.setAttribute("class", toastClassName);

	let text = document.createElement("div");
	//成功和失败是两种不同的样式
	let textStyle = `text-align: center;font-size: .26rem;line-height: .3rem;`;
    text.setAttribute("style", textStyle);
    
    text.innerHTML = config.message;
    
	toastDiv.appendChild(text);
    timer = setTimeout(() => {
        if (container.querySelector(".toast-box")) {
            container.removeChild(toastDiv);
        }
    }, config.duration);
}