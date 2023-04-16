// pages/signup.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: '',
      organization: '',
      post: '',
      mobile: '',
      area: '',
      email: '',
      classes: null,
      fileIds: [],
    },
    formRules: [
      {name:"name",rules:{required:true,message:'请填写姓名'}},
      {name:"organization",rules:{required:true,message:'请填写单位名称'}},
      {name:"post",rules:{required:true,message:'请填写职称'}},
      {name:"mobile",rules:[{required:true,message:'请填写手机号码'},{mobile:true,message:'手机号格式不正确'}]},
      {name:"area",rules:{required:true,message:'请填写所在地'}},
      {name:"email",rules:[{required:true,message:'请填写邮箱'},{email:true,message:'邮箱格式不正确'}]},
      {name:"classes",rules:{minlength:1,message:'请选择学习班'}},
      {name:"fileIds",rules:{minlength:1,message:'请上传缴费凭证'}}
    ],
    errorMsg: '',
    classesItems: [
      {name: '第1期', value: '7', checked:false}
    ],
    files: [],
    isAgree: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })

    // 获取学习班信息
    wx.request({
      url: 'https://www.szmyxdi.com/signup/getValidClasses/6',
      method: 'GET',
      success: function(data) {
        console.log(data)
        var classesItems = that.data.classesItems
        if (data.data.code === '200') {
          for (let i = 0; i < data.data.data.length; i++) {
            const ele = data.data.data[i];
            classesItems[i] = {'name': '['+ ele.currentNum + '/' + ele.maxNum + '] ' + ele.name, 'value': ele.id, 'checked': false};
          }
          that.setData({
            classesItems: classesItems
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  /**
   * 点击复制卡号
   */
  copyCardno() {
    wx.setClipboardData({
      data: '755918767710901',
      success: function () {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  submitForm() {
    console.log(this.data.form)
    const that = this
    this.selectComponent('#form').validate((valid: boolean, errors: { message: string; rule: {}; name: string }[]) => {
      console.log(that.data.isAgree)
        if (!that.data.isAgree) {
          valid = false;
          errors = errors ? errors : []
          errors.push({message: "请阅读并同意隐私协议", rule: {}, name:"isAgree"})
        }
        console.log('valid', valid, errors)

        if (!valid) {
            const firstError = Object.keys(errors)
            if (firstError.length) {
                this.setData({
                  errorMsg: errors[firstError[0]].message
                })
            }
        } else {
          wx.request({
            url: 'https://www.szmyxdi.com/signup/signup',
            header: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            data: this.data.form,
            success: function(data) {
              console.log(data)
              if (data.data.code === '200') {
                wx.showToast({
                  title: '报名成功'
                })
                setTimeout(() => {
                  wx.navigateTo({url: '../viewInfo/viewInfo?mobile=' + that.data.form.mobile})
                }, 1000)
              } else {
                wx.showToast({title: data.data.desc, icon: 'none'})
              }
            }
          })
        }
    })
  },
  formInputChange(e) {
    const {field} = e.currentTarget.dataset
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },
  classesChange: function (e: { detail: { value: any } }) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);

    var classesItems = this.data.classesItems, values = e.detail.value;
    for (var i = 0, lenI = classesItems.length; i < lenI; ++i) {
      classesItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if(classesItems[i].value == values[j]){
          classesItems[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      classesItems: classesItems,
      [`form.classes`]: e.detail.value
    });
  },
  selectFile(files: any) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  uplaodFile(files: { tempFilePaths: any[] }) {
    console.log('upload files', files)
    const that = this
    var tempUrls = new Array
    // 文件上传的函数，返回一个promise
    return new Promise((resolve) => {
      files.tempFilePaths.forEach(tempFilePaths => {
        wx.uploadFile({
          url: 'https://www.szmyxdi.com/signup/fileUpload',
          filePath: tempFilePaths,
          name: 'files[]',
          success(res) { //上传成功
              var data = (JSON.parse(res.data)).data;
              //成功调用接口
              //格式必须是resolve({ urls: [data] })
              var fileIds = that.data.form.fileIds.concat(data.id);
              that.setData({
                [`form.fileIds`]: fileIds
              });
              tempUrls.push(data.url)
              if (tempUrls.length == files.tempFilePaths.length) {
                resolve({urls: tempUrls})
              }
          }
        })
      });
    })
  },
  uploadError(e: { detail: any }) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e: { detail: any }) {
    console.log('upload success', e.detail)
  },
  delimg(e: { detail: { item: any; index: number } }) {
    console.log(e)
    this.data.files.splice(this.data.files.findIndex(item => item == e.detail.item), 1)
    this.data.form.fileIds.splice(e.detail.index, 1)
  },
  bindAgreeChange(e: { detail: { value: string | any[] } }) {
    this.setData({
      isAgree: !!e.detail.value.length
    })
  },
  refresh() {
    const that = this
    wx.request({
      url: 'https://www.szmyxdi.com/signup/getValidClasses/6',
      method: 'GET',
      success: function(data) {
        console.log(data)
        var classesItems = that.data.classesItems
        if (data.data.code === '200') {
          for (let i = 0; i < data.data.data.length; i++) {
            const ele = data.data.data[i];
            classesItems[i] = {'name': '['+ ele.currentNum + '/' + ele.maxNum + '] ' + ele.name, 'value': ele.id, 'checked': false};
          }
          that.setData({
            classesItems: classesItems
          });
        }
      }
    })
  }
})