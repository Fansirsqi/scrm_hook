// ==UserScript==
// @name         ✨Hook.DNY-SCRM-通过Authorization登录✨
// @namespace    fansir
// @author       fansir
// @version      0.9.7
// @description  使用🚀Authorization🚀登录DNY-SCRM
// @author       Fansirliu
// @match        https://dyaccountmgt.platform-loreal.cn/*
// @match        https://dyaccountmgt-uat.platform-loreal.cn/*
// @match        https://t-douyinscrm.tarsocial.com/*
// @icon         https://www.lorealparis.com.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475857/%E2%9C%A8HookDNY-SCRM-%E9%80%9A%E8%BF%87Authorization%E7%99%BB%E5%BD%95%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/475857/%E2%9C%A8HookDNY-SCRM-%E9%80%9A%E8%BF%87Authorization%E7%99%BB%E5%BD%95%E2%9C%A8.meta.js
// ==/UserScript==
// 同步DEV菜单至生产，每日）点自动同步 @version      0.9.7
// 更新正式线菜单，添加 star_chart_auths字段 ，具体不知道干啥用的，可能是星图相关，需要测试这块的同学请留意 @version      0.9.6
// 优化检测逻辑，重振雄风 @version      0.9.4
// 修复按钮展示逻辑
//新增快捷复制Authorization按钮  @version      0.9.4
//同步更新dev菜单，星图菜单  @version      0.9.2
//调整注入主题为light模式,因为生产默认扫码登录是light模式  @version      0.9.1
//修复菜单缺失DNY达人榜单问题,更新权限菜单同步DEV环境,可能会出现不可预知的问题 @version      0.9
//修改url检测逻辑,修复计时器刷新一次后不再计时的问题(以前是采用刷新页面故会重载js,所以难以复现)
//移除鼠标点击监测事件@version      0.7.2
//调整逻辑,在非登录页面,才进行监听等操作@version      0.7.1
//去除不必要的注释@version      0.6.1
//优化刷新页面的逻辑,检测到用户点击等操作时,重置续命计时器,优化hook提示@version      0.6
//修复因账号id固定导致的访问蓝v号提示账号不存在的问题@version      0.5
//更名,调整按钮样式@version      0.4
(function () {
    ("use strict");
    var host = window.location.host;
    var remainingTime = 10; // 初始剩余时间为 10 分钟
    var log = console.log;
    var intervalId1, intervalId2; // 将 intervalId1 声明在函数外部，以便其他函数可以访问
    var SERVER_HOST = 'https://dny-token.fansirai.top'; //后台地址

    var loginUrls = [
        "https://t-douyinscrm.tarsocial.com/s/login",
        "https://dyaccountmgt.platform-loreal.cn/s/login",
        "https://dyaccountmgt-uat.platform-loreal.cn/s/login",
        "https://t-douyinscrm.tarsocial.com/login",
        "https://dyaccountmgt.platform-loreal.cn/login",
        "https://dyaccountmgt-uat.platform-loreal.cn/login",
    ];
    var map = {
        "t-douyinscrm.tarsocial.com": "https://t-apidouyinscrm.aisuperstar.com",
        "dyaccountmgt.platform-loreal.cn": "https://dyaccountmgt-api.platform-loreal.cn",
        "dyaccountmgt-uat.platform-loreal.cn": "https://dyaccountmgt-uat-api.platform-loreal.cn",
    };

    // 第一个按钮
    addButton(
        "✨Copy Token",
        "复制环境Authorization",
        "position: fixed;left:10px;bottom:10px;z-index:9999;border-radius: 12px;border:none; font-size: 20px; font-weight: 900; color: dodgerblue; cursor: pointer;line-height: 20px;padding: 10px;",
        function () {
            getTokenContent('token');
        },
        "copy-button"
    );

    // 第二个按钮
    addButton(
        "🚀Authorization Login",
        "使用Authorization登录\n由于【star_chart_auths】字段的不确定性\n请星图相关测试人员不要使用次方法登录",
        "position: fixed; bottom: 20px; right: 20px; z-index: 9999; border-radius: 12px;border:none; font-size: 20px; font-weight: 900; color: dodgerblue; cursor: pointer;line-height: 20px;padding: 10px;",
        function () {
            const input = prompt("请输入Authorization值: ", "");
            if (input === null || input === "") {
                return;
            }
            checkToken(input)
                .then((result) => {
                log("user check", result);
                if (result) {
                    showPopup("hook 成功!", 3000);
                    hookCookie(input, result);
                } else {
                    showPopup("请确认ck可用性!", 3000);
                    return;
                }
            })
                .catch((error) => console.error(error));
        },
        "fast-login"
    );
    checkBtn(window.location.href)

    startTimer(remainingTime);



    intervalId2 = setInterval(function () {
        // 定义事件类型数组
        // const eventTypes = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
        const eventTypes = ["touchstart"];
        for (let eventType of eventTypes) {
            window.removeEventListener(eventType, resetTimer);
            window.addEventListener(eventType, resetTimer);
        }
        let currentUrl = window.location.href;
        checkBtn(currentUrl);
        setTimeout(function () {
            if (currentUrl !== window.location.href) {
                currentUrl = window.location.href;
                resetTimer();
            }
        }, 5000)
    }, 1000);//1s 检测一次URl

    /**
     * 复制内容至剪切板
     * @param {*} text 
     */
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
            console.log('Text copied to clipboard: ' + text);
        })
            .catch(err => {
            console.error('Unable to copy text to clipboard: ', err);
        });
    }
    /**
     * 获取localStorage内容
     * @param {String} arg
     */
    function getTokenContent(arg) {
        const token = localStorage.getItem(arg);
        if (token) {
            copyToClipboard(token);
            showPopup(`已复制${arg}至剪切板`, 1500);
        } else {
            showPopup(`localStorage中未找到${arg}`, 2000);
        }
    }

    function setDisplay(button_id, value) {
        var button = document.getElementById(button_id);
        button.style.display = value;
        // log("已设置", button_id, button.style.display)
    }
    function addButton(text, title, position, clickHandler, id) {
        // 检查是否已经存在具有相同id的按钮
        if (id && document.getElementById(id)) {
            return; // 如果存在相同id的按钮，则不添加
        }

        var button = document.createElement("button");
        button.innerText = text;
        button.title = title;
        button.style.cssText = position;

        button.addEventListener("mouseover", function () {
            this.style.backgroundColor = "dodgerblue";
            this.style.color = "#fff";
        });

        button.addEventListener("mouseout", function () {
            this.style.backgroundColor = "";
            this.style.color = "dodgerblue";
        });

        button.addEventListener("click", clickHandler);

        if (id) {
            button.id = id; // 设置按钮的id
        }

        document.body.appendChild(button);
    }

    function checkBtn(currentUrl) {
        // log("start check url...")
        if (loginUrls.includes(currentUrl)) {
            setDisplay("fast-login", "")
            setDisplay("copy-button", "none")
        } else {
            setDisplay("fast-login", "none")
            setDisplay("copy-button", "")
        }
    }



    /**
     * 生成当前时间的时间戳
     * @returns {string} - 格式为 '2023-09-26 17:45:25' 的时间戳
     */
    function generateTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * hook登录
     * @param {String} cookie 已经注册的cookie
     * @returns
     */
    async function hookCookie(cookie) {
        try {
            var data = await getInfo(cookie,SERVER_HOST);

            for (var key in data) {
                if (key === "token") {
                    // 直接存储cookie值，不需要转换为JSON字符串
                    localStorage.setItem(key, cookie);
                } else {
                    //                    console.log(key, typeof data[key]);
                    let patch
                    if(typeof data[key]!=='string'){// 只有当data[key]不是字符串时，才需要转换为JSON字符串
                        patch = JSON.stringify(data[key]);
                    }
                    else
                    {
                        patch = data[key];
                    }
                    //console.log(key, typeof patch,patch);
                    localStorage.setItem(key, patch);
                }
            }

            console.log("hook成功！");
            setTimeout(function () {
                window.location.href = `/douyinmanage/manage/list`;
            }, 2000);
            return 0;
        } catch (e) {
            console.log("hook失败", e);
            return 1;
        }
    }



    async function getInfo(cookie,SERVER_HOST) {
        const response = await fetch(`${SERVER_HOST}/getInfo`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'token': cookie
            })
        });
        const data = await response.json();
        return data;
    }


    /**
     * 验证tk可用性
     * @param {String} cookie
     * @returns
     */
    function checkToken(cookie) {
        return new Promise((resolve, reject) => {
            const thost = map[host];
            const apiUrl = `${thost}/admin/account/userinfo?dy_id=0`;
            log("检查可用性api:", apiUrl);
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: cookie,
                    "Sec-Fetch-Site": "cross-site",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                if (data.data.username) {
                    log(
                        data.data.username,
                        data.data.id,
                        data.data.dy_group_id,
                        data.data.parent_id
                    );
                } else {
                    log("暂未获取到用户信息！");
                }
                const message = data.message;
                if (message === "登录失效") {
                    resolve(false);
                } else {
                    resolve({
                        id: data.data.id,
                        dy_group_id: data.data.dy_group_id,
                        parent_id: data.data.parent_id,
                        userName: data.data.username,
                        name: data.data.name,
                    });
                }
            })
                .catch((error) => reject(error));
        });
    }

    // 定义刷新函数
    function refreshPage() {
        // location.reload();
        checkToken(localStorage.getItem("token"))
            .then((result) => {
            if (result.userName) {
                log("刷新页面，执行续命!");
                showPopup("续命成功!", 2000);
            } else {
                log("续命失败!");
                showPopup("续命失败!,请手动刷新页面检查tk状态", 2000);
            }
        })
            .catch((error) => console.error(error));
        log("刷新页面,续命tk");
    }

    // 定义重置计时函数
    function resetTimer() {
        // log("you do reset")
        clearInterval(intervalId1)
        startTimer(10);
    }

    function startTimer(remainingTime) {
        log(`开始执行-剩余时间：${remainingTime} (分钟)`);
        intervalId1 = setInterval(function () {
            if (remainingTime <= 0) {
                refreshPage();
                resetTimer(); //续命成功后重置计时器
            }
            remainingTime -= 1;
            log(`剩余时间：${remainingTime} (分钟)`);
        }, 60 * 1000);
    }



    /**
     * 提示hook状态
     * @param {String} message
     * @param {Int16Array} duration
     */
    function showPopup(message, duration) {
        setTimeout(function () {
            var popup = document.createElement("div");
            popup.innerHTML = message;
            popup.style.cssText =
                "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:15px; border:none;border-radius: 12px; font-size:32px;font-weight: 700;color:#f50000; box-shadow: 0px 1px 20px 0px #6b6b6b;z-index:9999; word-wrap: break-word; white-space: pre-wrap;";
            document.body.appendChild(popup);
            setTimeout(function () {
                popup.parentNode.removeChild(popup);
            }, duration);
        });
    }
})();
