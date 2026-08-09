<template>
  <button
    ref="buttonRef"
    class="ai-float-button"
    :class="{ 'is-dragging': dragging, 'is-ready': ready }"
    :style="buttonStyle"
    type="button"
    aria-label="打开 AI 客服"
    title="AI 客服"
    @pointerdown="handlePointerDown"
    @click="handleClick"
  >
    <span class="ai-character-shell" aria-hidden="true">
      <img src="/assets/images/profile/ai-support-chibi.png" alt="" draggable="false" @dragstart.prevent />
    </span>
  </button>
  <AIChatDrawer v-model:visible="chatVisible" />
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
  import AIChatDrawer from './AIChatDrawer.vue'

  const POSITION_STORAGE_KEY = 'ai-customer-service-entry-position'
  const EDGE_GAP = 12
  const DEFAULT_RIGHT = 24
  const DEFAULT_BOTTOM = 24
  const DRAG_THRESHOLD = 5

  const chatVisible = ref(false)
  const buttonRef = ref<HTMLButtonElement | null>(null)
  const position = ref({ x: 0, y: 0 })
  const ready = ref(false)
  const dragging = ref(false)

  let activePointerId: number | null = null
  let pointerStart = { x: 0, y: 0 }
  let positionStart = { x: 0, y: 0 }
  let pointerMoved = false
  let suppressNextClick = false
  let clickResetTimer: number | undefined

  const buttonStyle = computed<CSSProperties>(() => {
    if (!ready.value) return {}

    return {
      left: `${position.value.x}px`,
      top: `${position.value.y}px`,
      right: 'auto',
      bottom: 'auto'
    }
  })

  const getButtonSize = () => {
    const rect = buttonRef.value?.getBoundingClientRect()
    return {
      width: rect?.width || 118,
      height: rect?.height || 128
    }
  }

  const clampPosition = (nextPosition: { x: number; y: number }) => {
    const { width, height } = getButtonSize()
    const maxX = Math.max(EDGE_GAP, window.innerWidth - width - EDGE_GAP)
    const maxY = Math.max(EDGE_GAP, window.innerHeight - height - EDGE_GAP)

    return {
      x: Math.min(Math.max(nextPosition.x, EDGE_GAP), maxX),
      y: Math.min(Math.max(nextPosition.y, EDGE_GAP), maxY)
    }
  }

  const savePosition = () => {
    try {
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position.value))
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }

  const loadPosition = () => {
    try {
      const storedPosition = JSON.parse(localStorage.getItem(POSITION_STORAGE_KEY) || 'null')
      if (Number.isFinite(storedPosition?.x) && Number.isFinite(storedPosition?.y)) {
        return clampPosition(storedPosition)
      }
    } catch {
      // Ignore malformed or unavailable storage and use the default position.
    }

    const { width, height } = getButtonSize()
    return clampPosition({
      x: window.innerWidth - width - DEFAULT_RIGHT,
      y: window.innerHeight - height - DEFAULT_BOTTOM
    })
  }

  const removePointerListeners = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    window.removeEventListener('pointercancel', handlePointerUp)
  }

  const handlePointerDown = (event: PointerEvent) => {
    if (!ready.value || event.button !== 0 || activePointerId !== null) return

    activePointerId = event.pointerId
    pointerStart = { x: event.clientX, y: event.clientY }
    positionStart = { ...position.value }
    pointerMoved = false

    buttonRef.value?.setPointerCapture(event.pointerId)
    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return

    const deltaX = event.clientX - pointerStart.x
    const deltaY = event.clientY - pointerStart.y

    if (!pointerMoved && Math.hypot(deltaX, deltaY) < DRAG_THRESHOLD) return

    pointerMoved = true
    dragging.value = true
    event.preventDefault()
    position.value = clampPosition({
      x: positionStart.x + deltaX,
      y: positionStart.y + deltaY
    })
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (event.pointerId !== activePointerId) return

    if (buttonRef.value?.hasPointerCapture(event.pointerId)) {
      buttonRef.value.releasePointerCapture(event.pointerId)
    }

    if (pointerMoved) {
      suppressNextClick = true
      savePosition()
      window.clearTimeout(clickResetTimer)
      clickResetTimer = window.setTimeout(() => {
        suppressNextClick = false
      }, 150)
    }

    dragging.value = false
    activePointerId = null
    removePointerListeners()
  }

  const handleClick = () => {
    if (suppressNextClick) return
    chatVisible.value = true
  }

  const handleResize = () => {
    if (!ready.value) return
    position.value = clampPosition(position.value)
    savePosition()
  }

  onMounted(async () => {
    await nextTick()
    position.value = loadPosition()
    ready.value = true
    window.addEventListener('resize', handleResize)
  })

  onBeforeUnmount(() => {
    removePointerListeners()
    window.removeEventListener('resize', handleResize)
    window.clearTimeout(clickResetTimer)
  })
</script>

<style scoped lang="scss">
  .ai-float-button {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 999;
    width: 118px;
    height: 128px;
    padding: 0;
    overflow: visible;
    touch-action: none;
    cursor: grab;
    user-select: none;
    background: transparent;
    border: 0;
    opacity: 0;
    filter: drop-shadow(0 10px 12px rgb(15 23 42 / 24%));
    transition:
      filter 0.2s ease,
      opacity 0.15s ease;
    -webkit-tap-highlight-color: transparent;

    &.is-ready {
      opacity: 1;
    }

    &:hover,
    &:focus-visible {
      filter: drop-shadow(0 13px 16px rgb(15 23 42 / 32%)) brightness(1.04);
    }

    &:focus-visible {
      outline: 2px solid #409eff;
      outline-offset: 4px;
      border-radius: 18px;
    }

    &.is-dragging {
      cursor: grabbing;
      filter: drop-shadow(0 7px 10px rgb(15 23 42 / 20%));

      .ai-character-shell {
        transform: scale(0.97);
        animation-play-state: paused;
      }
    }
  }

  .ai-character-shell {
    display: block;
    width: 100%;
    height: 100%;
    transform-origin: 50% 88%;
    animation: ai-character-idle 3.2s ease-in-out infinite;
    will-change: transform;

    img {
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
      user-select: none;
      object-fit: contain;
    }
  }

  @keyframes ai-character-idle {
    0%,
    100% {
      transform: translate3d(0, 0, 0) rotate(-0.5deg) scale(1);
    }

    45% {
      transform: translate3d(0, -7px, 0) rotate(0.7deg) scale(1.012, 1.02);
    }

    72% {
      transform: translate3d(0, -3px, 0) rotate(0deg) scale(1.005, 1.01);
    }
  }

  @media (width <= 768px) {
    .ai-float-button {
      width: 98px;
      height: 108px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ai-character-shell {
      animation: none;
    }
  }
</style>
