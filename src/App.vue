<template>
  <div>
    <h1>3D Fantasy</h1>
    <input type="file" @change="loadModel" accept=".glb">
    <div id="scene-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let cube: THREE.Mesh

onMounted(() => {
  initScene()
  animate()
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
})

function initScene() {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer()
  
  const container = document.getElementById('scene-container')
  if (container) {
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
  }
  
  camera.position.z = 5
  
  controls = new OrbitControls(camera, renderer.domElement)
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
  directionalLight.position.set(0, 1, 0)
  scene.add(directionalLight)

  // 添加一个立方体
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  window.addEventListener('resize', onWindowResize, false)
}

function animate() {
  requestAnimationFrame(animate)
  
  // 旋转立方体
  if (cube) {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
  }
  
  controls.update()
  renderer.render(scene, camera)
}

function onWindowResize() {
  const container = document.getElementById('scene-container')
  if (container) {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  }
}

function loadModel(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    console.log('开始加载文件:', file.name)
    const loader = new GLTFLoader()
    const url = URL.createObjectURL(file)
    loader.load(
      url,
      (gltf) => {
        console.log('GLB文件加载成功')
        scene.remove(cube) // 移除立方体
        scene.add(gltf.scene)
        
        const box = new THREE.Box3().setFromObject(gltf.scene)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        console.log('模型尺寸:', size)
        
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = camera.fov * (Math.PI / 180)
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
        
        camera.position.z = cameraZ * 1.5
        camera.lookAt(center)
        camera.updateProjectionMatrix()
        
        controls.target.copy(center)
        controls.update()
        
        console.log('相机位置已调整')
      },
      (progress) => {
        console.log('加载进度:', (progress.loaded / progress.total * 100).toFixed(2) + '%')
      },
      (error: unknown) => {
        console.error('加载GLB文件时出错:', error)
        if (error instanceof Error) {
          console.error('错误信息:', error.message)
        }
      }
    )
  }
}
</script>

<style scoped>
#scene-container {
  width: 100%;
  height: 600px;
}
</style>
