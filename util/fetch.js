//  发送请求的公共函数
module.exports = (url, data) => {
	return new Promise((resolve, reject) => {
		wx.request({
      		url: `https://www.dhdjk.net/wxapp/${url}`,
				data: data,
				success: resolve,
				fail: reject
			});
	})
}
