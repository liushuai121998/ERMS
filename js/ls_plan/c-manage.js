// $(function () {
    /**
     * Created by ls on 2017/7/10
     */

    // $confirmBtn.attr('disabled', false)
    /**
     *  部门相关操作
     */
    (function () {
        // 添加预案部门确定按钮
        var $confirmAddPlanDept = $('.confirm_add_plan_dept')
        // 添加部门
        $confirmAddPlanDept.click(function () {
            deptManage.add()
        })
        // var $cancelAddPlanDept = $('.cancel_add_plan_dept')
        // $cancelAddPlanDept.click(function () {
        //
        //     $addDepartCheckbox.find('input[type=checkbox]').prop('checked', false)
        //
        // })

        // 置为主部门
        var $setMainDeptBtn = $('.set_main_dept')

        $setMainDeptBtn.click(function () {

            if(showTarget.$target) {
                deptManage.setMainDept(showTarget.$target)
                return
            }

            if(updateTarget.$target){
                deptManage.setMainDept(updateTarget.$target)
                return
            }

            if(selectDept.$target){
                deptManage.setMainDept(selectDept.$target)
                return

            }

        })

        // 删除部门
        var $deleteDept = $('.delete_dept')
        $deleteDept.click(function () {

            var $checked = $departListGroup.find('li').find('input:checked')

            var $li = $checked.parent().parent()
            if($li.length === 0) {
                return
            }

            if(showTarget.$target) {
                // 删除
                deptManage.deleteDept($li, 'delete')
                return

            }
            if(updateTarget.$target) {

                // 修改状态
                deptManage.deleteDept($li, 'update')

                return

            }
            if(selectDept.$target) {
                // 添加状态

                deptManage.deleteDept($li, 'add')

                return
            }

        })

        //    取消按钮
        var $cancelBtn = $('.cancel_btn')
        $cancelBtn.click(function () {
            $mainDeptTarget = {}
            $sectionIndex.show()
            $sectionManage.hide()
        })

    })()

    var $departListGroup = $('.depart_list_group')
    var $deptManageInfo = $('.dept_manage_info')
    var $checkListManage = $('.check_list_manage')

    // 主部门保存的对象
    var $mainDeptTarget = {}

    var deptManage = {
        // 添加预案部门
        add: function () {

            // 添加预案部门
            var $checkedInput = $addDepartCheckbox.find('input:checked')

            // 没有勾选的部门
            var $noCheckedInput = $addDepartCheckbox.find('input:not(:checked)')

            var $li = $departListGroup.find('li')
            var departStr = ''

            var idArr = []



            if($li.length > 0) {
                Array.prototype.slice.call($li).forEach(function (item) {
                    idArr.push(item.dataset.id)
                })
            } else {
                Array.prototype.slice.call($checkedInput).forEach(function (item) {
                    var id = item.dataset.id
                    addList.push({
                        deptNo: Number(id),
                        check: [],
                        image: ''
                    })
                })
            }
            Array.prototype.slice.call($checkedInput).forEach(function (item) {

                var id = item.dataset.id

                if(idArr.indexOf(id) < 0) {
                    // departStr = departStr + '<li class="list-group-item" data-id='+id+' data-val='+item.dataset.val+'><label class="checkbox-inline"><input type="checkbox">'+item.dataset.val+'</label></li>'
                    departStr = departStr + '<li class="list-group-item" data-id='+id+' data-val='+item.dataset.val+'><span class="cb-container"><input type="checkbox" id=showDept'+id+'><label for=showDept'+id+' class="cb-label"></label></span>&nbsp;&nbsp;<span class="input_label">'+item.dataset.val+'</span></li>'

                    // 添加部门 修改状态下
                    if(updateTarget.$target) {
                        init.cloneList.push({
                            deptNo: Number(id),
                            check: [],
                            image: ''
                        })

                    }

                    // 新增状态下
                    if(selectDept.$target) {
                        console.log('...........')
                        addList.push({
                            deptNo: Number(id),
                            check: [],
                            image: ''
                        })


                    }

                }

            })

            // 没有选中的
            Array.prototype.forEach.call($noCheckedInput, function (item) {

                var $noChecked = $(item)
                var id = $noChecked.attr('data-id')

                if($mainDeptTarget && $mainDeptTarget.id === Number(id)) {
                    $mainDeptTarget.id = ''
                }

                if(idArr.indexOf(id) > -1) {

                    var index = idArr.indexOf(id)
                    $li[index].remove()

                    // 修改状态下
                    if(updateTarget.$target) {

                        deptManage.spliceDept(init.cloneList, id)
                        deptManage.updateDept(updateTarget.$target, init.cloneList)

                    }

                    // 新增状态下
                    if(selectDept.$target) {

                        deptManage.spliceDept(addList, id)

                        deptManage.updateDept(selectDept.$target, addList)

                    }

                }
            })

            $departListGroup.append(departStr)

            if($departListGroup.find('.list-group-item-info').length === 0 ) {

                var $beginShow = $($departListGroup.find('.list-group-item')[0])
                $beginShow.addClass('list-group-item-info')
                // 添加部门 修改状态下
                if(updateTarget.$target) {
                    updateTarget.$target = $beginShow
                    return
                }

                // 新增状态下
                selectDept.$target = $beginShow

            }

        },

        // 置为主部门
        setMainDept: function ($target) {

            if($target) {
                // 选中li 并且input是checked
                // var isChecked = $target.find('input[type=checkbox]').prop('checked')
                // if(isChecked) {

                    // if($target.isFirst) {
                    //
                    //     return
                    // }

                    var $span = $departListGroup.find('.flag')
                    var $mainFlag = $departListGroup.find('.main_flag')
                    $mainFlag.removeClass('main_flag')
                    $span.remove()

                    $target.isFirst = true
                    $target.addClass('main_flag')
                    $target.append('<span class="glyphicon glyphicon-star flag" style="float: right"></span>')

                    $mainDeptTarget.$target = $target.clone()

                    $mainDeptTarget.id = $target.attr('data-id')

                    this.planDepart()

                }

            // }

        },

        // 删除部门
        deleteDept: function ($target, str) {
            $target.remove()

            switch (str) {
                case 'add':
                    // 新增状态下
                    // $taskList.html('')
                    // $uploadImg.attr('src', '')
                    deptManage.spliceDept(addList, $target)

                    deptManage.updateDept(selectDept.$target, addList)
                    break
                case 'update':
                    // $taskList.html('')
                    // $uploadImg.attr('src', '')
                    deptManage.spliceDept(init.cloneList, $target)
                    deptManage.updateDept(updateTarget.$target, init.cloneList)

                    break
                case 'delete':

                    // 图片和列表都需要删除
                    $taskList.html('')
                    $uploadImg.attr('src', '')

                    break
            }


        },

        // 其他预案部门的检查单事件
        planDepart: function () {

            var $planDepart = $departListGroup.find('li:not(.main_flag)')
            deptClick($planDepart, false)

        },

        // 是否获取到部门数据，进行展示
        isGetData: false,

        // 保存获取到的deptNo
        deptNoArr: [],

        handle: {},
        updateDept: function ($target, data) {

            var $updateLi = $departListGroup.find('li')

            if($updateLi.length === 0) {

                $taskList.html('')
                $uploadImg.attr('src', '')

            } else {

                $target = $($updateLi[0])

                this.handle.showTaskList(Number($target.attr('data-id')), data)

            }

        },
        spliceDept: function (data, $target) {
            var flag = 0
            var spliceIdArr = []

            Array.prototype.forEach.call($target, function (target) {

                var id = $(target).attr('data-id')

                if(id == $mainDeptTarget.id) {
                    // 删除的是主部门
                    $mainDeptTarget.id = ''
                }

                data.forEach(function (list, index, arr) {

                    if(list.deptNo === Number(id)) {

                        spliceIdArr.push(list.deptNo)

                        arr.splice(index-flag, 1)
                        flag++

                    }
                })

            })

            // 更新checkbox 添加部门弹框的选中状况
            var $allCheckBox = $addDepartCheckbox.find('input[type=checkbox]')
            Array.prototype.forEach.call($allCheckBox, function (checkbox) {

                var $checkbox = $(checkbox)

                var id = Number($checkbox.attr('data-id'))

                if(spliceIdArr.indexOf(id) > -1) {
                    $checkbox.prop('checked', false)
                }

            })
        }
    }


    /**
     * 部门列表监听click事件
     * @type {number}
     */
    // 新增状态下
    var selectDept = {
        $target: null,
        // addState: function (id) {
        //
        //     // 新增状态下
        //     if(addList.length < 1) {
        //
        //         addList.push({
        //             deptNo: id,
        //             check: [],
        //             image: ''
        //         })
        //
        //         // $taskList.html('')
        //         // $uploadImg.attr('src', '')
        //
        //     } else {
        //
        //         addList.forEach(function (item) {
        //
        //             if(item.deptNo != id) {
        //
        //                 addList.push({
        //                     deptNo: id,
        //                     check: [],
        //                     image: ''
        //                 })
        //
        //             }
        //
        //         })
        //
        //
        //     }
        //
        //     console.log(addList, 'addList addList')
        // }
    }

    var showTarget = {
        $target: null
    }

    // 修改状态下点击的部门信息
    var updateTarget = {
        $target: null
    }

    // 保存列表 相关信息
    var listTasks = []

    var listTask = {
        deptNo: '',
        check: [],
        image: ''
    }


    // 新增的状态
    var addList = []

    deptClick($departListGroup, true)

    function deptClick ($dept, isGroup) {

        var handle = {

            clickCallback: function (ev) {

                updateTarget.$target = null

                isGroup ? $dept.find('.list-group-item').removeClass('list-group-item-info') : $dept.parent().find('.list-group-item').removeClass('list-group-item-info')
                var $target = $(ev.target)
                var nodeName = ev.target.nodeName.toLowerCase()
                if(nodeName === 'input') {

                    $target.parent().parent().addClass('list-group-item-info')
                    selectDept.$target = $target.parent().parent()
                    this.flagTarget($target)

                } else if(nodeName === 'span') {

                    $target.parent().addClass('list-group-item-info')
                    selectDept.$target = $target.parent()
                    this.flagTarget($target.children('input'))

                } else {

                    $target.addClass('list-group-item-info')
                    selectDept.$target = $target
                    this.flagTarget($target.find('input'))

                }
                var id = Number(selectDept.$target.attr('data-id'))

                listTask.deptNo = id
                var idArr = []


                addList.forEach(function (item) {
                    idArr.push(item.deptNo)
                    // 相等的状态
                    if(item.deptNo === id) {

                        $taskList.html('')
                        if(item.check.length > 0) {

                            item.check.forEach(function (task) {

                                // var $task = $('<li class="list-group-item"><input type="checkbox">&nbsp;<input type="text" disabled data-num='+task.number+' value='+task.number + '.' + task.content+'></li>')
                                var $task = $('<li class="list-group-item" draggable="true"><span class="cb-container"><input type="checkbox" id=num'+task.number+'><label for=num'+task.number+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+task.number+'</span><input type="text" data-num='+task.number+' value='+ task.content+'></li>')
                                $taskList.append($task)

                            })

                        }

                        if(item.image) {
                            $uploadImg.attr('src', getImageUrl + item.image)
                        } else {

                            $uploadImg.attr('src', '')
                        }


                    }

                })


                if(idArr.indexOf(id) < 0) {

                    $taskList.html('')
                    $uploadImg.attr('src', '')

                }

                $(function () {

                    planListDrag($taskList.find('.list-group-item'))
                })


            },
            flagTarget: function ($target) {
                if(!isGroup && $target.prop('checked')) {

                    // var $input = $taskList.find('input[type=text]')
                    // Array.prototype.slice.call($input).forEach(function (item) {
                    //     listTask.check.push({
                    //         number: item.dataset.num,
                    //         content: item.value
                    //     })
                    // })

                    listTask = {
                        deptNo: '',
                        check: [],
                        image: ''
                    }

                    $taskList.empty()
                    $uploadImg.attr('src', '')
                }
            },
            // 获取信息进行展示
            getDataShow: function (ev) {

                this.commonMethod(showTarget, ev)

                this.showTaskList(Number(showTarget.$target.attr('data-id')), init.cloneList)

            },


            // 展示任务的数据
            showTaskList: function (id, list) {
                var i = 0
                deptManage.deptNoArr = []
                if(!init.list) {
                    return
                }

                var $flowSheetWrap = $('.flow_sheet_wrap')
                var $notPic = $('.not-pic')

                list.forEach(function (item) {

                    // 保存deptNo
                    // deptManage.deptNoArr.push(item.deptNo)

                    if(item.deptNo === id) {
                        i++
                        $taskList.html('')
                        // 查看的状态
                        if(watch) {

                            item.check.forEach(function (task) {
                                // var $task = $('<li class="list-group-item"><input type="checkbox">&nbsp;<input type="text" disabled data-num='+task.number+' value='+task.number + '.' + task.content+'></li>')
                                var $task = $('<li class="list-group-item" draggable="true"><span class="cb-container"><input type="checkbox" id=num'+task.number+'><label for=num'+task.number+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+task.number+'</span><input type="text"  data-num='+task.number+' value='+ task.content+'></li>')
                                $taskList.append($task)

                            })

                            if(item.image) {

                                $uploadImg.attr('src', getImageUrl + item.image)
                            } else {

                                $flowSheetWrap.hide()
                                $notPic.show()

                            }


                        } else {

                            // 删除 修改的状态

                            item.check.forEach(function (task) {
                                // var $task = $('<li class="list-group-item"><input type="checkbox">&nbsp;<input type="text" data-num='+task.number+' value='+task.number + '.' + task.content+'></li>')
                                var $task = $('<li class="list-group-item" draggable="true"><span class="cb-container"><input type="checkbox" id=num'+task.number+'><label for=num'+task.number+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+task.number+'</span><input type="text"  data-num='+task.number+' value='+ task.content+'></li>')
                                $taskList.append($task)

                            })


                            if(item.image) {

                                $uploadImg.attr('src', getImageUrl + item.image)

                            } else {
                                $uploadImg.attr('src', '')
                                $notPic.hide()
                                $flowSheetWrap.show()

                            }

                        }

                    }
                })

                if(i === 0) {
                    $taskList.html('')
                    $uploadImg.attr('src', '')
                }

                $(function () {

                    planListDrag($taskList.find('.list-group-item'))
                })

            },

            // 读取数据之后修改数据
            updateData: function (ev) {

                this.commonMethod(updateTarget, ev)

                // 显示数据
                this.showTaskList(Number(updateTarget.$target.attr('data-id')), init.cloneList)

            },

            // 公共的方法
            commonMethod: function (updateTarget, ev) {

                var $target = $(ev.target)
                $dept.find('.list-group-item').removeClass('list-group-item-info')

                var nodeName = ev.target.nodeName.toLowerCase()
                if(nodeName === 'input') {
                    $target.parent().parent().addClass('list-group-item-info')
                    updateTarget.$target = $target.parent().parent()
                } else if(nodeName === 'span') {
                    $target.parent().addClass('list-group-item-info')
                    updateTarget.$target = $target.parent()
                } else {
                    $target.addClass('list-group-item-info')
                    updateTarget.$target = $target
                }

                listTask.deptNo = updateTarget.$target.attr('data-id')
            }

        }

        $dept.click(function (ev) {

            if(!deptManage.isGetData) {
                // 新增数据
                handle.clickCallback(ev)

            }else {
                // 读取数据

                if(modal.isUpdate) {
                    // 修改数据
                    handle.updateData(ev)

                }else {
                    // 不修改
                    handle.getDataShow(ev)
                }

            }

            var $text = $taskList.find('input[type=text]')

            textBlur($text)

        })

        deptManage.handle = handle
    }


    /**
     * 新建任务
     */
    var $taskList = $('.task_list')
    var $addTask = $('.add_task')

    $addTask.click(function () {

        // if(!$mainDeptTarget) {
        //     return
        // }
        // if (this.id !== selectDept.id) {
        //
        // }
        // 新增
        if (selectDept.$target) {
            var id = Number(selectDept.$target.attr('data-id'))
            // if(!this.id) {
            //     console.log('first id id')
            //     // 新建任务的时候执行一次添加
            //
            //     selectDept.id = id
            //     this.id = id
            //     selectDept.addState(id)
            //
            // } else {
            //
            //     if(this.id != id) {
            //         console.log('hello id id')
            //         selectDept.addState(id)
            //         this.id = id
            //     }
            // }
        }


        if($departListGroup.find('.list-group-item-info').length < 1) {

            showMsg('请选择部门')
            return
        }

        var len = $taskList.find('li').length

        taskManage.addTask(len)

    })
    /**
     * 删除任务
     * @type {*}
     */
    var $deleteTask = $('.delete_task')

    $deleteTask.click(function () {

        if($departListGroup.find('.list-group-item-info').length < 1) {
            showMsg('请选择部门')
            return
        }

        taskManage.deleteTask()


    })

    /**
     * 任务的管理
     * @type {{addTask: taskManage.addTask, deleteTask: taskManage.deleteTask}}
     */
    var taskManage = {
        // 添加任务
        addTask: function (num) {

            num++
            // var $task = $('<li class="list-group-item"><input type="checkbox">&nbsp;<input type="text" data-num='+num+'></li>')
            var $task = $('<li class="list-group-item" draggable="true"><span class="cb-container"><input type="checkbox" id=task'+num+'><label for=task'+num+' class="cb-label"></label></span>&nbsp;<span class="task_num">'+num+'</span><input type="text" data-num='+num+'></li>')

            $taskList.append($task)

            var $text = $taskList.find('input[type=text]')

            textBlur($text, num)

            // checkList($task.find('input[type=text]'), num)

            this.isUpdate = false

            //修改的状态下
            if(updateTarget.$target) {
                var id = Number(updateTarget.$target.attr('data-id'))
                init.cloneList.forEach(function (item) {
                    if(id === item.deptNo) {
                        item.check.push({
                            number: num,
                            content: ''
                        })
                    }
                })
            }

            // 新增状态下
            if(selectDept.$target) {
                var addId = Number(selectDept.$target.attr('data-id'))

                addList.forEach(function (item) {
                    if(addId === item.deptNo) {
                        item.check.push({
                            number: num,
                            content: ''
                        })
                    }
                })

            }

            $(function () {
                planListDrag($taskList.find('.list-group-item'))
            })


        },
        // 删除任务
        deleteTask: function () {
            // 获取所有选中的task
            $taskList.find('input:checked').parent().parent().remove()

            // 剩余的input重新排序
            var $input = $taskList.find('input[type=text]')

            // 重新修改item.check 的值

            var arr = []

            Array.prototype.slice.call($input).forEach(function (input, index) {

                var $el = $(input)

                // 更新索引
                $el.prev().html(index + 1)
                // $el.val($el.val())
                $el.attr('data-num', index+1)

                arr.push({
                    number: index + 1,
                    content: $el.val()
                })


            })

            //修改的状态下
            if(updateTarget.$target) {
                var id = Number(updateTarget.$target.attr('data-id'))
                init.cloneList.forEach(function (item) {
                    if(id === item.deptNo) {
                        item.check = arr
                    }
                })
            }

            // 新增状态下
            if(selectDept.$target) {
                var addId = Number(selectDept.$target.attr('data-id'))

                addList.forEach(function (item) {
                    if(addId === item.deptNo) {
                        item.check = arr
                    }
                })

            }


            $(function () {
                planListDrag($taskList.find('.list-group-item'))
            })

        },
        isUpdate: false
    }

    /**
     * text 输入框失去焦点
     *
     */
    function textBlur ($text, num) {

        $text.on('blur', function () {
            var that = this
            var val = this.value

            var textNum = Number($(this).attr('data-num'))

            //修改的状态下
            if(updateTarget.$target) {

                var id = Number(updateTarget.$target.attr('data-id'))

                init.cloneList.forEach(function (item, index, arr) {

                    if(id === item.deptNo) {
                        // 显示
                        arr[index].check.forEach(function (check) {


                            if(check.number === textNum) {
                                check.content = val
                            }

                        })

                    }
                })
            }

            // 新增状态下
            if(selectDept.$target) {
                var addId = Number(selectDept.$target.attr('data-id'))

                addList.forEach(function (item, index) {

                    if(item.deptNo === addId) {
                        addList[index].check.forEach(function (check) {


                            if(check.number === textNum) {
                                check.content = val
                            }

                        })

                    }
                })

            }

        })
    }






// })
