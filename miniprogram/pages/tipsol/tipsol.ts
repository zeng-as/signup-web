// pages/tipsol/tipsol.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAgree: false,
    isDisabled: true,
    second: 5,
    buttonName: "5秒后可用"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    var interval = setInterval(function(){
      var second = that.data.second
      if (second <= 1) {
        that.setData({
          second: 0,
          isDisabled: false,
          buttonName: "报名"
        })
        clearInterval(interval)
      } else {
        second--
        that.setData({
          second: second,
          buttonName: second + "秒后可用"
        })
      }
    }, 1000);
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
  bindAgreeChange(e: { detail: { value: string | any[] } }) {
    this.setData({
      isAgree: !!e.detail.value.length
    })
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
  submit() {
    if (!this.data.isAgree) {
      wx.showToast({
        title: '请勾选"已阅读并同意《报名前须知》"', 
        icon: 'none'
      })
      return
    }
    wx.navigateTo({url: '../signupol/signupol'})
  }
})