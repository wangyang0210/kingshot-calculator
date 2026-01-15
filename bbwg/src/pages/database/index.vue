<template>
  <view class="page-container">
    <TheHeader title="资料库" :show-capsule="true" left-text="返回" />
    <scroll-view scroll-y class="main-content">
      <!-- Category Tabs -->
      <scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
        <view class="tabs-container">
          <view 
            v-for="(tab, index) in tabs" 
            :key="index"
            class="tab-item"
            :class="{ active: currentCategory === index }"
            @click="currentCategory = index"
          >
            <wd-icon :name="tab.icon" size="16px" class="tab-icon"></wd-icon>
            <text>{{ tab.name }}</text>
          </view>
        </view>
      </scroll-view>

      <!-- Search Bar -->
      <view class="search-container">
        <wd-icon name="search" size="18px" color="#F4C63F"></wd-icon>
        <input 
          class="search-input" 
          placeholder="搜索奔奔英雄..." 
          placeholder-style="color: #8C8C8C"
        />
      </view>

      <!-- Filters (Only for Hero Tab) -->
      <scroll-view 
        v-if="currentCategory === 0" 
        scroll-x 
        class="filter-scroll" 
        :show-scrollbar="false"
      >
        <view class="filter-container">
          <view 
            v-for="(filter, index) in filters" 
            :key="index"
            class="filter-chip"
            :class="{ active: currentFilter === filter.value }"
            @click="currentFilter = filter.value"
          >
            {{ filter.label }}
          </view>
        </view>
      </scroll-view>

      <!-- Grid List -->
      <view class="grid-container">
        <view v-for="(item, index) in filteredList" :key="index" class="hero-card">
          <view class="card-image-box" :class="getBgClass(item.rarity)">
            <image :src="item.image" mode="aspectFit" class="hero-image" />
            <view class="rarity-tag" :class="item.rarity.toLowerCase()">{{ item.rarity }}</view>
          </view>
          
          <view class="card-info">
            <view class="hero-name">{{ item.name }}</view>
            <view class="hero-stats">
              <view class="stat-row">
                <wd-icon name="fill-camera" size="12px" color="#F4C63F" custom-style="margin-right: 4rpx;"></wd-icon>
                <text>ATK: {{ item.atk }}</text>
              </view>
              <view class="stat-row">
                <wd-icon name="heart" size="12px" color="#52C41A" custom-style="margin-right: 4rpx;"></wd-icon>
                <text>HP: {{ item.hp }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      
      <view class="bottom-spacer"></view>
    </scroll-view>

    <TheTabBar v-model="currentTab" @change="onTabChange" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import TheTabBar from '@/components/TheTabBar.vue'
import { switchTab } from '@/utils/tabbar'

const currentTab = ref(1) // 1 corresponds to Database tab
const currentCategory = ref(0)
const currentFilter = ref('all')

const tabs = [
  { name: '英雄', icon: 'user' },
  { name: '活动', icon: 'calendar' },
  { name: '道具', icon: 'bag' },
  { name: '建筑', icon: 'home' },
  { name: '科技', icon: 'setting' },
  { name: '宠物', icon: 'thumb-up' },
  { name: '装备', icon: 'goods' },
  { name: '联盟', icon: 'user-circle' }
]

const filters = [
  { label: '全部', value: 'all' },
  { label: '稀有', value: 'R' },
  { label: '史诗', value: 'SR' },
  { label: '传说', value: 'SSR' },
  { label: '一代', value: 'gen1' },
  { label: '二代', value: 'gen2' },
  { label: '三代', value: 'gen3' }
]

const heroList = ref([
  {
    name: '奔奔骑士',
    rarity: 'SSR',
    generation: 'gen1',
    atk: 120,
    hp: 450,
    image: '/static/hero-knight.png' // Placeholder
  },
  {
    name: '绿野射手',
    rarity: 'SR',
    generation: 'gen1',
    atk: 150,
    hp: 320,
    image: '/static/hero-archer.png' // Placeholder
  },
  {
    name: '法师梅林',
    rarity: 'SSR',
    generation: 'gen2',
    atk: 200,
    hp: 280,
    image: '/static/hero-mage.png' // Placeholder
  },
  {
    name: '重锤大熊',
    rarity: 'R',
    generation: 'gen1',
    atk: 90,
    hp: 600,
    image: '/static/hero-bear.png' // Placeholder
  }
])

const filteredList = computed(() => {
  if (currentCategory.value !== 0) return [] // 暂时只实现了英雄列表
  
  if (currentFilter.value === 'all') return heroList.value
  
  return heroList.value.filter(item => {
    // 筛选稀有度 (R, SR, SSR)
    if (['R', 'SR', 'SSR'].includes(currentFilter.value)) {
      return item.rarity === currentFilter.value
    }
    // 筛选代数 (gen1, gen2, gen3)
    if (currentFilter.value.startsWith('gen')) {
      return item.generation === currentFilter.value
    }
    return true
  })
})

const getBgClass = (rarity: string) => {
  // Can be used to set dynamic backgrounds based on rarity if needed
  return ''
}

const onTabChange = (index: number) => {
  switchTab(index)
}
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FDFBF7;
}

