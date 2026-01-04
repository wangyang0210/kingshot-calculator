export function navigate(url) {
  uni.navigateTo({ url })
}

export function back() {
  uni.navigateBack()
}

export async function subscribe(tmplIds) {
  return new Promise((resolve) => {
    wx.requestSubscribeMessage({
      tmplIds,
      success: resolve,
      fail: resolve
    })
  })
}

export function clipboard(text) {
  uni.setClipboardData({ data: text })
}

export function systemInfo() {
  return uni.getSystemInfoSync()
}
