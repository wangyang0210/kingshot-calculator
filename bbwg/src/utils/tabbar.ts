export const tabbarList = [
  { pagePath: '/pages/index/index', text: '首页' },
  { pagePath: '/pages/database/index', text: '资料库' },
  { pagePath: '/pages/calculator/index', text: '计算器' },
  { pagePath: '/pages/user/index', text: '我的' }
]

export const switchTab = (index: number) => {
  const item = tabbarList[index]
  if (item && item.pagePath) {
    uni.redirectTo({
      url: item.pagePath,
      fail: () => {
        uni.showToast({
          title: '功能开发中',
          icon: 'none'
        })
      }
    })
  }
}
