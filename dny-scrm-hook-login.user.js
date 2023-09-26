// ==UserScript==
// @name         ✨Hook.DNY-SCRM-通过Authorization登录✨
// @namespace    fansir
// @author       fansir
// @version      0.7
// @description  使用🚀Authorization🚀登录DNY-SCRM
// @author       Fansirliu
// @match        https://dyaccountmgt.platform-loreal.cn/*
// @match        https://dyaccountmgt-uat.platform-loreal.cn/*
// @match        https://t-douyinscrm.tarsocial.com/*
// @icon         https://www.lorealparis.com.cn/favicon.ico
// @grant        none
// @license      MIT
// ==/UserScript==
//去除不必要的注释-version      0.6.1
//优化刷新页面的逻辑,检测到用户点击等操作时,重置续命计时器,优化hook提示-version      0.6
//修复因账号id固定导致的访问蓝v号提示账号不存在的问题-version      0.5
//更名,调整按钮样式-version      0.4
(function () {
	("use strict");
	var url = window.location.href;
	var host = window.location.host;
	var protocol = window.location.protocol;
	var isIdle = false;
	var remainingTime = 10; // 初始剩余时间为 10 分钟
	var loginUrls = ["https://t-douyinscrm.tarsocial.com/s/login", "https://dyaccountmgt.platform-loreal.cn/s/login", "https://dyaccountmgt-uat.platform-loreal.cn/s/login"];
	var map = {
		"t-douyinscrm.tarsocial.com": "https://t-apidouyinscrm.aisuperstar.com",
		"dyaccountmgt.platform-loreal.cn": "https://dyaccountmgt-api.platform-loreal.cn",
		"dyaccountmgt-uat.platform-loreal.cn": "https://dyaccountmgt-uat-api.platform-loreal.cn",
	};

	var log = console.log;
	log(url, host, protocol);
	if (loginUrls.includes(url)) {
		// 创建按钮元素
		const button = document.createElement("button");
		button.innerText = "🚀Authorization Login";
		button.title = "使用Authorization登录";
		button.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 9999; border-radius: 12px;border:none; font-size: 20px; font-weight: 900; color: dodgerblue; cursor: pointer;line-height: 20px;padding: 10px;";

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
			const input = prompt("请输入Authorization值：", "");

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
	}

	/**
	 * hook登录
	 * @param {String} cookie 已经注册的cookie
	 * @param {String} userName ck获取到的用户名
	 * @returns
	 */
	function hookCookie(cookie, result) {
		const data = `{"userInfo":"{\\"id\\":${result.id},\\"group_id\\":${result.dy_group_id},\\"parent_id\\":${result.parent_id},\\"username\\":\\"${result.userName}\\",\\"name\\":\\"Authorization特供超管\\",\\"client_id\\":1,\\"mobile\\":\\"KAEep4VmDvIYOQ+M9PXffg==\\",\\"email\\":\\"${result.userName}@loreal.com\\",\\"nickname\\":null,\\"avatar\\":null,\\"remark\\":\\"\\",\\"openid\\":null,\\"unionid\\":null,\\"is_read_only\\":2,\\"is_super_admin\\":0,\\"is_open_data_page\\":1,\\"is_open_dsjt\\":2,\\"dy_group_id\\":\\"0\\",\\"last_login\\":\\"2023-12-32 02:08:25\\",\\"status\\":1,\\"scan_code_key\\":null,\\"email_status\\":1,\\"email_at\\":null,\\"ga_secret\\":\\"\\",\\"ga_qr_code\\":\\"\\",\\"created_at\\":\\"2023-02-06T06:17:02.000000Z\\",\\"updated_at\\":\\"2023-12-32T18:08:25.000000Z\\",\\"mobile_bind_status\\":1,\\"qw_name\\":null,\\"qw_avatar\\":null,\\"qw_status\\":2,\\"user_auths\\":[{\\"key\\":68,\\"pid\\":0,\\"auth_name\\":\\"应用管理\\",\\"level\\":1,\\"path\\":\\"/application\\",\\"is_menu\\":1,\\"sort\\":1,\\"type\\":\\"2\\",\\"is_show\\":1},{\\"key\\":69,\\"pid\\":0,\\"auth_name\\":\\"账号管理\\",\\"level\\":1,\\"path\\":\\"/douyinaccount/manage/list\\",\\"is_menu\\":1,\\"sort\\":2,\\"type\\":\\"2\\",\\"is_show\\":1},{\\"key\\":70,\\"pid\\":0,\\"auth_name\\":\\"电商大盘\\",\\"level\\":1,\\"path\\":\\"/commerceBoard\\",\\"is_menu\\":1,\\"sort\\":3,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":80,\\"pid\\":70,\\"auth_name\\":\\"市场大盘\\",\\"level\\":1,\\"path\\":\\"/commerceBoard/marketBoard\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":81,\\"pid\\":70,\\"auth_name\\":\\"市场竞争1\\",\\"level\\":1,\\"path\\":\\"/commerceBoard/marketCompete\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":71,\\"pid\\":0,\\"auth_name\\":\\"集团生意\\",\\"level\\":1,\\"path\\":\\"/groupBusiness\\",\\"is_menu\\":1,\\"sort\\":4,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":82,\\"pid\\":71,\\"auth_name\\":\\"生意概况\\",\\"level\\":1,\\"path\\":\\"/groupBusiness/businessSituation\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":83,\\"pid\\":71,\\"auth_name\\":\\"店播概况1\\",\\"level\\":1,\\"path\\":\\"/groupBusiness/storeSituation\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":84,\\"pid\\":71,\\"auth_name\\":\\"达播概况\\",\\"level\\":1,\\"path\\":\\"/groupBusiness/generalSituation\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":77,\\"pid\\":0,\\"auth_name\\":\\"蓝V详情\\",\\"level\\":1,\\"path\\":\\"/douyinmanage/manage/list\\",\\"is_menu\\":1,\\"sort\\":6,\\"type\\":\\"2\\",\\"is_show\\":1},{\\"key\\":72,\\"pid\\":0,\\"auth_name\\":\\"内容 & KOL生态洞察\\",\\"level\\":1,\\"path\\":\\"/douyinoverview\\",\\"is_menu\\":1,\\"sort\\":7,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":60,\\"pid\\":72,\\"auth_name\\":\\"短视频内容洞察\\",\\"level\\":2,\\"path\\":\\"/contentTracker/short/list\\",\\"is_menu\\":1,\\"sort\\":1,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":57,\\"pid\\":72,\\"auth_name\\":\\"内容种草KOL榜单\\",\\"level\\":2,\\"path\\":\\"/contentTracker/socialKOL/list\\",\\"is_menu\\":1,\\"sort\\":2,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":58,\\"pid\\":72,\\"auth_name\\":\\"直播带货KOL榜单\\",\\"level\\":2,\\"path\\":\\"/contentTracker/livestream/list\\",\\"is_menu\\":1,\\"sort\\":3,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":59,\\"pid\\":72,\\"auth_name\\":\\"热点话题追踪\\",\\"level\\":2,\\"path\\":\\"/contentTracker/hotTopic/chart\\",\\"is_menu\\":1,\\"sort\\":4,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":73,\\"pid\\":72,\\"auth_name\\":\\"集团蓝v榜\\",\\"level\\":2,\\"path\\":\\"/douyinoverview/rank\\",\\"is_menu\\":1,\\"sort\\":7,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":74,\\"pid\\":72,\\"auth_name\\":\\"集团蓝v总览\\",\\"level\\":2,\\"path\\":\\"/douyinoverview/overview\\",\\"is_menu\\":1,\\"sort\\":8,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":75,\\"pid\\":0,\\"auth_name\\":\\"媒体投放\\",\\"level\\":1,\\"path\\":\\"/mediadelivery\\",\\"is_menu\\":1,\\"sort\\":9,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":78,\\"pid\\":75,\\"auth_name\\":\\"信息流广告总览\\",\\"level\\":2,\\"path\\":\\"/mediadelivery/rtb\\",\\"is_menu\\":1,\\"sort\\":5,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":85,\\"pid\\":75,\\"auth_name\\":\\"集团千川\\",\\"level\\":2,\\"path\\":\\"/mediadelivery/board\\",\\"is_menu\\":1,\\"sort\\":6,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":76,\\"pid\\":0,\\"auth_name\\":\\"我的账号\\",\\"level\\":1,\\"path\\":\\"/douyinuser/userinfo\\",\\"is_menu\\":1,\\"sort\\":10,\\"type\\":\\"2\\",\\"is_show\\":1}],\\"email_password_error_count\\":0,\\"mobile_password_error_count\\":0,\\"email_password_error_final_time\\":null,\\"mobile_password_error_final_time\\":null,\\"send_msg_code_count\\":0,\\"send_email_code_count\\":0,\\"is_lock\\":0,\\"menu_auths\\":[{\\"menu_id\\":60,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/contentTracker/short/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"\\"]},{\\"menu_id\\":73,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/douyinoverview/rank\\",\\"router\\":\\"admin/dy_account/fans_rank,admin/dy_account/data,admin/dy_account/my_groups,admin/dy_account/composition_rank,admin/dy_account/fansexport,admin/dy_account/compositionexport,,admin/dy_account/operate_rank\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/dy_account/compositionexport\\"]},{\\"menu_id\\":78,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/mediadelivery/rtb\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"bo/rtb/tmall/export_rtb_jt\\"]},{\\"menu_id\\":85,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/mediadelivery/board\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"\\"]}]}","isMobile":"false","theme":"black","dyid":"0","retry":"0","user_auths":"[{\\"key\\":68,\\"pid\\":0,\\"auth_name\\":\\"应用管理\\",\\"level\\":1,\\"path\\":\\"/application\\",\\"is_menu\\":1,\\"sort\\":1,\\"type\\":\\"2\\",\\"is_show\\":1},{\\"key\\":69,\\"pid\\":0,\\"auth_name\\":\\"账号管理\\",\\"level\\":1,\\"path\\":\\"/douyinaccount/manage/list\\",\\"is_menu\\":1,\\"sort\\":2,\\"type\\":\\"2\\",\\"is_show\\":1},{\\"key\\":70,\\"pid\\":0,\\"auth_name\\":\\"电商大盘\\",\\"level\\":1,\\"path\\":\\"/commerceBoard\\",\\"is_menu\\":1,\\"sort\\":3,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":80,\\"pid\\":70,\\"auth_name\\":\\"市场大盘\\",\\"level\\":1,\\"path\\":\\"/commerceBoard/marketBoard\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":81,\\"pid\\":70,\\"auth_name\\":\\"市场竞争1\\",\\"level\\":1,\\"path\\":\\"/commerceBoard/marketCompete\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":71,\\"pid\\":0,\\"auth_name\\":\\"集团生意\\",\\"level\\":1,\\"path\\":\\"/groupBusiness\\",\\"is_menu\\":1,\\"sort\\":4,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":82,\\"pid\\":71,\\"auth_name\\":\\"生意概况\\",\\"level\\":1,\\"path\\":\\"/groupBusiness/businessSituation\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":83,\\"pid\\":71,\\"auth_name\\":\\"店播概况1\\",\\"level\\":1,\\"path\\":\\"/groupBusiness/storeSituation\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":84,\\"pid\\":71,\\"auth_name\\":\\"达播概况\\",\\"level\\":1,\\"path\\":\\"/groupBusiness/generalSituation\\",\\"is_menu\\":1,\\"sort\\":0,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":77,\\"pid\\":0,\\"auth_name\\":\\"蓝V详情\\",\\"level\\":1,\\"path\\":\\"/douyinmanage/manage/list\\",\\"is_menu\\":1,\\"sort\\":6,\\"type\\":\\"2\\",\\"is_show\\":1},{\\"key\\":72,\\"pid\\":0,\\"auth_name\\":\\"内容 & KOL生态洞察\\",\\"level\\":1,\\"path\\":\\"/douyinoverview\\",\\"is_menu\\":1,\\"sort\\":7,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":60,\\"pid\\":72,\\"auth_name\\":\\"短视频内容洞察\\",\\"level\\":2,\\"path\\":\\"/contentTracker/short/list\\",\\"is_menu\\":1,\\"sort\\":1,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":57,\\"pid\\":72,\\"auth_name\\":\\"内容种草KOL榜单\\",\\"level\\":2,\\"path\\":\\"/contentTracker/socialKOL/list\\",\\"is_menu\\":1,\\"sort\\":2,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":58,\\"pid\\":72,\\"auth_name\\":\\"直播带货KOL榜单\\",\\"level\\":2,\\"path\\":\\"/contentTracker/livestream/list\\",\\"is_menu\\":1,\\"sort\\":3,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":59,\\"pid\\":72,\\"auth_name\\":\\"热点话题追踪\\",\\"level\\":2,\\"path\\":\\"/contentTracker/hotTopic/chart\\",\\"is_menu\\":1,\\"sort\\":4,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":73,\\"pid\\":72,\\"auth_name\\":\\"集团蓝v榜\\",\\"level\\":2,\\"path\\":\\"/douyinoverview/rank\\",\\"is_menu\\":1,\\"sort\\":7,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":74,\\"pid\\":72,\\"auth_name\\":\\"集团蓝v总览\\",\\"level\\":2,\\"path\\":\\"/douyinoverview/overview\\",\\"is_menu\\":1,\\"sort\\":8,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":75,\\"pid\\":0,\\"auth_name\\":\\"媒体投放\\",\\"level\\":1,\\"path\\":\\"/mediadelivery\\",\\"is_menu\\":1,\\"sort\\":9,\\"type\\":\\"1\\",\\"is_show\\":1,\\"child\\":[{\\"key\\":78,\\"pid\\":75,\\"auth_name\\":\\"信息流广告总览\\",\\"level\\":2,\\"path\\":\\"/mediadelivery/rtb\\",\\"is_menu\\":1,\\"sort\\":5,\\"type\\":\\"1\\",\\"is_show\\":1},{\\"key\\":85,\\"pid\\":75,\\"auth_name\\":\\"集团千川\\",\\"level\\":2,\\"path\\":\\"/mediadelivery/board\\",\\"is_menu\\":1,\\"sort\\":6,\\"type\\":\\"1\\",\\"is_show\\":1}]},{\\"key\\":76,\\"pid\\":0,\\"auth_name\\":\\"我的账号\\",\\"level\\":1,\\"path\\":\\"/douyinuser/userinfo\\",\\"is_menu\\":1,\\"sort\\":10,\\"type\\":\\"2\\",\\"is_show\\":1}]","AuthsData":"[{\\"auth_name\\":\\"应用管理\\",\\"path\\":\\"/application\\",\\"level\\":1},{\\"auth_name\\":\\"账号管理\\",\\"path\\":\\"/douyinaccount/manage/list\\",\\"level\\":1},{\\"auth_name\\":\\"电商大盘\\",\\"path\\":\\"/douyinplatform/market\\",\\"level\\":1},{\\"auth_name\\":\\"集团生意\\",\\"path\\":\\"/grouppf/groupBusiness\\",\\"level\\":1},{\\"auth_name\\":\\"蓝V详情\\",\\"path\\":\\"/douyinmanage/manage/list\\",\\"level\\":1},{\\"auth_name\\":\\"内容热点\\",\\"path\\":\\"/douyinoverview\\",\\"level\\":1,\\"child\\":[{\\"auth_name\\":\\"集团蓝v榜\\",\\"path\\":\\"/douyinoverview/rank\\",\\"level\\":2,\\"is_menu\\":1},{\\"auth_name\\":\\"集团蓝v总览\\",\\"path\\":\\"/douyinoverview/overview\\",\\"level\\":2,\\"is_menu\\":1}]},{\\"auth_name\\":\\"媒体投放\\",\\"path\\":\\"/douyinoverview/paid\\",\\"level\\":1},{\\"auth_name\\":\\"我的账号\\",\\"path\\":\\"/douyinuser/userinfo\\",\\"level\\":1}]","menuData":"[{\\"auth_name\\":\\"应用管理\\",\\"path\\":\\"/application\\",\\"level\\":1},{\\"auth_name\\":\\"账号管理\\",\\"path\\":\\"/douyinaccount/manage/list\\",\\"level\\":1},{\\"auth_name\\":\\"电商大盘\\",\\"path\\":\\"/douyinplatform/market\\",\\"level\\":1},{\\"auth_name\\":\\"集团生意\\",\\"path\\":\\"/grouppf/groupBusiness\\",\\"level\\":1},{\\"auth_name\\":\\"蓝V详情\\",\\"path\\":\\"/douyinmanage/manage/list\\",\\"level\\":1},{\\"auth_name\\":\\"内容热点\\",\\"path\\":\\"/douyinoverview\\",\\"level\\":1,\\"child\\":[{\\"auth_name\\":\\"集团蓝v榜\\",\\"path\\":\\"/douyinoverview/rank\\",\\"level\\":2,\\"is_menu\\":1},{\\"auth_name\\":\\"集团蓝v总览\\",\\"path\\":\\"/douyinoverview/overview\\",\\"level\\":2,\\"is_menu\\":1}]},{\\"auth_name\\":\\"媒体投放\\",\\"path\\":\\"/douyinoverview/paid\\",\\"level\\":1},{\\"auth_name\\":\\"我的账号\\",\\"path\\":\\"/douyinuser/userinfo\\",\\"level\\":1}]","clickMinMemu":"蓝V详情_修丽可SkinCeuticals_作品排行_星图短视频_每日数据追踪","clickMemu":"蓝V详情","analysis_show":"false","insideMenuAuth":"[{\\"menu_id\\":4,\\"is_read_only\\":2,\\"is_export\\":1,\\"path\\":\\"/fans/user/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/fans/update_tag\\",\\"admin/fans/update\\",\\"admin/fans/send\\",\\"admin/leads_tags/create\\",\\"admin/fans/import\\",\\"admin/fans/import_list\\",\\"admin/fans/add_tags\\"],\\"export_router_list\\":[\\"admin/fans/export\\"]},{\\"menu_id\\":5,\\"is_read_only\\":2,\\"is_export\\":1,\\"path\\":\\"/fans/intend/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/leads/update\\",\\"admin/leads/update_tag\\",\\"admin/leads/send\\"],\\"export_router_list\\":[\\"admin/leads/export\\"]},{\\"menu_id\\":6,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/fans/tags/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/leads_tags/create\\",\\"admin/leads_tags/auto_tag\\",\\"admin/leads_tags/leads\\",\\"admin/leads_tags/fans\\",\\"admin/leads_tags/update\\",\\"admin/leads_tags/delete\\"],\\"export_router_list\\":[]},{\\"menu_id\\":8,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/material/manage/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/media/upload_part\\",\\"admin/media/add_tag\\",\\"admin/media/remove_tag\\",\\"admin/media/delete\\",\\"admin/card_question/create\\"],\\"export_router_list\\":[]},{\\"menu_id\\":9,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/material/tags/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/media_tag/edit\\",\\"admin/media_tag/add\\",\\"admin/media_tag/delete\\"],\\"export_router_list\\":[]},{\\"menu_id\\":12,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/works/manage/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"\\",null,\\"admin/works/trend\\",\\"admin/works/delete_video\\"],\\"export_router_list\\":[]},{\\"menu_id\\":15,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/message/constant/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[null,\\"admin/message/send\\",\\"admin/message/send\\",\\"admin/message/send\\",\\"admin/message/send\\"],\\"export_router_list\\":[]},{\\"menu_id\\":16,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/message/grouppost/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[null],\\"export_router_list\\":[]},{\\"menu_id\\":18,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/message/keyword/reply\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/message/keyword/switch_keyword_reply\\",\\"admin/message/keyword/add\\",\\"admin/message/keyword/edit\\",\\"admin/message/keyword/delete\\",\\"admin/message/enter_im/update\\"],\\"export_router_list\\":[]},{\\"menu_id\\":20,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/publicopinion/analyse/manage\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/sentiment/detail\\",\\"admin/sentiment/add\\",\\"admin/sentiment/edit\\",\\"admin/sentiment/delete\\"],\\"export_router_list\\":[]},{\\"menu_id\\":23,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/analyse/works/chatlist\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/composition_analysis/it_day_export\\"]},{\\"menu_id\\":25,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/analyse/keyword/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[null],\\"export_router_list\\":[]},{\\"menu_id\\":27,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/hotspot/hotvideo/hotlist\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/hot/add_collect\\"],\\"export_router_list\\":[]},{\\"menu_id\\":28,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/hotspot/collection/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/hot/remove_collect\\"],\\"export_router_list\\":[]},{\\"menu_id\\":34,\\"is_read_only\\":2,\\"is_export\\":1,\\"path\\":\\"/comment/labor/reply\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/comment/reply\\",\\"admin/comment/reply\\",\\"admin/comment/reply\\",\\"admin/comment/top\\",\\"admin/comment/export\\"]},{\\"menu_id\\":35,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/comment/keyword/reply\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/comment/keyword_reply_switch\\",\\"admin/comment/keyword_reply_add\\",\\"admin/comment/keyword_reply_edit\\",\\"admin/comment/keyword_reply_del\\"],\\"export_router_list\\":[]},{\\"menu_id\\":36,\\"is_read_only\\":2,\\"is_export\\":2,\\"path\\":\\"/comment/usefulexpressions/reply\\",\\"router\\":\\"\\",\\"read_router_list\\":[\\"admin/comment/words_add\\",\\"admin/comment/words_edit\\",\\"admin/comment/words_del\\"],\\"export_router_list\\":[]},{\\"menu_id\\":39,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/shop/daily\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[null]},{\\"menu_id\\":40,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/shop/flow\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[null]},{\\"menu_id\\":42,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/works/worksAnalyze\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[null]},{\\"menu_id\\":43,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/works/keywordsWorksList\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/keyword_video/video_export\\"]},{\\"menu_id\\":44,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/market\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"bo/mkt/export\\"]},{\\"menu_id\\":48,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/rtbBoard/JD\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"bo/jd/export\\"]},{\\"menu_id\\":50,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/shop/crowd\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[null]},{\\"menu_id\\":52,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/transaction\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"\\"]},{\\"menu_id\\":54,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/shop/commodity\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[null]},{\\"menu_id\\":59,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/contentTracker/short/list\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"\\"]},{\\"menu_id\\":62,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/monitor/home\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/monitoring/interactexport\\"]},{\\"menu_id\\":64,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/rtbBoard/tmall/TaobaoSpreader\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"bo/rtb/export\\"]},{\\"menu_id\\":65,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/rtbBoard/tmall/flowTreasure\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"bo/rpa/ds/export\\"]},{\\"menu_id\\":70,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/business/kolSource\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"\\"]},{\\"menu_id\\":72,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/works/starVideo/worksList\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/star_chart/export\\"]},{\\"menu_id\\":74,\\"is_read_only\\":1,\\"is_export\\":1,\\"path\\":\\"/works/starVideo/dailyData\\",\\"router\\":\\"\\",\\"read_router_list\\":[],\\"export_router_list\\":[\\"admin/star_chart/product_detail_export\\"]}]","dy_name":"修丽可SkinCeuticals","analysis_route":"/works/mqianshort/lmateriala","token":""}`;
		try {
			const obj = JSON.parse(data);

			for (var key in obj) {
				if (key === "token") {
					obj[key] = cookie;
				}
				localStorage.setItem(key, obj[key]);
			}

			log("hook成功！");
			window.location.href = `/douyinmanage/manage/list`;
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
						log(data.data.username, data.data.id, data.data.dy_group_id, data.data.parent_id);
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
						});
					}
				})
				.catch((error) => reject(error));
		});
	}

	// 初始化计时器
	startTimer();

	// 定义刷新函数
	function refreshPage() {
		location.reload();
		log("刷新页面,续命tk");
	}

	// 定义重置计时函数
	function resetTimer() {
		remainingTime = 10;
		// startTimer();
		log(`重置计时器: ${remainingTime} 分钟`);
	}

	function startTimer() {
		const intervalId = setInterval(function () {
			remainingTime--;
			log(`剩余时间：${remainingTime} 分钟`);
			if (remainingTime <= 0) {
				clearInterval(intervalId);
				isIdle = true;
				refreshPage();
			}
		}, 60 * 1000);

		// 定义事件类型数组
		// const eventTypes = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"];
		const eventTypes = ["keydown", "mousedown", "touchstart"];
		// 循环添加和移除事件监听器
		for (let eventType of eventTypes) {
			document.removeEventListener(eventType, resetTimer);
			document.addEventListener(eventType, resetTimer);
		}
		// 添加 URL 变化事件监听器
		window.removeEventListener("hashchange", resetTimer, false);
		window.addEventListener("hashchange", resetTimer, false);
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
			popup.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background-color:#fff; padding:15px; border:none;border-radius: 12px; font-size:32px;font-weight: 700;color:#f50000; box-shadow: 0px 1px 20px 0px #6b6b6b;";
			document.body.appendChild(popup);
			setTimeout(function () {
				popup.parentNode.removeChild(popup);
			}, duration);
		});
	}
})();
