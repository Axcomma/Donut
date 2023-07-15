/**
 * base
 */
const canvas = document.querySelector("canvas.webgl")

/**
 * scene
 */

const scene = new THREE.Scene()

/**
 * L overlay
 */

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overLayMaterial = new THREE.ShaderMaterial({
    vertexShader: `
void main(){
    gl_Position = vec4(position, 1.0);
}
`,
    fragmentShader: `
    uniform float uAlpha;
void main(){
    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
}
`,
    uniforms: {
        uAlpha: 1.0
    },
    transparent: true

})

const overlay = new THREE.Mesh(overlayGeometry, overLayMaterial)
scene.add(overlay)


/**
 * GLTF LOADER 
 */
let donut = null
const gltfLoader = new THREE.GLTFLoader();
gltfLoader.load('./asset/scene.gltf',
    (gltf) => {
        donut = gltf.scene
        donut.position.x = 1.5
        donut.rotation.x = Math.PI * 0.2
        donut.rotation.z = Math.PI * 0.15
        const radius = 8.5
        donut.scale.set(radius, radius, radius)
        scene.add(donut)
    })

/**
 * Scroll
 */

const transformDonut = [
    {
        rotationZ: 0.45,
        positionX: 1.5
    }, {
        rotationZ: - 0.45,
        positionX: - 1.5
    }, {
        rotationZ: 0.0314,
        positionX: 0
    }
]
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height);
    console.log(newSection);
    //la position du donut en fonction du scroll
    if (newSection != currentSection) {
        currentSection = newSection;
        if (!!donut) {
            gsap.to(
                donut.rotation, {
                duration: 1.5,
                ease: 'power2.inOut',
                z: transformDonut[currentSection].rotationZ

            }
            )
            gsap.to(
                donut.position, {
                duration: 1.5,
                ease: 'power2.inOut',
                x: transformDonut[currentSection].positionX
            }
            )
        }
    }


})

/**
 * quand on refresh
 */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


/**
 * camera
 */

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 5
scene.add(camera)

/**
 * lumiere
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(1, 2, 0)
scene.add(directionalLight)


/**
 * rendu
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.render(scene, camera)

/**
 * animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    if (!!donut) {
        donut.position.y = Math.sin(elapsedTime * 0.5) * 0.1 - 0.1
    }

    console.log(tick)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)


}

tick()
