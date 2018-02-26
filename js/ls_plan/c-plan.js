// $(function () {
    /**
     * Created by ls on 2017/7/3.
     */
    // 预案新增

    var $sectionManage = $('.section_manage')
    var $sectionIndex = $('.section_index')
    // 初始化 检查单部分隐藏
    // $sectionIndex.hide()
    $sectionManage.hide()

    var $planAdd = $('.plan_add')
    // 预案新增 显示检查单部分
    $planAdd.click(function () {
        planManageShow()
    })

    // 返回按钮 预案管理列表部分
    var $return = $('.return_icon')
    $return.on('click', function () {

        planManageShow(true)

    })


    // 控制预案管理部分的显示隐藏
    function planManageShow (isReturn) {

        deptManage.isGetData = false
        showTarget.$target = null
        selectDept.$target = null
        updateTarget.$target = null
        $mainDeptTarget = {}

        if(isReturn) {
            $sectionIndex.show()
            $sectionManage.hide()
        } else {
            $sectionIndex.hide()
            $sectionManage.show()
        }


    }


    // 初始化显示列表数据
    var $tbody = $('.body_content')
    // 获取输入框的内容
    var $evName = $('#evName')
    var $eventDesc = $('.event_desc')
    var $mainDepart = $('.select_mainDepart')
    var $selectDepart = $('.select_depart')
    // var $manageWay = $('.manage_way')
    var $uploadImg = $('.upload_img')

    // 图片上传
    var $uploadFile = $('.upload_file')

    // 分页
    var $pagination = $('.pagination')
    // 前进按钮
    var $next = $('#dataTable_next')

    // 后退按钮
    var $prev = $('#dataTable_previous')


    // 显示列表的长度
    var $showEntry = $('.select_entry')

    // 部门的多选框
    var $selectDepartCheck = $('.select_depart_check')
    // var $addDepart = $('.add_depart')

    var $addDepartCheckbox = $('.add_depart_checkbox')

    // 设置table包裹器的高度
    var height = $('body').height()

    var $bodyWrap = $('.body_wrap')

    $bodyWrap.height(height - 220)

    window.onresize = function () {

        var height = $('body').height()
        $bodyWrap.height(height - 220)

    }

    var initShow = {
        initUrl: 'case/list',
        // initUrl: './components/plan/data.json',
        initParam: '{ "pageSize": 1000,"pageIndex": 1,"searchParam": "" }',
        // ajax请求到的数据
        data: [],
        showData: [],
        // 初始化的显示列表的长度
        showEntryLen: $showEntry.val(),
        // 页面需要显示的内容的长度
        showContentLen: 15,
        // 请求到数据之后初始化显示
        showUI: function (start, end) {
            var htmlStr = ''

            if(this.data) {

                this.showData = this.data.slice(start, end)

                this.data.slice(start, end).forEach(function (item) {
                    htmlStr += '<tr data-id='+item.id+'><td>'+item.name+'</td><td>'+item.description+'</td><td><div class="plan_adjust" ><span class="glyphicon glyphicon-ok" data-toggle="tooltip" data-placement="top" title="预案启动"></span><span class="glyphicon glyphicon-file" data-info="watch" data-toggle="tooltip" data-placement="top" title="预案查看"></span><span class="glyphicon glyphicon-trash" data-info="delete" data-toggle="tooltip" data-placement="top" title="预案删除"></span><span class="glyphicon glyphicon-pencil" data-info="update" data-toggle="tooltip" data-placement="top" title="预案修改"></span></div></td></tr>'
                })

            }
            // this.data.forEach(function (item) {
            //     htmlStr += '<tr data-id='+item.id+'><td>'+item.name+'</td><td>'+item.description+'</td></tr>'
            // })

            if(end > this.data.length) {
                end = this.data.length
            }
            var flagNum = initShow.showContentLen - end + start
            // var flagNum = initShow.showContentLen - this.data.length
            if(flagNum > 0) {
                for(var i=0; i<flagNum; i++) {
                    htmlStr += '<tr><td>&nbsp</td><td>&nbsp</td><td> </td></tr>'
                }
            }

            $tbody.html(htmlStr)

            // 调整图标添加进去调用

            planAdjust()

            tbodyHover()

            // tooltip
            // $('[data-toggle="tooltip"]').tooltip()

        },
        // 获取初始化显示数据
        getData: function (data) {

            if(data.c.errorCode === '004') {
                showMsg('没有数据')
                initShow.data = []
                initShow.showUI.call(initShow, 0, initShow.showEntryLen)

                // 是否显示分页的dom
                pagination.pagingLevel.call(initShow, $next, $prev)

                hideLoding()
                return
            }
            if(data.f === 1) {

                hideLoding()
                // console.log(data.c.page.totalNum, 'totalNum')
                // initShow.totalNum = data.c.page.totalNum
                initShow.data = data.c.cases
                // 显示列表dom
                initShow.showUI.call(initShow, 0, initShow.showEntryLen)

                // 是否显示分页的dom
                pagination.pagingLevel.call(initShow, $next, $prev)

                data.c.cases.forEach(function (item) {
                    initShow.nameIdArr.push({
                        id: item.id,
                        name: item.name
                    })
                })

                initShow.nameArr = initShow.nameIdArr.map(function (item) {

                    return item.name
                })

            }

        },
        // 总的数据
        totalNum: 0,
        $pageTag: null,
        nameArr: [],
        nameIdArr: []

    }
    getJson(initShow.initUrl, initShow.getData, initShow.initParam)


    // 部门的显示
    var depts = {
        deptUrl: 'config/depts',
        param: '',
        data: [],
        // 选中部门的id
        selDeptId: '',
        getData: function (data) {
            depts.data = data.c.depts

            depts.showDepts()
        },
        // 显示部门列表
        showDepts: function () {
            // $selectDepart
            var htmlStr = ''
            var checkBoxStr = ''
            var planDeptStr = ''
            this.data.forEach(function (item, index) {

                htmlStr += '<option data-id='+item.id+'>'+item.name+'</option>'

                //checkBoxStr = checkBoxStr + '<label class="checkbox-inline"><input type="checkbox" data-id='+item.id+' data-val='+item.name+'>'+item.name+'</label>'

                checkBoxStr = checkBoxStr + '&nbsp;&nbsp;<span class="cb-container"><input type="checkbox" data-id='+item.id+' id=dept'+item.name+' data-val='+item.name+'><label for=dept'+item.name+' class="cb-label"></label></span>&nbsp;&nbsp;<span class="input_label">'+item.name+'</span>'

                //<span class="cb-container"><input type="checkbox" data-id='+checkList.id+' id='+checkList.content+' checked><label for='+checkList.content+' class="cb-label checked">

                planDeptStr = planDeptStr + '<li data-id='+item.id+'>'+item.name+'</li>'

            })
            // $selectDepart.html(htmlStr)
            // $mainDepart.html(htmlStr)
            $mainDepart.append(htmlStr)

            $selectDepart.html(planDeptStr)
            // 显示部门checkbox
            $selectDepartCheck.append(checkBoxStr)

            $addDepartCheckbox.html(checkBoxStr)

        },

        planDepartId: '0'
    }

    getJson(depts.deptUrl, depts.getData, depts.param)


    // 监听select的change事件 根据用户想显示的数据的大小显示数据

    $showEntry.change(function () {

        var len = Number(initShow.showEntryLen)
        var val = Number($(this).val())

        initShow.showEntryLen = val
        initShow.showUI.call(initShow, len*(pagination.num - 1), val+len*(pagination.num - 1), true)
        // 显示列表的变化改变分页的层次
        pagination.updatePageLevel.call(initShow,initShow.data)

    })


    // 监听分页标签的点击事件
    $pagination.click(pagination.clickCallback.bind(null, $next, $prev, initShow))


    // 选中的tr
    var selectTr = {
        target: null,
        id: ''
    }

    // 表格hover状态
    function tbodyHover () {
        var $trNode = $('.body_content tr')
        $trNode.hover(function (ev) {
            $trNode.removeClass('info')
            $(this).addClass('info')
            selectTr.target = $(this)[0]
            selectTr.id = $(this).attr('data-id')
        }, function (ev) {
            //$(this).removeClass('info')
        })
    }


    var watch = false
    var init = {
        // 导航条绑定click事件
        clickCallback: function (ev, $confirmBtn) {
            // 条件判断 确定按钮的文字信息
            var $manageTitle = $('.manage_title')

            switch (ev.target.dataset.info) {

                case 'add':
                    // 将之前保存的置空
                    addList = []

                    selectDept.$target = null
                    watch = false
                    modal.isUpdate = false

                    $manageTitle.html('预案新增')

                    $manageTitle.prev().attr('class', 'glyphicon glyphicon-plus')

                    $confirmBtn.html('确定新增')
                    $confirmBtn.attr('data-info', 'add')

                    $evName.val('')
                    $eventDesc.val('')
                    $mainDepart.val('')
                    $uploadImg.attr('src', '')
                    $taskList.html('')
                    $departListGroup.html('')

                    // 部门的多选框置为不选中状态
                    $addDepartCheckbox.find('input:checked').prop('checked', false)

                    init.contentState(false)

                    break
                //删除选中的预案
                case 'delete':

                    watch = false
                    modal.isUpdate = false

                    $manageTitle.html('预案删除')
                    $manageTitle.prev().attr('class', 'glyphicon glyphicon-minus')

                    $confirmBtn.html('确定删除')
                    $confirmBtn.attr('data-info', 'delete')
                    init.modalShowContent()
                    init.contentState(false)

                    break

                // 修改选中的预案
                case 'update':

                    modal.isUpdate = true
                    watch = false
                    $manageTitle.html('预案修改')
                    $manageTitle.prev().attr('class', 'glyphicon glyphicon-pencil')

                    $confirmBtn.html('确定修改')
                    $confirmBtn.attr('data-info', 'update')

                    init.contentState(false)
                    init.modalShowContent()

                    break

                // 预案查看
                case 'watch':
                    // 查看 页面的内容不能被编辑
                    $manageTitle.html('预案查看')
                    $manageTitle.prev().attr('class', 'glyphicon glyphicon-file')

                    init.contentState(true)

                    $confirmBtn.html('确定')
                    watch = true
                    $confirmBtn.attr('data-info', 'watch')
                    init.modalShowContent(true, 'watch')

                    break

            }

        },
        // 内容的显示状态
        contentState: function (isDisabled) {

            $evName.prop('disabled', isDisabled)
            $eventDesc.prop('disabled', isDisabled)
            //
            // $deptManageInfo.find('.btn').prop('disabled', isDisabled)
            // $checkListManage.find('.btn').prop('disabled', isDisabled)
            //
            // $uploadBtn.prop('disabled', isDisabled)
            // $confirmBtn.prop('disabled', isDisabled)

            if(isDisabled) {

                // 预案查看
                $deptManageInfo.parent().hide()
                $checkListManage.hide()

                $('#uploadForm').hide()
                $('.submit_manage').hide()

                $('.dept_task_content').css({
                    marginTop: '10px'
                })


            } else {

                $deptManageInfo.parent().show()
                $checkListManage.show()
                $('#uploadForm').show()
                $('.submit_manage').show()

                $('.dept_task_content').css({
                    marginTop: 0
                })

                var $flowSheetWrap = $('.flow_sheet_wrap')
                var $notPic = $('.not-pic')

                $flowSheetWrap.show()
                $notPic.hide()

            }

        },
        // 判断模态框是否显示内容，以及显示什么内容
        modalShowContent: function (isChanged, str) {

            if(selectTr.target) {

                var i = initShow.data.length
                var data = initShow.data

                while(i--) {

                    if(data[i].id === Number(selectTr.id)) {
                        // 预案单个查询
                        var param = {
                            id: data[i].id
                        }

                        getJson('case/single', this.getData.bind(null, isChanged, str), JSON.stringify(param))

                        return
                    }
                }


            }

        },
        getData: function (isChanged, str, data) {
            hideLoding()

            var targetData = data.c.case
            var mainDeptNo = targetData.mainDeptNo

            $evName.val(targetData.name)
            $eventDesc.val(targetData.description)
            init.list = targetData.list
            if(!init.list) {
                var deptStr = ''
                depts.data.forEach(function (dept) {
                    if(mainDeptNo === dept.id) {
                        deptStr = '<li class="list-group-item list-group-item-info" data-id='+dept.id+' data-val='+dept.name+'><span class="cb-container"><input type="checkbox" id='+dept.name+'><label for='+dept.name+' class="cb-label"></label></span>&nbsp;&nbsp;<span class="input_label">'+dept.name+'</span><span class="glyphicon glyphicon-star flag" style="float: right"></span></li>'
                    }
                })
                $departListGroup.html(deptStr)
                $taskList.html('')
                $uploadImg.attr('src', '')
                return
            }

            init.cloneList = [].concat(init.list)

            var $flowSheetWrap = $('.flow_sheet_wrap')
            var $notPic = $('.not-pic')

            // 显示部门
            var departStr = ''
            var deptCheckedArr = []

            init.list.forEach(function (item) {

                depts.data.forEach(function (dept) {
                    if (item.deptNo === dept.id) {
                        // 默认显示主部门的task列表
                        deptCheckedArr.push(dept.name)
                        if(item.deptNo === mainDeptNo) {
                            //departStr = departStr + '<li class="list-group-item" data-id='+dept.id+' data-val='+dept.name+'><label class="checkbox-inline"><input type="checkbox" checked>'+dept.name+'</label><span class="glyphicon glyphicon-plane flag" style="float: right"></span></li>'

                            departStr = departStr + '<li class="list-group-item list-group-item-info" data-id='+dept.id+' data-val='+dept.name+'><span class="cb-container"><input type="checkbox" id='+dept.name+'><label for='+dept.name+' class="cb-label"></label></span>&nbsp;&nbsp;<span class="input_label">'+dept.name+'</span><span class="glyphicon glyphicon-star flag" style="float: right"></span></li>'

                            $taskList.html('')
                            $mainDeptTarget.id = dept.id

                            if(isChanged) {

                                item.check.forEach(function (task) {
                                    // var $task = $('<li class="list-group-item"><input type="checkbox">&nbsp;<input type="text" disabled data-num='+task.number+' value='+task.number + '.' + task.content+'></li>')
                                    var $task = $('<li class="list-group-item"  draggable="true"><span class="cb-container"><input type="checkbox" id=num'+task.number+'><label for=num'+task.number+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+task.number+'</span><input type="text" data-num='+task.number+' value='+ task.content+'></li>')
                                    $taskList.append($task)
                                })

                            } else {

                                item.check.forEach(function (task) {
                                    // var $task = $('<li class="list-group-item"><input type="checkbox">&nbsp;<input type="text" data-num='+task.number+' value='+task.number + '.' + task.content+'></li>')
                                    var $task = $('<li class="list-group-item"  draggable="true"><span class="cb-container"><input type="checkbox" id=num'+task.number+'><label for=num'+task.number+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+task.number+'</span><input type="text" data-num='+task.number+' value='+ task.content+'></li>')
                                    $taskList.append($task)

                                })

                            }
                            if(str === 'watch') {

                                // 查看状态下 没有流程图就不显示图片的框
                                //item.image ? $uploadImg.attr('src', 'http://192.168.1.198:8080' + item.image) : $('.flow_sheet_wrap').hide()

                                if(item.image) {
                                    $uploadImg.attr('src', getImageUrl + item.image)
                                } else {
                                    $flowSheetWrap.hide()
                                    $notPic.show()

                                    $uploadImg.attr('src', '')
                                }


                            } else {

                                if(item.image) {
                                    $uploadImg.attr('src', getImageUrl + item.image)
                                } else {
                                    $uploadImg.attr('src', '')
                                }

                            }


                        } else {
                            // departStr = departStr + '<li class="list-group-item" data-id='+dept.id+' data-val='+dept.name+'><label class="checkbox-inline"><input type="checkbox" checked>'+dept.name+'</label></li>'
                            departStr = departStr + '<li class="list-group-item" data-id='+dept.id+' data-val='+dept.name+'><span class="cb-container"><input type="checkbox" id='+dept.name+'><label for='+dept.name+' class="cb-label"></label></span>&nbsp;&nbsp;<span class="input_label">'+dept.name+'</span></li>'

                        }

                    }

                })

            })

            // 部门列表
            $departListGroup.html(departStr)

            updateTarget.$target = $departListGroup.find('.list-group-item-info')


            // 获取数据之后点击部门列表
            deptManage.isGetData = true

            $(function () {

                var $text = $taskList.find('input[type=text]')

                Array.prototype.forEach.call($text, function (text) {
                    var $t = $(text)
                    var result = $t.val()
                    $t.val(result)
                })

                textBlur($text)

                planListDrag($taskList.find('.list-group-item'))

            })

            // 部门的添加的勾选
            Array.prototype.forEach.call($addDepartCheckbox.find('input'), function (checkbox) {
                var $checkbox = $(checkbox)
                var val = $checkbox.attr('data-val')
                if(deptCheckedArr.indexOf(val) > -1) {
                    $checkbox.prop('checked', true)
                } else {
                    $checkbox.prop('checked', false)
                }
            })

        },
        list: [],
        cloneList: []
    }

    // 导航点击事件
    var $nav = $('.nav')

    var $confirmBtn = $('.confirm_btn')

    $nav.click(function (ev) {

        init.clickCallback(ev, $confirmBtn)

    })
    $uploadFile.click(function (ev) {

        // 如果什么操作都没做
        if($('.depart_list_group').find('li').length === 0) {
            ev.preventDefault()
            showMsg('请先选择部门')
            return
        }

    })
    // 选择文件
    $uploadFile.change(function() {

            $uploadImg.attr('src', getObjectURL($(this)[0].files[0]))
            $('#uploadForm').submit()
        }
    )

    // 通过iframe获取form表单提交返回的数据
    var formResult = {
        imgUrl: ''
    }

    var list = []

    var check = []

    // 获取form表单提交返回的数据
    var $uploadForm = $('#uploadForm')

    $uploadForm.attr('action', serviceUrl + 'case/image')

    $uploadForm.submit(function () {
        // H5特性之FormData不刷新文件上传
        var data = new FormData($uploadForm[0])



        $.ajax({
            url: serviceUrl + 'case/image',
            type: 'POST',
            data: data,
            dataType: 'JSON',
            cache: false,
            processData: false,
            contentType: false,
            success:function(data){
                // console.log(data)
                if(data.c.flag === 0) {
                    if(data.c.errorCode === '001') {
                        showMsg('请先登录')
                        return
                    }
                    showMsg('图片上传失败')
                    return
                }
                // 解决一张图片不能上传超过两次的bug
                $uploadFile.val('')

                showMsg('图片上传成功')

                formResult.imgUrl = data.c.image
                // 点击上传提交图片成功保存一次

                // 修改状态下
                if(updateTarget.$target) {

                    var id = Number(updateTarget.$target.attr('data-id'))
                    init.cloneList.forEach(function (item) {

                        if(id === item.deptNo) {
                            item.image = data.c.image
                        }

                    })
                } else {

                    // 添加和查看的状态
                    if(!selectDept.$target) {
                        showMsg('没有选择部门')
                        return
                    }

                    var $input = $taskList.find('input[type=text]')

                    Array.prototype.slice.call($input).forEach(function (item) {

                        listTask.check.push({
                            number: Number(item.dataset.num),
                            content: item.value
                        })

                    })

                    listTask.image = data.c.image

                    listTasks.push(JSON.parse(JSON.stringify(listTask)))

                }


                // 新增状态下
                if(selectDept.$target) {

                    var addId = Number(selectDept.$target.attr('data-id'))
                    addList.forEach(function (item) {
                        if(item.deptNo === addId) {

                            item.image = data.c.image
                        }
                    })

                }
            }
        });

        return false

    })



    // 预案的增删改操作
    var modal = {
        add: function () {

            if(!$evName.val().trim()) {

                showMsg('请填写预案名称')

                return
            }
            if(!$mainDeptTarget || !$mainDeptTarget.id) {

                showMsg('请选择主部门')

                return
            }

            this.hideTaskDept(addList)

            // 确认新增发送ajax请求
            var url = 'case/add'
            // 确认主部门的id
            var param = {
                name: $evName.val(),
                description: $eventDesc.val(),
                // 主部门id $mainDepart
                mainDeptNo: $mainDeptTarget.id,
                list: addList,
            }

            var str = JSON.stringify(param)
            getJson(url, this.getData.bind(null, 'add'), str)

        },

        // 删除预案
        delete: function () {

            var url = 'case/delete'
            var id = Number(selectTr.id)
            var param = {"id": id}

            function searchIndex () {

                var i = initShow.data.length
                var data = initShow.data
                while(i--) {
                    if(data[i].id == selectTr.id) {
                        data.splice(i, 1)
                        return
                    }
                }

            }
            searchIndex()

            getJson(url, this.getData.bind(null, 'delete'), JSON.stringify(param))

            $(selectTr.target).remove()
            // 删除之后需要重新计算分页的数据
            pagination.updatePageLevel.call(initShow, initShow.data)

        },
        // 预案修改
        update: function () {

            if(!$evName.val().trim()) {
                showMsg('请填写预案名称')
                return
            }

            // 主部门没勾选提示勾选
            if(!$mainDeptTarget || !$mainDeptTarget.id) {
                showMsg('请选择主部门')
                return
            }

            this.hideTaskDept(init.cloneList)

            // 确认修改的时候显示
            // 点击上传

            // 没有点击上传
            var url = 'case/update'
            var param = {

                id: Number(selectTr.id),
                name: $evName.val(),
                description: $eventDesc.val(),
                // 主部门id $mainDepart
                mainDeptNo: $mainDeptTarget.id,
                list: init.cloneList,

            }

            var str = JSON.stringify(param)

            getJson(url, this.getData.bind(null, 'update'), str)
        },
        getData: function (param, data) {
            hideLoding()
            var show = data.c.case
            // console.log(data)
            if(data.c.flag === 0) {
                if(data.c.errorCode === '005') {

                    showMsg('预案名称重复')

                } else if(data.c.errorCode === '002') {
                    // console.log(data)
                    // showMsg('请输入任务描述')

                }
                return
            }

            listTasks = []

            switch (param) {
                case 'add':

                    planManageShow(true)

                    // 成功返回数据将数据注入页面
                    // 新增
                    var str = ''
                    var showLen = initShow.data.slice(initShow.showEntryLen * (pagination.num - 1)).length

                    if(showLen < Number(initShow.showEntryLen)) {
                        str += '<tr data-id='+show.id+'><td>'+show.name+'</td><td>'+show.description+'</td></tr>'
                        $tbody.append(str)
                    }


                    initShow.data.push(show)

                    pagination.updatePageLevel.call(initShow, initShow.data)

                    break
                case 'update':
                    planManageShow(true)


                    var $tdNodes = $(selectTr.target).children('td')

                    $($tdNodes[0]).html($evName.val())
                    $($tdNodes[1]).html($eventDesc.val())

                    // 更新名称
                    var id = Number(selectTr.id)
                    updateName(id, false, $evName.val())

                    break
                case 'delete':

                    planManageShow(true)

                    // 更新名称
                    var delId = Number(selectTr.id)
                    updateName(delId, true, '')
                    break
            }
        },
        // 是否是修改状态
        isUpdate: false,
        hideTaskDept: function (data) {
            var hideDept = []
            data.forEach(function (item) {
                if(item.check.length === 0) {
                    hideDept.push(item.deptNo)
                }
            })

            if(hideDept.length > 0) {
                var strArr = []
                depts.data.forEach(function (dept) {
                    if(hideDept.indexOf(dept.id) > -1) {
                        strArr.push(dept.name)
                    }

                })

                strArr = strArr.join(' , ')
                console.log(hideDept, strArr)
                showMsg('请部门'+strArr+'输入任务描述')
            }

        }
    }

    // 确认按钮的点击事件

    $confirmBtn.click(function () {
        showTarget.$target = null
        switch ($(this).attr('data-info')) {

            case 'add':
                // 新增
                modal.add()
                break
            case 'delete':
                // 删除
                modal.delete()
                break
            case 'update':
                // 修改
                modal.update()
                break

        }

    })


    // 图片上传
    function getObjectURL(file) {
        var url = null ;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file) ;
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file) ;
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file) ;
        }
        return url ;
    }

    // 搜索功能
    var result = {
        data: [],
        isSearch: false
    }

    /**
     * 搜索功能
     * @constructor
     */
    function Search () {
        // 搜索框
        var $search = $('.search')
        // 搜索图标
        var $searchIcon = $('.glyphicon-search')

        function searchCallBack () {
            // 获取输入框的内容
            var val = $search.val().trim()
            var reg = new RegExp(val, 'gi')
            // result.isSearch = true
            // result.data = []
            var param = {
                pageSize: 1000,
                pageIndex: 1,
                searchParam: ''
            }

            if(val) {
                // 根据输入的内容进行匹配

                param.searchParam = val
                getJson(initShow.initUrl, initShow.getData, JSON.stringify(param))

            } else {

                param.searchParam = ''
                getJson(initShow.initUrl, initShow.getData, JSON.stringify(param))

            }

        }

        $searchIcon.click(searchCallBack)

        $search.keyup(function(ev) {
            if(ev.keyCode === 13) {
                searchCallBack()
            }
        })

    }

    Search()


    /**
     * 预案调整
     */
    function planAdjust () {

        var $adjustIcon = $('.plan_adjust span')

        $adjustIcon.click(function (ev) {

            var $target = $(ev.target)
            if(ev.target.nodeName.toLowerCase() != 'span') {

                return
            }

            var reg = /ok/gi
            var reg2 = /remove/gi

            if(reg.test(ev.target.className)){

                // ev.target.className = 'glyphicon glyphicon-remove'

                // 预案启动发送请求
                var param = {'id': Number(selectTr.id), type: 1}

                getJson('case/start', getStartData.bind(null, $target), JSON.stringify(param))


            }else if(reg2.test(ev.target.className)) {

                ev.target.className = 'glyphicon glyphicon-ok'

                $target.attr('title', '预案启动')

                $target.css({
                    color: '#56A2CF'
                })



            } else {

                $sectionManage.show()
                $sectionIndex.hide()

                init.clickCallback(ev, $confirmBtn)

            }

        })

        function getStartData($target, data) {

            hideLoding()
            console.log(data, '.......')
            if(data.c.flag === 1) {
                // 成功启动预案

                $target.attr('class', 'glyphicon glyphicon-remove')

                // $target.attr('title', '预案已启动')

                $target.attr('data-original-title', '预案已启动')

                $target.css({
                    color: '#6B3252'
                })

            }

        }

    }


    /**
     * 检测预案名称的合法性
     * 不能重复
     */
    var $nameError = $('.name_error')
    // 名称是必须的
    var $requireName = $('.require_name')
    $evName.keyup(function () {

        var val = $(this).val().trim()
        var arr = initShow.nameArr

        if(val) {
            if(arr.indexOf(val) > -1) {

                $nameError.show()

            } else {
                $nameError.hide()

            }
            $requireName.hide()

        } else {

            $requireName.show()
            $nameError.hide()
        }

    })

    // 更新名称的变化
    /**
     *
     * @param id
     * @param isDel 是否是删除操作
     */
    function updateName (id, isDel, val) {

        initShow.nameIdArr.forEach(function (item, index, arr) {

            if(item.id === id) {
                if(isDel) {
                    arr.splice(index, 1)
                } else {
                    item.name = val
                }
            }

        })

        initShow.nameArr = initShow.nameIdArr.map(function (item) {
            return item.name
        })

    }

// })