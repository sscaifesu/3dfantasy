/// <reference types=".vue-global-types/vue_3.5_false.d.ts" />
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
let scene;
let camera;
let renderer;
let controls;
let cube;
onMounted(() => {
    initScene();
    animate();
});
onUnmounted(() => {
    window.removeEventListener('resize', onWindowResize);
});
function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    const container = document.getElementById('scene-container');
    if (container) {
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
    }
    camera.position.z = 5;
    controls = new OrbitControls(camera, renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);
    // 添加一个立方体
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    window.addEventListener('resize', onWindowResize, false);
}
function animate() {
    requestAnimationFrame(animate);
    // 旋转立方体
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
}
function onWindowResize() {
    const container = document.getElementById('scene-container');
    if (container) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
}
function loadModel(event) {
    const file = event.target.files?.[0];
    if (file) {
        console.log('开始加载文件:', file.name);
        const loader = new GLTFLoader();
        const url = URL.createObjectURL(file);
        loader.load(url, (gltf) => {
            console.log('GLB文件加载成功');
            scene.remove(cube); // 移除立方体
            scene.add(gltf.scene);
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            console.log('模型尺寸:', size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            camera.position.z = cameraZ * 1.5;
            camera.lookAt(center);
            camera.updateProjectionMatrix();
            controls.target.copy(center);
            controls.update();
            console.log('相机位置已调整');
        }, (progress) => {
            console.log('加载进度:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
        }, (error) => {
            console.error('加载GLB文件时出错:', error);
            if (error instanceof Error) {
                console.error('错误信息:', error.message);
            }
        });
    }
}
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.input, __VLS_intrinsicElements.input)({ ...{ onChange: (__VLS_ctx.loadModel) }, type: ("file"), accept: (".glb"), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ id: ("scene-container"), });
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    return {
        slots: __VLS_slots,
        refs: $refs,
        attrs: {},
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loadModel: loadModel,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
;
//# sourceMappingURL=App.vue.js.map