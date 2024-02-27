// ==UserScript==
// @name         ✨Hook.DNY-SCRM-通过Authorization登录✨
// @namespace    fansir
// @author       fansir
// @version      0.9.4
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
  var url = window.location.href;
  var host = window.location.host;
  var protocol = window.location.protocol;
  var isIdle = false;
  var remainingTime = 10; // 初始剩余时间为 10 分钟
  var loginUrls = [
    "https://t-douyinscrm.tarsocial.com/s/login",
    "https://dyaccountmgt.platform-loreal.cn/s/login",
    "https://dyaccountmgt-uat.platform-loreal.cn/s/login",
  ];
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

  const button = document.createElement('button');
    button.innerText = '✨Copy Token';
    button.title = "复制环境Authorization";
    button.style.cssText = "position: fixed;left:10px;bottom:10px;z-index:9999;border-radius: 12px;border:none; font-size: 20px; font-weight: 900; color: dodgerblue; cursor: pointer;line-height: 20px;padding: 10px;";
    //闭包调用
    button.addEventListener('click', function(){
      getTokenContent('token')
    });
    button.addEventListener("mouseover", function () {
      this.style.backgroundColor = "dodgerblue";
      this.style.color = "#fff";
    });

    button.addEventListener("mouseout", function () {
      this.style.backgroundColor = "";
      this.style.color = "dodgerblue";
    });
    document.body.appendChild(button);



  var map = {
    "t-douyinscrm.tarsocial.com": "https://t-apidouyinscrm.aisuperstar.com",
    "dyaccountmgt.platform-loreal.cn":
      "https://dyaccountmgt-api.platform-loreal.cn",
    "dyaccountmgt-uat.platform-loreal.cn":
      "https://dyaccountmgt-uat-api.platform-loreal.cn",
  };

  var log = console.log;
  log(url, host, protocol);
  if (loginUrls.includes(url)) {
    // 创建按钮元素
    const button = document.createElement("button");
    button.innerText = "🚀Authorization Login";
    button.title = "使用Authorization登录";
    button.style.cssText =
      "position: fixed; bottom: 20px; right: 20px; z-index: 9999; border-radius: 12px;border:none; font-size: 20px; font-weight: 900; color: dodgerblue; cursor: pointer;line-height: 20px;padding: 10px;";
    button.addEventListener("mouseover", function () {
      this.style.backgroundColor = "dodgerblue";
      this.style.color = "#fff";
    });

    button.addEventListener("mouseout", function () {
      this.style.backgroundColor = "";
      this.style.color = "dodgerblue";
    });

    // 添加点击事件处理程序
    button.addEventListener("click", function () {
      // 弹出输入框
      const input = prompt("请输入Authorization值: ", "");

      // 如果用户点击了取消按钮或者没有输入任何值，则不执行任何操作
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
    });

    // 将按钮添加到页面中
    document.body.appendChild(button);
  } else {
    // 初始化计时器
    startTimer();
    
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
  function hookCookie(cookie, result) {
    var data = {
      userInfo: `{
"id":${result.id},
"group_id":${result.dy_group_id},
"parent_id":${result.parent_id},
"username":"${result.userName}",
"name":"${result.name}",
"client_id":1,
"mobile_bind_status":1,
"mobile":"V9rQjNg6E7AzO4j++Nr2VA==",
"email":"${result.userName}@tarsocial.com",
"nickname":"tk登录专享昵称",
"avatar":null,
"remark":"",
"openid":null,
"unionid":null,
"is_read_only":2,
"is_super_admin":0,
"is_open_data_page":1,
"is_open_dsjt":2,
"dy_group_id":"${result.dy_group_id}",
"last_login":"${generateTimestamp()}",
"status":1,
"scan_code_key":null,
"email_status":1,
"email_at":null,
"ga_secret":"GSJMN6PZ5FNU6Y4N",
"ga_qr_code":"https://api.qrserver.com/v1/create-qr-code/?data=otpauth%3A%2F%2Ftotp%2F${result.userName}%40tarsocial.com%3Fsecret%3DGSJMN6PZ5FNU6Y4N%26issuer%3Ddouyin_scrm&size=200x200&ecc=M",
"qw_name":"${result.userName}",
"qw_avatar":"https://wework.qpic.cn/wwpic/990859_5cKW1UztQWSnr8K_1671592178/0","qw_status":1,
"created_at":"2022-08-16T03:33:00.000000Z",
"updated_at":"2023-09-26T09:45:25.000000Z",
"email_password_error_count":0,
"mobile_password_error_count":0,
"email_password_error_final_time":null,
"mobile_password_error_final_time":null,
"send_msg_code_count":0,
"send_email_code_count":0,
"is_lock":0,
"user_auths":[{"key":68,"pid":0,"auth_name":"应用管理","level":1,"path":"/application","is_menu":1,"sort":1,"type":"2","is_show":1},{"key":69,"pid":0,"auth_name":"账号管理","level":1,"path":"/douyinaccount/manage/list","is_menu":1,"sort":2,"type":"2","is_show":1},{"key":70,"pid":0,"auth_name":"电商大盘","level":1,"path":"/commerceBoard","is_menu":1,"sort":3,"type":"1","is_show":1,"child":[{"key":80,"pid":70,"auth_name":"市场大盘","level":1,"path":"/commerceBoard/marketBoard","is_menu":1,"sort":0,"type":"1","is_show":1},{"key":81,"pid":70,"auth_name":"市场竞争1","level":1,"path":"/commerceBoard/marketCompete","is_menu":1,"sort":0,"type":"1","is_show":1}]},{"key":71,"pid":0,"auth_name":"集团生意","level":1,"path":"/groupBusiness","is_menu":1,"sort":4,"type":"1","is_show":1,"child":[{"key":82,"pid":71,"auth_name":"生意概况","level":1,"path":"/groupBusiness/businessSituation","is_menu":1,"sort":0,"type":"1","is_show":1},{"key":83,"pid":71,"auth_name":"店播概况1","level":1,"path":"/groupBusiness/storeSituation","is_menu":1,"sort":0,"type":"1","is_show":1},{"key":84,"pid":71,"auth_name":"达播概况","level":1,"path":"/groupBusiness/generalSituation","is_menu":1,"sort":0,"type":"1","is_show":1}]},{"key":77,"pid":0,"auth_name":"蓝V详情","level":1,"path":"/douyinmanage/manage/list","is_menu":1,"sort":6,"type":"2","is_show":1},{"key":72,"pid":0,"auth_name":"内容 & KOL生态洞察","level":1,"path":"/douyinoverview","is_menu":1,"sort":7,"type":"1","is_show":1,"child":[{"key":60,"pid":72,"auth_name":"短视频内容洞察","level":2,"path":"/contentTracker/short/list","is_menu":1,"sort":1,"type":"1","is_show":1},{"key":88,"pid":72,"auth_name":"达人招新评估","level":2,"path":"/corp","is_menu":1,"sort":5,"type":"1","is_show":1,"child":[{"key":90,"pid":88,"auth_name":"作品列表","level":3,"path":"/corp/worksList/list","is_menu":1,"sort":3,"type":"1","is_show":1},{"key":95,"pid":88,"auth_name":"集团/事业部投放总览","level":3,"path":"/corp/startVideo/groupBoard","is_menu":1,"sort":4,"type":"1","is_show":1},{"key":94,"pid":88,"auth_name":"品牌投放总览","level":3,"path":"/corp/startVideo/brandBoard","is_menu":1,"sort":7,"type":"1","is_show":1}]},{"key":57,"pid":72,"auth_name":"种草达人榜单","level":2,"path":"/contentTracker/socialKOL/list","is_menu":1,"sort":18,"type":"1","is_show":1},{"key":96,"pid":72,"auth_name":"直播复盘王","level":2,"path":"/contentTracker/LiveReplayKing","is_menu":1,"sort":21,"type":"1","is_show":1},{"key":58,"pid":72,"auth_name":"直播达人榜单","level":2,"path":"/contentTracker/livestream/list","is_menu":1,"sort":25,"type":"1","is_show":1},{"key":59,"pid":72,"auth_name":"热点话题追踪","level":2,"path":"/contentTracker/hotTopic/chart","is_menu":1,"sort":30,"type":"1","is_show":1},{"key":73,"pid":72,"auth_name":"集团蓝v榜","level":2,"path":"/douyinoverview/rank","is_menu":1,"sort":35,"type":"1","is_show":1},{"key":74,"pid":72,"auth_name":"集团蓝v总览","level":2,"path":"/douyinoverview/overview","is_menu":1,"sort":40,"type":"1","is_show":1}]},{"key":75,"pid":0,"auth_name":"媒体投放","level":1,"path":"/mediadelivery","is_menu":1,"sort":9,"type":"1","is_show":1,"child":[{"key":78,"pid":75,"auth_name":"信息流广告总览","level":2,"path":"/mediadelivery/rtb","is_menu":1,"sort":5,"type":"1","is_show":1},{"key":85,"pid":75,"auth_name":"集团千川","level":2,"path":"/mediadelivery/board","is_menu":1,"sort":6,"type":"1","is_show":1},{"key":87,"pid":75,"auth_name":"5A资产看板","level":2,"path":"/mediadelivery/populationAnalysis5A","is_menu":1,"sort":7,"type":"1","is_show":1}]},{"key":76,"pid":0,"auth_name":"我的账号","level":1,"path":"/douyinuser/userinfo","is_menu":1,"sort":11,"type":"2","is_show":1}],
"menu_auths":[{"menu_id":60,"is_read_only":2,"is_export":1,"path":"/contentTracker/short/list","router":"","read_router_list":["bo/video_overview/update_short_video","bo/video_overview/del_short_video"],"export_router_list":[""]},{"menu_id":73,"is_read_only":1,"is_export":1,"path":"/douyinoverview/rank","router":"admin/dy_account/fans_rank,admin/dy_account/data,admin/dy_account/my_groups,admin/dy_account/composition_rank,admin/dy_account/fansexport,admin/dy_account/compositionexport,,admin/dy_account/operate_rank","read_router_list":[],"export_router_list":["admin/dy_account/compositionexport"]},{"menu_id":78,"is_read_only":1,"is_export":1,"path":"/mediadelivery/rtb","router":"","read_router_list":[],"export_router_list":["bo/rtb/tmall/export_rtb_jt"]},{"menu_id":85,"is_read_only":1,"is_export":1,"path":"/mediadelivery/board","router":"","read_router_list":[],"export_router_list":[""]},{"menu_id":89,"is_read_only":1,"is_export":1,"path":"/corp/dailyData/detail","router":"","read_router_list":[],"export_router_list":[null]},{"menu_id":90,"is_read_only":1,"is_export":1,"path":"/corp/worksList/list","router":"","read_router_list":[],"export_router_list":[null]}]
}`,
      isMobile: "false",
      logType: "COMMON",
      theme: "light",
      dyid: "0",
      retry: "0",
      user_auths:
        '[{"key":68,"pid":0,"auth_name":"应用管理","level":1,"path":"/application","is_menu":1,"sort":1,"type":"2","is_show":1},{"key":69,"pid":0,"auth_name":"账号管理","level":1,"path":"/douyinaccount/manage/list","is_menu":1,"sort":2,"type":"2","is_show":1},{"key":70,"pid":0,"auth_name":"电商大盘","level":1,"path":"/commerceBoard","is_menu":1,"sort":3,"type":"1","is_show":1,"child":[{"key":80,"pid":70,"auth_name":"市场大盘","level":1,"path":"/commerceBoard/marketBoard","is_menu":1,"sort":0,"type":"1","is_show":1},{"key":81,"pid":70,"auth_name":"市场竞争1","level":1,"path":"/commerceBoard/marketCompete","is_menu":1,"sort":0,"type":"1","is_show":1}]},{"key":71,"pid":0,"auth_name":"集团生意","level":1,"path":"/groupBusiness","is_menu":1,"sort":4,"type":"1","is_show":1,"child":[{"key":82,"pid":71,"auth_name":"生意概况","level":1,"path":"/groupBusiness/businessSituation","is_menu":1,"sort":0,"type":"1","is_show":1},{"key":83,"pid":71,"auth_name":"店播概况1","level":1,"path":"/groupBusiness/storeSituation","is_menu":1,"sort":0,"type":"1","is_show":1},{"key":84,"pid":71,"auth_name":"达播概况","level":1,"path":"/groupBusiness/generalSituation","is_menu":1,"sort":0,"type":"1","is_show":1}]},{"key":77,"pid":0,"auth_name":"蓝V详情","level":1,"path":"/douyinmanage/manage/list","is_menu":1,"sort":6,"type":"2","is_show":1},{"key":72,"pid":0,"auth_name":"内容 & KOL生态洞察","level":1,"path":"/douyinoverview","is_menu":1,"sort":7,"type":"1","is_show":1,"child":[{"key":60,"pid":72,"auth_name":"短视频内容洞察","level":2,"path":"/contentTracker/short/list","is_menu":1,"sort":1,"type":"1","is_show":1},{"key":88,"pid":72,"auth_name":"达人招新评估","level":2,"path":"/corp","is_menu":1,"sort":5,"type":"1","is_show":1,"child":[{"key":90,"pid":88,"auth_name":"作品列表","level":3,"path":"/corp/worksList/list","is_menu":1,"sort":3,"type":"1","is_show":1},{"key":95,"pid":88,"auth_name":"集团/事业部投放总览","level":3,"path":"/corp/startVideo/groupBoard","is_menu":1,"sort":4,"type":"1","is_show":1},{"key":94,"pid":88,"auth_name":"品牌投放总览","level":3,"path":"/corp/startVideo/brandBoard","is_menu":1,"sort":7,"type":"1","is_show":1}]},{"key":57,"pid":72,"auth_name":"种草达人榜单","level":2,"path":"/contentTracker/socialKOL/list","is_menu":1,"sort":18,"type":"1","is_show":1},{"key":96,"pid":72,"auth_name":"直播复盘王","level":2,"path":"/contentTracker/LiveReplayKing","is_menu":1,"sort":21,"type":"1","is_show":1},{"key":58,"pid":72,"auth_name":"直播达人榜单","level":2,"path":"/contentTracker/livestream/list","is_menu":1,"sort":25,"type":"1","is_show":1},{"key":59,"pid":72,"auth_name":"热点话题追踪","level":2,"path":"/contentTracker/hotTopic/chart","is_menu":1,"sort":30,"type":"1","is_show":1},{"key":73,"pid":72,"auth_name":"集团蓝v榜","level":2,"path":"/douyinoverview/rank","is_menu":1,"sort":35,"type":"1","is_show":1},{"key":74,"pid":72,"auth_name":"集团蓝v总览","level":2,"path":"/douyinoverview/overview","is_menu":1,"sort":40,"type":"1","is_show":1}]},{"key":75,"pid":0,"auth_name":"媒体投放","level":1,"path":"/mediadelivery","is_menu":1,"sort":9,"type":"1","is_show":1,"child":[{"key":78,"pid":75,"auth_name":"信息流广告总览","level":2,"path":"/mediadelivery/rtb","is_menu":1,"sort":5,"type":"1","is_show":1},{"key":85,"pid":75,"auth_name":"集团千川","level":2,"path":"/mediadelivery/board","is_menu":1,"sort":6,"type":"1","is_show":1},{"key":87,"pid":75,"auth_name":"5A资产看板","level":2,"path":"/mediadelivery/populationAnalysis5A","is_menu":1,"sort":7,"type":"1","is_show":1}]},{"key":76,"pid":0,"auth_name":"我的账号","level":1,"path":"/douyinuser/userinfo","is_menu":1,"sort":11,"type":"2","is_show":1}]',
      AuthsData:
        '[{"auth_name":"应用管理","path":"/application","level":1},{"auth_name":"账号管理","path":"/douyinaccount/manage/list","level":1},{"auth_name":"电商大盘","path":"/douyinplatform/market","level":1},{"auth_name":"集团生意","path":"/grouppf/groupBusiness","level":1},{"auth_name":"蓝V详情","path":"/douyinmanage/manage/list","level":1},{"auth_name":"内容热点","path":"/douyinoverview","level":1,"child":[{"auth_name":"集团蓝v榜","path":"/douyinoverview/rank","level":2,"is_menu":1},{"auth_name":"集团蓝v总览","path":"/douyinoverview/overview","level":2,"is_menu":1}]},{"auth_name":"媒体投放","path":"/douyinoverview/paid","level":1},{"auth_name":"我的账号","path":"/douyinuser/userinfo","level":1}]',
      menuData:
        '[{"auth_name":"应用管理","path":"/application","level":1},{"auth_name":"账号管理","path":"/douyinaccount/manage/list","level":1},{"auth_name":"电商大盘","path":"/douyinplatform/market","level":1},{"auth_name":"集团生意","path":"/grouppf/groupBusiness","level":1},{"auth_name":"蓝V详情","path":"/douyinmanage/manage/list","level":1},{"auth_name":"内容热点","path":"/douyinoverview","level":1,"child":[{"auth_name":"集团蓝v榜","path":"/douyinoverview/rank","level":2,"is_menu":1},{"auth_name":"集团蓝v总览","path":"/douyinoverview/overview","level":2,"is_menu":1}]},{"auth_name":"媒体投放","path":"/douyinoverview/paid","level":1},{"auth_name":"我的账号","path":"/douyinuser/userinfo","level":1}]',
      clickMemu: "蓝V详情",
      token: "",
    };

    try {
      for (var key in data) {
        if (key === "token") {
          data[key] = cookie;
        }
        localStorage.setItem(key, data[key]);
      }
      log("hook成功！");
      // 等待两秒
      setTimeout(function () {
        window.location.href = `/douyinmanage/manage/list`;
      }, 2000);
      return 0;
    } catch (e) {
      log("hook失败", e);
      return 1;
    }
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
          log("续命成功!");
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
    remainingTime = 10;
    log("计时器已重置");
    if (isIdle) {
      isIdle = false;
      startTimer();
    }
  }

  function startTimer() {
    const intervalId = setInterval(function () {
      remainingTime--;
      log(`剩余时间：${remainingTime} 分钟`);
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        isIdle = true;
        refreshPage();
        resetTimer(); //续命成功后重置计时器
      }
    }, 60 * 1000);

    // 定义事件类型数组
    // const eventTypes = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
    const eventTypes = ["keydown", "touchstart"];
    for (let eventType of eventTypes) {
      window.removeEventListener(eventType, resetTimer);
      window.addEventListener(eventType, resetTimer);
    }

    let currentUrl = window.location.href;
    const urlCheckIntervalId = setInterval(function () {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        log("监测到url变化!!");
        resetTimer();
      } else {
        // log("未监测到url变化...");
      }
    }, 10 * 1000);
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
