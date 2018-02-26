/**
 * Created by ls on 2017/7/20.
 *
 * 公共类
 */

/***
 * 拖拽的功能
 * @param $dragContent
 */

function planListDrag ($dragContent, isPlanAction) {

    var $target = null
    var startPoint = {

    }
    var dropPoint = {

    }

    for(var i=0, len=$dragContent.length; i<len; i++) {

        $dragContent[i].ondragstart = function (ev) {

            startPoint.clientY = ev.clientY
            ev.dataTransfer.effectAllowed = "move"
            ev.dataTransfer.setData("ls", ev.target.innerHTML);
            // setData key使用text关键字导致在火狐浏览器在tab标签另开一个窗口

            ev.dataTransfer.setDragImage(ev.target, 0, 0);

            $target = $(ev.target)


        }


        $dragContent[i].ondragover = function (ev) {
            return false

        }

        $dragContent[i].addEventListener('drop', dropCallback.bind(null, i))

        function dropCallback (j, event) {
            dropPoint.clientY = event.clientY
            if(!$target) {
                return
            }
            var $evTarget = $(event.target)

            var nodeName = event.target.nodeName.toLowerCase()

            if(nodeName === 'span' || nodeName === 'input') {

                $evTarget = $evTarget.parent()

            } else if(nodeName === 'label') {

                $evTarget = $evTarget.parent().parent()

            }


            // 如果拖拽元素和目标元素相同
            var targetNum = $target.find('.task_num').html()
            var evTargetNum = $evTarget.find('.task_num').html()

            if(targetNum === evTargetNum) {
                return
            }

            var T = dropPoint.clientY - startPoint.clientY
            $target.remove()

            T > 0 ? $evTarget.after($target) : $evTarget.before($target)

            // if(T > 0) {
            //     $evTarget.after($target)
            // }else {
            //     $evTarget.before($target)
            // }


            var $taskNum = $dragContent.find('.task_num')

            // // 预案执行
            //
            // if(isPlanAction) {
            //
            //     $taskNum = $($dragContent[j]).parent().find('.task_num')
            //
            //     // 预案执行 对任务完成时间的更新
            //     var $checkBox = $planListWrap.find('input[type=checkbox]')
            //
            //     checkBoxUpdate($checkBox)
            //
            // }

            // 重新将索引排序
            var check = []
            Array.prototype.slice.call($taskNum).forEach(function (item, index) {

                $(item).html(index + 1)

                $(item).next().attr('data-num', index+1)

                var val = $(item).next().val()

                check.push({
                    number: index + 1,
                    content: val
                })

            })


            // 将保存的任务列表排序
            // 添加状态
            // 新增状态下
            if(selectDept.$target) {
                var addId = Number(selectDept.$target.attr('data-id'))

                addList.forEach(function (list, listIndex) {

                    if(list.deptNo === addId) {

                        list.check = check

                    }
                })

            }

            //修改的状态下
            if(updateTarget.$target) {

                var id = Number(updateTarget.$target.attr('data-id'))

                init.cloneList.forEach(function (item, index, arr) {

                        if(item.deptNo === id) {

                            item.check = check

                        }
                })
            }

        }


    }

}

