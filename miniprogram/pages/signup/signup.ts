// pages/signup.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      name: '曾小水',
      organization: '测试单位',
      post: '职称123',
      mobile: '15712341234',
      area: '广东省深圳市',
      email: 'asd@qq.com',
      classes: null,
      files: null,
    },
    formRules: [
      {name:"name",rules:{required:true,message:'请填写姓名'}},
      {name:"organization",rules:{required:true,message:'请填写单位名称'}},
      {name:"post",rules:{required:true,message:'请填写职称'}},
      {name:"mobile",rules:[{required:true,message:'请填写手机号码'},{mobile:true,message:'手机号格式不正确'}]},
      {name:"area",rules:{required:true,message:'请填写所在地'}},
      {name:"email",rules:[{required:true,message:'请填写邮箱'},{email:true,message:'邮箱格式不正确'}]},
      {name:"classes",rules:{minlength:1,message:'请选择学习班'}},
      {name:"files",rules:{minlength:1,message:'请上传报名凭证'}}
    ],
    errorMsg: '',
    classesItems: [
      {name: '第1期', value: '1', checked:false},
      {name: '第2期', value: '2', checked:false},
      {name: '第3期', value: '3', checked:false},
      {name: '第4期', value: '4', checked:false},
      {name: '第5期', value: '5', checked:false}
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    // 获取学习班信息
    wx.request({
      url: 'http://localhost:10086/getRemainPlaces',
      method: 'GET',
      success: function(data) {
        console.log(data)
        var classesItems = that.data.classesItems
        if (data.data.code === '200') {
          for (let i = 0; i < data.data.data.length; i++) {
            const ele = data.data.data[i];
            classesItems[i].name = '['+ ele.currentNum + '/' + ele.maxNum + '] ' + ele.name 
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
      success: function (res) {
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
    this.selectComponent('#form').validate((valid, errors) => {
        console.log('valid', valid, errors)
        if (!valid) {
            const firstError = Object.keys(errors)
            if (firstError.length) {
                this.setData({
                  errorMsg: errors[firstError[0]].message
                })
            }
        } else {
            wx.showToast({
                title: '校验通过'
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
  classesChange: function (e) {
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
})