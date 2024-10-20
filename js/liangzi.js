var rule = {
    title: '量子',
    host: 'https://cj.lzcaiji.com',
    homeUrl: '/api.php/provide/vod?ac=detail',
    searchUrl: '/api.php/provide/vod?ac=detail&wd=**&pg=fypage',
    detailUrl: '/api.php/provide/vod?ac=detail&ids=fyid', //非必填,二级详情拼接链接
    searchable: 2,
    quickSearch: 0,
    filterable: 1,
    tab_remove:['liangzi'],
    play_parse: true ,
    lazy: `js:			
        if (/\\.m3u8|\\.mp4/.test(input)) {
            input = {
                jx: 0,
                url: input,
                parse: 0
            }
		} else if (/,/.test(input) && /url=/.test(input))	
            input = {
                jx: 0,
                url: input.split(',')[1],
                parse: 1	
            }	
		} else if (/url=|id=/.test(input)) {
            input = {
                jx: 0,
                url: JSON.parse(request(input)).url,
                parse: 0
            }
        } else if (/https.*?m3u8/.test(input)) {
            let purl = JSON.parse(request("https://101.126.17.154/?url=" + input)).url;
            input = {
                jx: 0,
                url: purl,
                parse: 0
            }
        } else {
            input
        }
    `,
    multi: 1,
    timeout: 5000,
    limit: 6,
    url: '/api.php/provide/vod?ac=detail&t=fyclass&pg=fypage&f=',
    class_name: '国产剧&香港剧&台湾剧&韩国剧&日本剧&动作片&喜剧片&科幻片',
    class_url: '13&14&21&15&22&6&7&9',
    推荐: 'json:list;vod_name;vod_pic;vod_remarks;vod_id', // double: true, // 推荐内容是否双层定位
    // 一级: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    一级: `js:
        function getParam(url,name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = url.split('?')[1].match(reg); //获取url中"?"符后的字符串并正则匹配
            var context = "";
            if (r != null)
                context = decodeURIComponent(r[2]);
            reg = null;
            r = null;
            return context == null || context == "" || context == "undefined" ? "" : context;
        }
        let d = [];
        // 忽略分类
        let cate_exclude = '34,35,45';
        let type_id = getParam(input,'t');
        if(!cate_exclude.match(type_id)){
            let html = request(input);
            let list = JSON.parse(html).list;
            list.forEach(function (it){
                if(!cate_exclude.match(it.type_id)){
                    d.push({
                        title:it.vod_name,
                        img:it.vod_pic,
                        desc:it.vod_remarks,
                        url:it.vod_id
                    });
                }
            });
        }
        setResult(d);
        // log(input);
    `,
    /**
     * 资源采集站，二级链接解析
     */
    // 二级: `json:list;vod_name;vod_pic;vod_remarks;vod_id`,
    二级: `js:
        let html = request(input);
        let list = JSON.parse(html).list;
        if(list.length===1){
           VOD = list[0];
            VOD.vod_blurb = VOD.vod_blurb.replace(/　/g, '').replace(/<[^>]*>/g, '');
            VOD.vod_content = VOD.vod_content.replace(/　/g, '').replace(/<[^>]*>/g, '');
        }
    `,
    /**
     * 搜索解析 过滤部分资源
     */
    // 搜索: 'json:list;vod_name;vod_pic;vod_remarks;vod_id',
    搜索: `js:
        let d = [];
        // 忽略分类
        let cate_exclude = '34,35,45';
        let html = request(input);
        let list = JSON.parse(html).list;
        list.forEach(function (it){
            if(!cate_exclude.match(it.type_id)){
                d.push({
                    title:it.vod_name,
                    img:it.vod_pic,
                    desc:it.vod_remarks,
                    url:it.vod_id
                });
            }
        });
        setResult(d);
    `,
}
