import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/4.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/tiro_gurmukhi_regular.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'StoryBrand',
            {
                font,
                size: 0.5,
                height: 0.1,
                curveSegments: 5,
                bevelEnabled: true,
                bevelSize: 0.01,
                bevelThickness: 0.05
            }
        )

        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture})
        // material.wireframe = true
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 20, 45)
        for (let index = 0; index < 150; index++) {
            const torus = new THREE.Mesh(torusGeometry, material)
            torus.position.set(
                (Math.random() - 0.5) * 10, 
                (Math.random() - 0.5) * 10, 
                (Math.random() - 0.5) * 10
            )
            torus.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
            const scale = Math.min(Math.random() + 0.25, 0.5)
            torus.scale.set(scale, scale, scale)
            scene.add(torus)
        }

        // gui.add(text.position, 'x', -2, 2, 0.01)
        // gui.add(text.position, 'y', -2, 2, 0.01)
        // gui.add(text.position, 'z', -2, 2, 0.01)
    }
)

// Axes Helper
const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()