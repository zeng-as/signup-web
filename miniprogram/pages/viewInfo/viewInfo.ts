// pages/viewInfo/viewInfo.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classes: [],
    mobile: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      search: this.search.bind(this),
      mobile: options.mobile
    })
    if (this.data.mobile) {
      this.search(this.data.mobile)
    }
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
  search(mobile: string) {
    if (!mobile) {
      return 
    }

    const that = this
    wx.request({
      url: 'https://www.szmyxdi.com/signup/getSignupRecords',
      header: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      data: {mobile: mobile},
      success: function(data) {
        if (data.data.code === '200') {
          if (data.data.data) {
            that.setData({
              classes: data.data.data
            })
          }
        } else {
          wx.showToast({
            title: '查询失败', 
            icon: 'none'
          })
        }
      }
    })
    return new Promise((resolve) => {
      resolve([])
    })
  },
  selectResult(e: { detail: any }) {
    console.log('select result', e.detail)
  },
})