// 分页的功能
var pagination = {
    // 初始化分页
    // 分页的层次
    pagingLevel: function ($next, $prev) {

        // var len = this.data.slice(this.showEntryLen*(pagination.num - 1), this.showEntryLen*pagination.num).length
        // console.log(len, this.showEntryLen)
        // if(this.totalNum >= this.showEntryLen) {
        var level = Math.ceil(this.data.length / this.showEntryLen)

        if(level === 1 || level === 0) {

            $next.prevAll('li:not(.previous)').remove()
            $next.before('<li class="paginate_button active"><a href="#" aria-controls="page1">1</a></li>')

            $prev.addClass('disabled')
            $next.addClass('disabled')

            return
        }

        // if(this.data.length >= this.showEntryLen) {
        // $pagination.css({
        //     display: 'block'
        // })
        $next.prevAll('li:not(.previous)').remove()

        if(this.$pageTag) {

            this.$pageTag.html('')

        }
        // 显示的层次
        // var level = Math.ceil(this.data.length/this.showEntryLen)

        var pageStrHtml = ''

        for (var i=0; i<level; i++) {

            if(i === 0){
                pageStrHtml += '<li class="paginate_button active"><a href="#" aria-controls="page1">'+(i+1)+'</a></li>'
            }else {
                pageStrHtml += '<li class="paginate_button"><a href="#" aria-controls="page1">'+(i+1)+'</a></li>'
            }

        }

        this.$pageTag  = $(pageStrHtml)

        // 将分页标签添加到$prev后面

        $prev.after(this.$pageTag)

        $next.removeClass('disabled')


    },
    // 分页
    pageDivi: function (start, end, page) {

        var htmlStr = ''

        var data = page.data

        if(end > data.length) {
            end = data.length
        }


        if(page.flag) {

            page.showUI(start, end)

        } else {

            data.slice(start, end).forEach(function (item, index) {

                htmlStr += '<tr data-id='+item.id+'><td>'+item.name+'</td><td>'+item.description+'</td><td><div class="plan_adjust"><span class="glyphicon glyphicon-ok" data-toggle="tooltip" data-placement="top" title="预案启动"></span><span class="glyphicon glyphicon-file" data-info="watch" data-toggle="tooltip" data-placement="top" title="预案查看"></span><span class="glyphicon glyphicon-trash" data-info="delete" data-toggle="tooltip" data-placement="top" title="预案删除"></span><span class="glyphicon glyphicon-pencil" data-info="update" data-toggle="tooltip" data-placement="top" title="预案修改"></span></div></td></tr>'

            })

            var flagNum = page.showContentLen - end + start


            if(flagNum > 0) {

                for(var i=0; i<flagNum; i++) {

                    htmlStr += '<tr><td>&nbsp</td><td>&nbsp</td><td> </td></tr>'

                }

            }

            $tbody.html(htmlStr)

            // 调整图标添加进去调用
            planAdjust()

            tbodyHover()

            // $('[data-toggle="tooltip"]').tooltip()

        }
    },
    // 分页标签的点击回调函数
    clickCallback: function ($next, $prev, page, ev) {
        // 分页的时候将删除修改按钮不能点击

        // $nav.find('a[data-info=delete]').addClass('disabled')
        // $nav.find('a[data-info=update]').addClass('disabled')
        if(ev.target.href) {

            var $target = $(ev.target)

            var parentId = $target.parent().attr('id')

            var reg = new RegExp('next', 'g')

            var activeReg = new RegExp('active', 'g')

            var disabledReg = new RegExp('disabled', 'g')

            if(parentId) {

                // 点击前进后退按钮
                var $active = $('.pagination .active')

                var pageClass = ''

                if(reg.test(parentId)) {
                    // 前进按钮
                    var nextClass = $next.attr('class')
                    if(disabledReg.test(nextClass)){
                        return
                    }
                    $active.removeClass('active')

                    $active.next().addClass('active')

                    pageClass = $target.parent().prev().attr('class')

                    $prev.removeClass('disabled')

                    if(activeReg.test(pageClass)) {
                        $target.parent().addClass('disabled')
                    }
                    pagination.pageManage($active.next().find('a'), page)

                } else {
                    // 后退按钮
                    var prevClass = $prev.attr('class')
                    if(disabledReg.test(prevClass)) {
                        return
                    }
                    $active.removeClass('active')
                    $active.prev().addClass('active')
                    pageClass = $target.parent().next().attr('class')
                    $next.removeClass('disabled')
                    if(activeReg.test(pageClass)) {
                        $target.parent().addClass('disabled')
                    }

                    pagination.pageManage($active.prev().find('a'), page)
                }
            }else {

                // var str = $target.html()
                $target.parent().parent().children('li').removeClass('active')

                $target.parent('li').addClass('active')

                if($target.parent().next().attr('id') === $next.attr('id')) {
                    $next.addClass('disabled')
                    $prev.removeClass('disabled')
                }else if($target.parent().prev().attr('id') === $prev.attr('id')) {
                    $prev.addClass('disabled')
                    $next.removeClass('disabled')
                }
                pagination.pageManage($target, page)

            }
        }
    },
    // 分页管理
    pageManage: function (target, page) {

        this.target = target.parent()
        this.num = Number(target.html())

        var start = 0
        var end = page.showEntryLen * this.num

        if(this.num != 1) {
            start = page.showEntryLen*(this.num - 1)
        }

        this.pageDivi(start, end, page)

    },
    // 分页的值
    num: 1,
    // 分页标签active
    target: null,
    // 更新分页标签
    updatePageLevel: function (data) {
        // console.log(this.num, this.target)
        // 显示的层次
        var level = Math.ceil(data.length/initShow.showEntryLen)

        var num = Number($next.prev().find('a').html())
        var l = 0
        if (level === 1) {
            initShow.showUI.call(this, 0, data.length)
            // $pagination.css({
            //     display: 'none'
            // })

            $next.prevAll('li:not(.previous)').remove()
            $next.before('<li class="paginate_button active"><a href="#" aria-controls="page1">1</a></li>')

            $next.addClass('disabled')
            $prev.addClass('disabled')

        } else {

            var $active = $('.pagination .active')
            if(num > level) {
                // 如果level的层次小于num 删除对应的level
                l = num - level
                var flag = 0
                for(var i=0; i<l; i++) {
                    $($next.prevAll('li:not(.previous)')[i-flag]).remove()
                    flag++
                }

            }else {
                // 如果level的层次大于num 添加对应的level
                for(var j=num; j<level; j++) {
                    $next.before('<li class="paginate_button"><a href="#" aria-controls="page1">'+(j+1)+'</a></li>')
                }

            }

            if($active.prev().attr('class') === $prev.attr('class')) {
                $next.removeClass('disabled')
            } else {
                $prev.removeClass('disabled')
            }

            var start = 0
            // 重新显示数据
            if(Number($active.find('a').html()) > level) {

                $next.prev().addClass('active')
                start = Number($next.prev().find('a').html())
                // console.log(start)
                initShow.showUI.call(this, (start - 1)*initShow.showEntryLen, initShow.showEntryLen*start)
            }else {

                start = Number($active.find('a').html())
                initShow.showUI.call(this, (start - 1)*initShow.showEntryLen, initShow.showEntryLen*start)
            }


        }
    }
}

