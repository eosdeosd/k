var rule = {
	title: '348电影网',
	host: 'https://www.348z.com',
	// url:'/vodshow/id/fyclass/page/fypage.html',
	url: '/vodshow/id/fyfilter.html',
	filterable: 0,//是否启用分类筛选,
	filter_url: '{{fl.cateId}}{{fl.area}}/page/fypage{{fl.year}}',

	filter_def: {
		1:{cateId:'1'},
		2:{cateId:'2'},
		3:{cateId:'3'},
		4:{cateId:'4'},
		37:{cateId:'37'}
	},
	searchUrl: '/vodsearch/page/fypage/wd/**.html',
	searchable: 2,//是否启用全局搜索,
	headers: {//网站的请求头,完整支持所有的,常带ua和cookies
		'User-Agent': 'PC_UA',
	},
	class_parse: '.nav-channel a;a&&Text;a&&href;/(\\d+).html',
	play_parse: true,
	lazy: `js:
		var html = JSON.parse(request(input).match(/r player_.*?=(.*?)</)[1]);
		var url = html.url;
		if (html.encrypt == '1') {
			url = unescape(url)
		} else if (html.encrypt == '2') {
			url = unescape(base64Decode(url))
		}
		if (/\\.m3u8|\\.mp4/.test(url)) {
			input = {
				jx: 0,
				url: url,
				parse: 0
			}
		} else {
			input
		}
	`,
	limit: 6,
	double: true, // 推荐内容是否双层定位
	推荐: '.vodlist;*;*;*;*;*',
	一级: '.pack-ykpack;a&&title;.eclazy&&data-original;.pack-prb&&Text;a&&href',
	二级: {
		"title": ".fyy&&Text;.s-top-info-detail&&Text",
		"img": ".g-playicon&&img&&src",
		"desc": ".s-top-info-title span&&Text;;;.item-type&&Text;.item-actor:eq(2)&&Text",
		"content": ".ec-palytcji span&&Text",
		"tabs": ".swiper-wrapper:eq(1) .channelname",
		"lists": ".content_playlist:eq(#id) li"
	},
	搜索: '.pack-packcover.returl.list-top-b;*;*;*;*',
}