/*
* created by ls 2017.7.13
* */

    // 图片的基础路径
    //var PIC_PATH = 'http://192.168.1.198:8080'
    /**
     * 获取action history
     * 控制显示隐藏
     */
    var $action = $('.plan_action')
    var $history = $('.plan_history')
    var $historyItem = $('.history_item')
    // $action.hide()
    $historyItem.hide()
    controlShow()
    /**
     * 控制显示隐藏
     */
    function controlShow () {
        var $historyBtn = $('.history_btn')

        $historyBtn.click(function (ev) {

            ev.stopPropagation()
            $action.hide()
            $history.show()

            clearInterval(singleSearch.timeId)

            // 执行历史显示
            getJson(planManage.init.url, historyShow.getData, JSON.stringify(historyShow.param))

        })

        var $returnAction = $('.return_action')

        $returnAction.click(function (ev) {
            ev.stopPropagation()

            if(planManage.startFlag) {
                // 无任何预案启动
                return
            }

            $action.show()
            $history.hide()

            getJson(planManage.init.url, planManage.init.getData, JSON.stringify(planManage.init.param))

        })

    }

    // 前进 后退按钮
    var $historyNext = $('.history_paging .next')
    var $historyPrev = $('.history_paging .previous')

    // 执行历史显示
    var historyShow = {
        param: {
            pageSize: 1000,
            pageIndex: 1,
            searchParam: '',
            status: 1
        },
        getData: function (data) {

            if(data.c.flag === 1) {
                historyShow.data = data.c.cases
                // 按开始时间排序
                historyShow.data.sort(function (a, b) {
                    return splitTime(a['addTime']) - splitTime(b['addTime'])
                })
                // historyShow.showUI(0, historyShow.showEntryLen)
                // pagination.pagingLevel.call(historyShow, $historyNext, $historyPrev)

                pageing.showInit(data.c.cases.length, data.c.cases)

            }

        },
        // 初始化显示首页
        showUI: function (start, end) {

            var showData = this.data
            var $historyContent = $('.history_list_content')
            var $basicHistoryItem = $($('.basic_history_item')[0])

            $historyContent.html('')

            showData.slice(start, end).forEach(function (item) {

                var $clone = $basicHistoryItem.clone()
                var $name = $clone.find('.name')

                $name.html(item.name)

                var $search = $clone.find('.search_detail').find('.glyphicon-search')

                $search.attr('data-id', item.id)

                historyDetail($search)

                var $startTime = $clone.find('.start_time')
                $startTime.html(item.addTime)

                var $endTime = $clone.find('.end_time')
                $endTime.html(item.endTime)

                var $type = $clone.find('.type')

                item.type ? $type.html('真实') : $type.html('演练')

                // 主部门
                var $mainDept = $clone.find('.main_dept')

                var depts = ActionDepts.data
                for(var i=0, len=depts.length; i<len; i++) {

                    if(item.mainDeptNo === depts[i].id) {
                        $mainDept.html(depts[i].name)
                        $historyContent.append($clone)
                        return
                    }

                }

            })

            if(end > this.data.length) {
                end = this.data.length
            }

            var flagNum = this.showEntryLen - end + start
            // var flagNum = initShow.showContentLen - this.data.length
            if(flagNum > 0) {
                for(var i=0; i<flagNum; i++) {

                    var $clone = '<tr class="basic_history_item" style="font-size: 0.9em">\
                        <td class="name">&nbsp;</td>\
                        <td class="start_time"> </td>\
                        <td class="end_time"> </td>\
                        <td class="type"> </td>\
                        <td class="main_dept"> </td>\
                        <td class="search_detail"> </td></tr>'

                    $historyContent.append($clone)

                }
            }

        },
        $pageTag: null,
        showEntryLen: 12,
        data: [],
        flag: 'history'
    }

    // 分页按钮
    // var $historyPagination = $('.history_paging .pagination')
    //
    // $historyPagination.click(pagination.clickCallback.bind(null, $historyNext, $historyPrev, historyShow))



    // 预案动态列表查询
    // 保存初始化显示的id
    var startId = 0

    var planManage = {
        init: {
            // 初始化显示
            param: {
                pageSize: 1000,
                pageIndex: 1,
                searchParam: '',
                status: 0
            },
            url: 'dynamic/list',

            getData: function (data) {
                hideLoding()

                // 如果启动预案的个数是0 显示预案执行历史
                if(data.c.flag === 0 && data.c.errorCode === '004') {

                    planManage.startFlag = true

                    $history.show()
                    $action.hide()

                    getJson(planManage.init.url, historyShow.getData, JSON.stringify(historyShow.param))

                    return
                }


                if(data.c.flag === 1) {

                    $history.hide()

                    planManage.startFlag = false

                    // 成功
                    var planCase = null
                    planManage.showData = data.c.cases
                    var liStr = ''

                    planManage.showData.forEach(function (item, index) {

                        if(index === 0) {

                            planCase = item
                            startId = item.id

                            liStr = liStr + '<li role="presentation" class="active" data-id='+item.id+'><a href="#home" aria-controls="home" role="tab" data-toggle="tab">预案执行'+(index + 1)+'</a></li>'
                        } else {

                            liStr = liStr + '<li role="presentation" data-id='+item.id+'><a href="#home" aria-controls="home" role="tab" data-toggle="tab">预案执行'+(index + 1)+'</a></li>'
                        }

                    })

                    $planNav.html(liStr)

                    getJson(singleSearch.url, singleSearch.getData.bind(null, $action), '{id: '+startId+'}')
                }
            }

        },
        showData: [],
    //    无任何预案启动的标识
        startFlag: false
    }


    //
    var $planListWrap = $('.plan_lists_wrap')

    // 控制任务列表的高度

    $planListWrap.css({

        height: document.documentElement.clientHeight - 500 + 'px'

    })

    window.onresize = function () {

        $planListWrap.css({
            height: document.documentElement.clientHeight - 500 + 'px'
        })

    }

    //
    var cache = {}

    // 单个查询
    var singleSearch = {

        url: 'dynamic/single',
        // 获取单个查询的数据显示页面
        getData: function ($parent, data) {
            hideLoding()
            if(data.c.flag === 1) {

                singleSearch.showUI($parent, data)

            }

        },
        taskList: {},
        data: {},
        showUI: function ($parent, data) {
            singleSearch.data = data.c.case
            var show = data.c.case

            // 第一次加载
            // 预案名称
            var $actionTimeWrap = $parent.find('action_time_wrap')
            var $planLoadingTitle = $parent.find('.plan_name')

            $planLoadingTitle.html('预案名称: ' + show.name )

            var $planState = $parent.find('.plan_state')

            if($parent.hasClass('history_item')) {

                $planState.html('&nbsp;已结束')

            } else {
                $planState.html('&nbsp;执行中')
                $planState.css({
                    color: 'red'
                })
            }

            // 预案描述
            var $planDesc = $parent.find('.plan_desc')
            $planDesc.html('预案描述: ' + show.description)
            // 显示任务列表
            var list = data.c.case.list
            var depts = ActionDepts.data
            // 列表项
            var $planListItem = $($parent.find('.plan_list_item')[0])

            var i = 0

            // 开始时间
            var startTime = show.addTime
            // console.log(startTime, '............')
            // 当前时间
            var currentTime = moment.unix(serverDatenow / 1000).format('YYYY-MM-DD HH:mm:ss')

            //console.log(moment.unix(serverDatenow / 1000).format('YYYY-MM-DD HH:mm:ss'), '服务器时间')
            // 演练时间
            var $actionTime = $parent.find('.action_time')

            $actionTime.html('')

            var enterTime = startToEnd(startTime, currentTime)


            $actionTime.html('启动时长: &nbsp;' + enterTime)


            if(show.endTime) {

                // 已经执行完成的历史

                enterTime = startToEnd(startTime, show.endTime)
                $actionTime.html('启动时长: &nbsp;' + enterTime)

                $actionTimeWrap.html($actionTime)

                clearInterval(cache[startId])


            }else {

                for(var i in cache) {

                    clearInterval(cache[i])

                }

                // 未执行的
                cache[startId] = setInterval(setTimeInter, 1000)

                function setTimeInter () {

                    currentTime = moment.unix(serverDatenow / 1000).format('YYYY-MM-DD HH:mm:ss')

                    enterTime = startToEnd(startTime, currentTime)

                    $actionTime.html('启动时长: &nbsp;' + enterTime)

                }

            }

            appendEl($parent.attr('class'), $parent.find('.plan_lists_wrap'))
            /**
             * 添加元素列表
             */
            function appendEl (className, $planListWrap) {
                var listStr = ''
                // 删除
                $planListWrap.find('.panel-collapse').removeClass('in')
                $planListWrap.find('.main_depart_flag').remove()


                list.forEach(function (item) {

                    var $cloneItem = $planListItem.clone()
                    var check = item.check

                    depts.forEach(function (dept, deptIndex) {
                        // 预案列表项
                        if(item.deptNo === dept.id) {

                            var $deptName = $cloneItem.find('.panel-title')

                            var $planTask = $cloneItem.find('.plan_task')
                            var $title = $deptName.find('.dept_name')
                            var $a = $deptName.find('a')
                            $title.html(dept.name)

                            $a.attr('href', '#' + className + '' + dept.id)

                            // $a.attr('data-parent', '#' + className + '' + dept.id)

                            // 折叠的内容
                            var $panelCollapse = $cloneItem.find('.panel-collapse')

                            $panelCollapse.attr('id', className + '' + dept.id)

                            // var maxHeight = maxCollapseHeight - (deptIndex + 1)*$('.panel-heading').height()

                            // 折叠的高度
                            // $panelCollapse.css({
                            //     maxHeight: maxHeight + 'px',
                            //     overflowY: 'scroll'
                            // })


                            // 缩略图
                            var $glyphiconPicture = $cloneItem.find('.glyphicon-picture')

                            if(!item.image) {

                                $glyphiconPicture.hide()

                            }else {
                                $glyphiconPicture.show()
                                $glyphiconPicture.attr('data-img-src', getImageUrl + item.image)
                            }

                            // 显示任务列表项
                            var checkStr = ''
                            check.forEach(function (checkList, index) {
                                // <div class="cb-container">
                                //     <input type="checkbox" id="checkbox">
                                //     <label for="checkbox" class="cb-label"></label>
                                //     </div>
                                index = index + 1


                                if(checkList.status === 0) {

                                    // 没有完成
                                    if(show.endTime) {
                                        // 查看历史
                                        // checkStr = checkStr + '<li class="list-group-item"><input type="checkbox" data-id='+checkList.id+' disabled>&nbsp;'+checkList.content+'<span class="show_update_time"></span></li>'
                                        checkStr = checkStr + '<li class="list-group-item"><span class="cb-container"><input type="checkbox" data-id='+checkList.id+' id=num'+checkList.id+' disabled><label for=num'+checkList.id+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+index+'</span><span class="task_content">'+checkList.content+'</span><span class="show_update_time"></span></li>'
                                    }else {
                                        // 编辑
                                        // checkStr = checkStr + '<li class="list-group-item"><input type="checkbox" data-id='+checkList.id+' >&nbsp;'+checkList.content+'<span class="show_update_time"></span></li>'
                                        checkStr = checkStr + '<li class="list-group-item"><span class="cb-container"><input type="checkbox" data-id='+checkList.id+' id=num'+checkList.id+'><label for=num'+checkList.id+' class="cb-label"></span>&nbsp;<span class="task_num">'+index+'</span><span class="task_content">'+checkList.content+'</span><span class="show_update_time"></span></li>'

                                    }

                                } else {
                                    var timeSplit = checkList.lastTime.split(' ')
                                    // 已经完成 显示时间
                                    if(show.endTime) {

                                        //checkStr = checkStr + '<li class="list-group-item"><input type="checkbox" checked="checked" data-id='+checkList.id+' disabled>&nbsp;'+checkList.content+'<span class="show_update_time">'+checkList.lastTime+'</span></li>'
                                        checkStr = checkStr + '<li class="list-group-item"><span class="cb-container"><input type="checkbox" data-id='+checkList.id+' id=num'+checkList.id+' disabled checked><label for=num'+checkList.id+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+index+'</span><span class="task_content">'+checkList.content+'</span><span class="show_update_time">'+timeSplit[0]+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + timeSplit[1]+'</span></li>'


                                    } else {

                                        //checkStr = checkStr + '<li class="list-group-item"><input type="checkbox" checked="checked" data-id='+checkList.id+'>&nbsp;'+checkList.content+'<span class="show_update_time">'+checkList.lastTime+'</span></li>'
                                        checkStr = checkStr + '<li class="list-group-item"><span class="cb-container"><input type="checkbox" data-id='+checkList.id+' id=num'+checkList.id+' checked><label for=num'+checkList.id+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+index+'</span><span class="task_content">'+checkList.content+'</span><span class="show_update_time">'+timeSplit[0]+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + timeSplit[1]+'</span></li>'

                                    }

                                }

                            })

                            $planTask.html(checkStr)


                            // var $checkBox = $planTask.find('input[type=checkbox]')
                            //
                            // checkBoxUpdate($checkBox)

                            i++


                            // 判断是否是主部门
                            if(item.deptNo === show.mainDeptNo) {


                                $deptName.before('<span class="glyphicon glyphicon-star main_depart_flag"></span>')
                                // $panelCollapse.addClass('in')

                                // $panelCollapse.on('show.bs.collapse', function () {
                                //     // do something…
                                //     console.log('hello show bs collapse')
                                // })

                                // $panelCollapse.collapse('show')

                            }

                            listStr = listStr + $cloneItem[0].outerHTML

                        }

                    })

                })

                $planListWrap.html(listStr)

                singleSearch.collapse.saveCollapseInfo()

                var $checkBox = $planListWrap.find('input[type=checkbox]')
                checkBoxUpdate($checkBox)


                // 所有的缩略图
                var $image = $planListWrap.find('.glyphicon-picture')

                showPicture($image)

                // 折叠部分

                var collaspeInfo = singleSearch.collapse.collapseInfo

                if(collaspeInfo.length > 0) {

                    for(var i=0, len=collaspeInfo.length; i<len; i++) {

                        if(startId === collaspeInfo[i].id) {

                            $(collaspeInfo[i].href).collapse('show')

                            return

                        }

                    }

                }

            }

        },
        timeId: '',
        // 折叠相关的操作
        collapse: {
            collapseInfo: [],
            saveCollapseInfo: function () {

                var me = this

                $('.panel-heading').find('a').click(function (ev) {

                    var href = $(this).attr('href')
                    var reg = /\bin\b/gi

                    var len = me.collapseInfo.length

                    var flag = null

                    // var num = Number(href.replace('#plan_action', ''))

                    if(len === 0) {

                        me.collapseInfo.push({
                            id: startId,
                            href: href
                        })


                    } else {

                        var idArr = me.collapseInfo.map(function (item) {
                            return item.id
                        })

                        for(var i=0; i<len; i++) {

                            if(me.collapseInfo[i].id && me.collapseInfo[i].id === startId ) {

                                if(reg.test($(href).attr('class'))) {

                                    me.collapseInfo.splice(i, 1)

                                } else {

                                    me.collapseInfo[i].href = href

                                }



                            } else if(idArr.indexOf(startId) < 0) {

                                flag = {
                                    id: startId,
                                    href: href
                                }

                            }

                        }

                    }

                    flag && me.collapseInfo.push(flag)

                })

            },
        }
    }



    // 获取部门相关信息
    var ActionDepts = {
        deptUrl: 'config/depts',
        param: '',
        data: [],
        // 选中部门的id
        selDeptId: '',
        getData: function (data) {
            hideLoding()
            if(data.c.flag === 1) {
                ActionDepts.data = data.c.depts

                getJson(planManage.init.url, planManage.init.getData, JSON.stringify(planManage.init.param))
                // getJson(planManage.init.url, historyShow.getData, JSON.stringify(historyShow.param))

            }
        }
    }

    getJson(ActionDepts.deptUrl, ActionDepts.getData, ActionDepts.param)


    // 定义一个方法显示缩略图 控制图片的显示与隐藏
    $('#myDialog').parent().hide()
    function showPicture ($img) {

        var $showLgPic = $('.show_lg_pic')


        $img.click(function (ev) {

            ev.stopPropagation()

            var $target = $(ev.target)
            var imgSrc = $target.attr('data-img-src')
            $showLgPic.attr('src', imgSrc)


            var $uiDialog = $('#myDialog').parent()
            //

            $uiDialog.show()
            $uiDialog.css({
                zIndex: 101
            })

            $('.lwd-window-buttonbar').click(function (ev) {
                ev.preventDefault()
                ev.stopPropagation()

                $uiDialog.hide()
            })


        })

        // $showLgPic.on('load', function () {
        //
        //     console.log('图片加载过来了')
        //     $(this).on("mousewheel", function() {
        //         console.log('bibiibi', this)
        //         zoomImg(this);
        //
        //         return false;
        //     })
        //
        // })

        // $(document).click(function (ev) {
        //     console.log('hello')
        //     var $uiDialog = $('#myDialog').parent()
        //     $uiDialog.hide()
        // })

    }

    // 检查单的完成与未完成
    function checkBoxUpdate ($checkbox) {

        var url = 'dynamic/lineupdate'

        $checkbox.click(function (ev) {

            ev.stopPropagation()

            var $target = $(ev.target)
            // 发送请求
            var param = {
                id: Number($target.attr('data-id')),
                status: $target.prop('checked') ? 1 : 0
            }

            var str = JSON.stringify(param)

            getJson(url, lineGetData.bind(null, $target), str)

            // $.ajax({
            //
            //     url: 'http://192.168.1.198:8080/ERMS/' + url,
            //     type: 'post',
            //     data: str,
            //     success: function (data) {
            //
            //         lineGetData.call(null, $target, data)
            //
            //     },
            //     error: function () {
            //         console.log('error')
            //     }
            // })


        })


        // 获取当行更新的数据
        function lineGetData ($target, data) {

            var $time = $target.parent().parent().find('.show_update_time')
            if(data.c.flag === 1) {

                var time = data.c.lastTime

                var timeSplit = time.split(' ')


                $target.prop('checked') ? $time.html(timeSplit[0]+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + timeSplit[1]) : $time.html('')
            }

        }

    }

    // 点击完成按钮的操作

    var $successBtn = $('.btn-success')
    $successBtn.click(function (ev) {
        // ev.stopPropagation()

        // 获取所有的input checkbox
        var $allCheckbox = $planListWrap.find('input[type=checkbox]')

        // 获取所有选中的checkbox
        var $allChecked = $planListWrap.find(':checked')
        var url = 'dynamic/eventupdate'

        if($allCheckbox.length === $allChecked.length) {


            // 所有的已勾选
            getJson(url, successGetData, '{id: '+startId+'}')


            $(ev.target).attr('data-toggle', '')
            $(ev.target).attr('data-target', '')


        } else {

            //data-toggle="modal" data-target="#success"

            $(ev.target).attr('data-toggle', 'modal')
            $(ev.target).attr('data-target', '#success')

            // 还有检查单未完成

            //if(confirm('还有检查单未完成, 确定提交吗')) {

                // console.log('确定提交')
                // getJson(url, successGetData, '{id: '+startId+'}')


            //}

            confirmSuccess(url, startId)

        }


    })

    function confirmSuccess(url, startId) {

        $('.confirm_success')[0].onclick = function () {

            //console.log('biblibbiibibi')

            getJson(url, successGetData, '{id: '+startId+'}')

            $(this).attr('data-dismiss', 'modal')

        }

    }
    /**
     *
     * @param data
     */
    function successGetData (data) {

        if(data.c.flag === 1) {

            // 成功接收到数据

            // 停止此预案定时器
            clearInterval(cache[startId])

            var $active = $planNav.children('.active')

            var $activeNext = $active.next()
            var $activePrev = $active.prev()

            if($activeNext.length === 1) {

                $activeNext.addClass('active')
                startId = $activeNext.attr('data-id')

                getJson(singleSearch.url, singleSearch.getData.bind(null, $action), '{id: '+startId+'}')


            } else {

                if($activePrev.length === 1) {

                    $activePrev.addClass('active')
                    startId = $activePrev.attr('data-id')
                    getJson(singleSearch.url, singleSearch.getData.bind(null, $action), '{id: '+startId+'}')

                } else {

                    // 已经全部完成
                    // $successBtn.prop('disabled', true)
                    // 全部完成跳转到执行历史
                    $history.show()
                    $action.hide()

                    getJson(planManage.init.url, historyShow.getData, JSON.stringify(historyShow.param))

                    planManage.startFlag = true

                }

            }
            $active.remove()

        }

    }



    // 预案的nav导航
    var $planNav = $('.plan_nav')
    $planNav.click(function (ev) {

        if(ev.target.nodeName.toLowerCase() === 'ul') {
            return
        }

        $(this).find('li').removeClass('active')

        var nodeName = ev.target.nodeName.toLowerCase()
        var $target = null
        if(nodeName === 'a') {
            $target = $(ev.target).parent()
        } else if(nodeName === 'li') {
            $target = $(ev.target)
        }

        startId = Number($target.attr('data-id'))

        $target.addClass('active')

        getJson(singleSearch.url, singleSearch.getData.bind(null, $action), '{id: '+startId+'}')


    })


    /**
     *显示历史详细信息
     */
    function historyDetail ($search) {

        $search.click(function () {


            startId = Number($(this).attr('data-id'))


            clearInterval(singleSearch.timeId)

            getJson(singleSearch.url, singleSearch.getData.bind(null, $historyItem), '{id: '+startId+'}')

            $historyItem.show()
            $history.hide()

        })

    }

    // 返回预案历史

    var $returnHistory = $('.history_return_btn')
    $returnHistory.click(function () {

        $historyItem.hide()
        $history.show()

        getJson(planManage.init.url, historyShow.getData, JSON.stringify(historyShow.param))

    })


    // 项目折叠
    var $shrinkItem = $('.shrink_item')

    $shrinkItem.click(function () {

        var $collapse = $planListWrap.find('.panel-collapse')
        Array.prototype.forEach.call($collapse, function (item, index) {
            var $item = $(item)
            if($item.hasClass('in')) {
                $item.collapse('hide')
                // 退出循环
                return

            }

        })

        var collapseInfo = singleSearch.collapse.collapseInfo
        collapseInfo.forEach(function (item, index, arr) {

            if(item.id === startId) {
                arr.splice(index, 1)
                return
            }

        })


    })


    // 时间格式化
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        }
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        return fmt
    }



    /**
     * 处理两个格式化好的时间段的差值
     */
    function startToEnd (start, end) {
        // 服务器时间 moment.unix(serverDatenow/1000).format('HH:mm:ss')
        // alert(moment.unix(serverDatenow/1000).format('HH:mm:ss'))

        // var startStr = start.replace('-', '/')
        // var endStr = end.replace('-', '/')
        //
        // var startTime = new Date(startStr).getTime()
        // var endTime = new Date(endStr).getTime()


        // 将差值转化成时分秒

        var time = splitTime(start, end)

        var char = time.endTime - time.startTime

        var hour = char/1000/60/60
        var hoursRound = Math.floor(hour)
        var min = char/1000/60 - (60 * hoursRound)
        var minRound = Math.floor(min)
        var sec = char/1000 - (minRound * 60) - (hoursRound * 60 * 60)
        var secRound = Math.floor(sec)

        secRound = secRound < 10 ? '0' + secRound : secRound
        minRound = minRound < 10 ? '0' + minRound : minRound
        hoursRound = hoursRound < 10 ? '0' + hoursRound : hoursRound

        return hoursRound+':'+minRound+':'+secRound

    }

    function splitTime (start, end) {
        // 兼容火狐     new date("Year","Month","Day","Hour","Minutes","Seconds");(在Chrome 和 Firefox IE8中都兼容，其它未测试。)
        var arr = start.split(' ')
        arr = arr[0].split('-').concat(arr[1].split(':'))
        var startTime = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]).getTime()

        if(arguments.length === 2) {

            var arr2 = end.split(' ')
            arr2 = arr2[0].split('-').concat(arr2[1].split(':'))
            var endTime = new Date(arr2[0], arr2[1]-1, arr2[2], arr2[3], arr2[4], arr2[5]).getTime()

            return {
                startTime: startTime,
                endTime: endTime
            }
        } else if(arguments.length === 1) {

            return startTime
        }
    }






