.main-content {
  flex: 1;
  padding: 24rpx;
  box-sizing: border-box;
}

/* Tabs */
.tabs-scroll {
  white-space: nowrap;
  margin-bottom: 32rpx;
  width: 100%;
}

.tabs-container {
  display: flex;
  padding: 0 8rpx;
  
  .tab-item {
    flex-shrink: 0;
    padding: 0 32rpx;
    margin: 0 8rpx;
    height: 72rpx;
    background: #F2EFE9;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #4A3B32;
    font-weight: bold;
    
    .tab-icon {
      margin-right: 8rpx;
    }
    
    &.active {
      background: #F4C63F;
      color: #4A3B32;
    }
  }
}

/* Search */
.search-container {
  background: #F2EFE9;
  border-radius: 16rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  margin-bottom: 40rpx;
  
  .search-input {
    flex: 1;
    margin-left: 16rpx;
    font-size: 28rpx;
    color: #4A3B32;
  }
}

/* Filters */
.filter-scroll {
  white-space: nowrap;
  margin-bottom: 24rpx;
  width: 100%;
}

.filter-container {
  display: flex;
  padding: 0 8rpx;
  
  .filter-chip {
    padding: 12rpx 32rpx;
    margin: 0 8rpx;
    background: #F2EFE9;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: #8C8C8C;
    font-weight: bold;
    border: 2rpx solid transparent;
    
    &.active {
      background: #4A3B32;
      color: #F4C63F;
      border-color: #4A3B32;
    }
  }
}

/* Grid */
.grid-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.hero-card {
  width: 48%;
  background: #F2EFE9;
  border-radius: 20rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  
  .card-image-box {
    width: 100%;
    height: 240rpx;
    background: #333; // Placeholder background
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .hero-image {
      width: 100%;
      height: 100%;
    }
    
    .rarity-tag {
      position: absolute;
      top: 12rpx;
      right: 12rpx;
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      font-size: 20rpx;
      font-weight: bold;
      color: #fff;
      
      &.ssr { background: #F4C63F; color: #4A3B32; }
      &.sr { background: #52C41A; }
      &.r { background: #A0A0A0; }
    }
  }
  
  .card-info {
    padding: 16rpx 20rpx 0;
    
    .hero-name {
      font-size: 30rpx;
      font-weight: 900;
      color: #4A3B32;
      margin-bottom: 12rpx;
    }
    
    .hero-stats {
      .stat-row {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #8C8C8C;
        margin-bottom: 4rpx;
      }
    }
  }
}

.bottom-spacer {
  height: 120rpx;
}
</style>
