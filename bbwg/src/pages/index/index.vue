<template>
  <view class="page-container">
    <!-- Header -->
    <TheHeader title="奔奔小精灵" />

    <!-- Main Content -->
    <scroll-view scroll-y class="main-content">
      <view class="hero-card">
        <view class="hero-title">宝箱兑换中心</view>
        <view class="hero-subtitle">输入神秘代码，领取王国奖励</view>
        
        <!-- Input Section -->
        <view class="input-wrapper">
          <input 
            class="code-input" 
            placeholder="点击输入宝箱密码..." 
            placeholder-class="input-placeholder"
            v-model="inputCode"
          />
          <view class="lock-btn">
            <wd-icon name="lock-on" size="20px" color="#4A3B32"></wd-icon>
          </view>
        </view>
        
        <!-- Action Button -->
        <button class="exchange-btn" @click="handleExchange">
          立即兑换奖励
        </button>
      </view>

      <!-- List Section -->
      <view class="list-section">
        <view class="list-header">
          <text class="section-title">近期有效兑换码</text>
          <view class="hot-badge">HOT</view>
        </view>
        
        <view class="code-list">
          <view v-for="(item, index) in codeList" :key="index" class="code-card">
            <view class="card-left">
              <view class="code-row">
                <text class="code-text">{{ item.code }}</text>
                <view v-if="item.isNew" class="new-tag">NEW</view>
              </view>
              <text class="reward-text">奖励：{{ item.reward }}</text>
            </view>
            <view class="card-right" @click="copyCode(item.code)">
              <wd-icon name="file-paste" size="20px" color="#4A3B32"></wd-icon>
            </view>
          </view>
        </view>
      </view>
      
      <!-- Bottom Spacer for TabBar -->
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- TabBar -->
    <TheTabBar v-model="currentTab" @change="onTabChange" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TheTabBar from '@/components/TheTabBar.vue'
import TheHeader from '@/components/TheHeader.vue'
import { switchTab } from '@/utils/tabbar'

const currentTab = ref(0)
const inputCode = ref('')

const codeList = ref([
  { code: 'BENBEN666', reward: '500x宝石, 10x 抽奖券', isNew: true },
  { code: 'KINGDOM2024', reward: '金币 x8888, 体力 x50', isNew: false },
  { code: 'HAPPYWEEKEND', reward: '随机蓝色装备箱 x1', isNew: false }
])

const handleExchange = () => {
  if (!inputCode.value) {
    uni.showToast({ title: '请输入兑换码', icon: 'none' })
    return
  }
  uni.showLoading({ title: '兑换中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '兑换成功', icon: 'success' })
    inputCode.value = ''
  }, 1000)
}

const copyCode = (code: string) => {
  uni.setClipboardData({
    data: code,
    success: () => {
      uni.showToast({ title: '复制成功', icon: 'none' })
    }
  })
}

const onTabChange = (index: number) => {
  switchTab(index)
}
</script>

<style lang="scss">
page {
  background-color: #FDFBF7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 32rpx;
  box-sizing: border-box;
}

.hero-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
  margin-top: 20rpx;
  
  .hero-title {
    font-size: 56rpx;
    font-weight: 900;
    color: #4A3B32;
    margin-bottom: 16rpx;
    letter-spacing: 2rpx;
  }
  
  .hero-subtitle {
    font-size: 28rpx;
    color: #8C8C8C;
    margin-bottom: 48rpx;
  }
  
  .input-wrapper {
    width: 100%;
    height: 100rpx;
    border: 6rpx solid #4A3B32;
    border-radius: 16rpx;
    display: flex;
    overflow: hidden;
    margin-bottom: 32rpx;
    background: #fff;
    box-shadow: 6rpx 6rpx 0 #4A3B32;
    
    .code-input {
      flex: 1;
      height: 100%;
      padding: 0 24rpx;
      font-size: 32rpx;
      color: #4A3B32;
    }
    
    .input-placeholder {
      color: #BFBFBF;
    }
    
    .lock-btn {
      width: 100rpx;
      height: 100%;
      background-color: #F4C63F;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 6rpx solid #4A3B32;
    }
  }
  
  .exchange-btn {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    background-color: #F4C63F;
    border: 6rpx solid #4A3B32;
    border-radius: 16rpx;
    color: #4A3B32;
    font-size: 36rpx;
    font-weight: 900;
    box-shadow: 6rpx 6rpx 0 #4A3B32; // Hard shadow to match card
    margin-top: 10rpx;
    
    &:active {
      transform: translate(4rpx, 4rpx);
      box-shadow: 2rpx 2rpx 0 #4A3B32;
    }
    
    &::after {
      border: none;
    }
  }
}

.list-section {
  .list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 36rpx;
      font-weight: 900;
      color: #4A3B32;
    }
    
    .hot-badge {
      background-color: #4A3B32;
      color: #F4C63F;
      font-size: 20rpx;
      font-weight: bold;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
    }
  }
  
  .code-card {
    background: #FFFFFF;
    border: 6rpx solid #4A3B32;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 6rpx 6rpx 0 #4A3B32;
    
    .card-left {
      flex: 1;
      
      .code-row {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;
        
        .code-text {
          font-size: 32rpx;
          font-weight: 900;
          color: #4A3B32;
          margin-right: 16rpx;
        }
        
        .new-tag {
          background-color: #C8E6C9; // Light green
          color: #2E7D32;
          font-size: 20rpx;
          padding: 4rpx 8rpx;
          border-radius: 6rpx;
          font-weight: bold;
        }
      }
      
      .reward-text {
        font-size: 24rpx;
        color: #8C8C8C;
      }
    }
    
    .card-right {
      width: 80rpx;
      height: 80rpx;
      background-color: #FDF4D8;
      border-radius: 12rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 24rpx;
    }
  }
}

.bottom-spacer {
  height: 120rpx;
}
</style>