var pageing = {
    start: 0,
    end: 12,
    showContentLen: 12,
    showUI: function (num) {
        this.start = this.showContentLen * (num - 1)
        this.end = this.showContentLen * num
        this.showPageLevel(num, false)
        historyShow.showUI(this.start, this.end)
    },
    // 显示分页的层次
    showInit: function (length) {
        if(length) {
            this.dataLength = length
            // 初始化
            this.showUI(1)
        }
    },

    // 监听prev next 点击事件
    clickPage: function ($prev, $next) {
        var $parent = $prev.parent()
        // 解绑
        $prev.unbind('click')
        $next.unbind('click')
        var $level = $parent.find('.level')
        $level.length > 0 && $level.unbind('click')

        var that = this
        var $levelPage = $parent.find('.level:not(.els)')
        var $active = null
        var num = 1
        // 总数据量  	data.page.totalNum  pageSize: val  page: 1 初始化
        var level = Math.ceil(that.dataLength / this.showContentLen)

        $levelPage.click(function () {
            $active = $parent.find('.active')
            num = Number($(this).find('a').html())

            if($next.prev().hasClass('active')) {
                $next.addClass('disabled')
                $prev.removeClass('disabled')
            } else if($prev.next().hasClass('active')) {
                $prev.addClass('disabled')
                $next.removeClass('disabled')
            } else {
                $next.removeClass('disabled')
                $prev.removeClass('disabled')
            }
            that.showUI(num)
        })

        $prev.click(function () {

            $active = $parent.find('.active')
            if($active.prev().hasClass('prev')) {
                return
            }

            $next.removeClass('disabled')

            num = Number($active.prev().find('a').html())

            num = !num ? level - 8 : num
            if($prev.next().hasClass('active')) {
                $prev.addClass('disabled')
                $next.removeClass('disabled')
            } else {
                $prev.removeClass('disabled')
            }

            that.showUI(num)

        })
        $next.click(function () {

            $active = $parent.find('.active')

            if($active.next().hasClass('next')) {
                return
            }
            $prev.removeClass('disabled')

            num = Number($active.next().find('a').html())
            if($next.prev().hasClass('active')) {
                $next.addClass('disabled')
                $prev.removeClass('disabled')
            } else {
                $next.removeClass('disabled')
            }

            that.showUI(num)
        })

    },
    showPageLevel: function (num, isInit) {

        var $prev = $('.prev')
        var $next = $('.next')

        var $level = $prev.parent().find('.level')
        $level.remove()


        // 总数据量  	data.page.totalNum  pageSize: val  page: 1 初始化
        var level = Math.ceil(this.dataLength / this.showContentLen)

        var maxNum = 10
        // num NaN	prev 情况临界条件下

        var liStr = ''

        if(isInit) {
            liStr = liStr + '<li class="level active"><a href="#">'+1+'</a></li>'
            if(level < maxNum) {

                for(var i=2; i<=level; i++) {
                    liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
                }

            } else {
                for(var i=1; i < maxNum - 1; i++) {
                    liStr = liStr + '<li class="level"><a href="#">'+(i+1)+'</a></li>'
                }
                liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
            }
            $prev.addClass('disabled')
            if(level !== 1) {
                $next.removeClass('disabled')
            } else {
                $next.addClass('disabled')
            }

        } else {

            if(level < maxNum) {
                for(var i = 1; i <= level; i++) {
                    if(num === i) {
                        liStr = liStr + '<li class="level active"><a href="#">'+num+'</a></li>'
                    } else {
                        liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
                    }
                }

            }else {
                liStr = this.pageManage(num, level, maxNum)
            }
        }
        $prev.after(liStr)
        this.clickPage($prev, $next)
    },
    dataLength: 0,
    pageManage: function (num, level, maxNum) {
        var liStr = ''
        if(num > 5 && num < level - 5) {
            // 有两侧省略号的判断
            liStr = liStr + '<li class="level"><a href="#">'+1+'</a></li>'
            liStr = liStr + '<li class="level els"><a href="#">...</a></li>'

            // 显示的一直 10
            for(var j = num - 3; j <= num + 3; j++) {

                if(j === num) {

                    liStr = liStr + '<li class="level active"><a href="#">'+j+'</a></li>'

                } else {

                    liStr = liStr + '<li class="level"><a href="#">'+j+'</a></li>'

                }

            }

            liStr = liStr + '<li class="level els"><a href="#">...</a></li>'

        } else if(num <= 5) {

            for(var i = 1; i <= maxNum - 1; i++) {
                if(i === num) {
                    liStr = liStr + '<li class="level active"><a href="#">'+i+'</a></li>'
                } else {

                    liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
                }
            }
            liStr = liStr + '<li class="level els"><a href="#">...</a></li>'


        } else if(num >= level - 7) {

            liStr = liStr + '<li class="level"><a href="#">'+1+'</a></li>'
            liStr = liStr + '<li class="level els"><a href="#">...</a></li>'
            for(var i = level - 7; i <= level; i++) {

                if(i === num) {

                    liStr = liStr + '<li class="level active"><a href="#">'+i+'</a></li>'

                } else {

                    liStr = liStr + '<li class="level"><a href="#">'+i+'</a></li>'
                }
            }
        }
        return liStr
    }
}





