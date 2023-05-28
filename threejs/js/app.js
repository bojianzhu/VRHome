var hotPoints=[
    {
        position:{
            x:0,
            y:0,
            z:-0.2
        },
        detail:{
            "title":"信息点1"
        }
    },
    {
        position:{
            x:-0.2,
            y:-0.05,
            z:0.2
        },
        detail:{
            "title":"信息点2"
        }
    }
];

var scene, camera, renderer;


function initThree(){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(90, document.body.clientWidth / document.body.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 0.01);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);

    document.getElementById("container").appendChild(renderer.domElement);

    // 控制移动轨道
    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    useBox();
    // useSphere();
    initPoints();

    loop();
}

function useBox(){
    // 创建六方体
    var materials = [];
    // 使用六个方位的图片贴图
    var texture_left = new THREE.TextureLoader().load( './images/scene_left.jpeg' );
    materials.push( new THREE.MeshBasicMaterial( { map: texture_left} ) );
    
    var texture_right = new THREE.TextureLoader().load( './images/scene_right.jpeg' );
    materials.push( new THREE.MeshBasicMaterial( { map: texture_right} ) );

    var texture_top = new THREE.TextureLoader().load( './images/scene_top.jpeg' );
    materials.push( new THREE.MeshBasicMaterial( { map: texture_top} ) );

    var texture_bottom = new THREE.TextureLoader().load( './images/scene_bottom.jpeg' );
    materials.push( new THREE.MeshBasicMaterial( { map: texture_bottom} ) );

    var texture_front = new THREE.TextureLoader().load( './images/scene_front.jpeg' );
    materials.push( new THREE.MeshBasicMaterial( { map: texture_front} ) );

    var texture_back = new THREE.TextureLoader().load( './images/scene_back.jpeg' );
    materials.push( new THREE.MeshBasicMaterial( { map: texture_back} ) );

    var box = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), materials );
    // 贴图反转
    box.geometry.scale( 1, 1, -1 );
    scene.add(box);
}

function useSphere(){
    var sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
    sphereGeometry.scale(1, 1, -1);
    // sphereGeometry.rotateY(180*Math.PI/180);
    // 使用全景图片贴图
    var texture = new THREE.TextureLoader().load('./images/scene.jpeg');
    var sphereMaterial = new THREE.MeshBasicMaterial({map: texture});

    // var sphereGeometry = new THREE.SphereGeometry(50, 20, 20);

    var sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
    // sphere.material.wireframe  = true;
    scene.add(sphere);
}

function loop() {
    requestAnimationFrame(loop);
    
    renderer.render(scene, camera);
}

window.onload = initThree;

function initPoints(){
    var pointTexture = new THREE.TextureLoader().load('images/hot.png');
    var material = new THREE.SpriteMaterial( { map: pointTexture} );

    var poiObjects = []; // 可点击物品
    for(var i=0;i<hotPoints.length;i++){
        // 永远朝向camera的面片
        var sprite = new THREE.Sprite( material );
        sprite.scale.set( 0.1, 0.1, 0.1 );
        sprite.position.set( hotPoints[i].position.x, hotPoints[i].position.y, hotPoints[i].position.z );
       
       scene.add( sprite );

       sprite.detail = hotPoints[i].detail;
       poiObjects.push(sprite);
    }
    // 画布接受click事件
    document.querySelector("#container").addEventListener("click",function(event){
        event.preventDefault();

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        mouse.x = ( event.clientX / document.body.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / document.body.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( poiObjects );
        if(intersects.length>0){
            alert("点击了热点"+intersects[0].object.detail.title);
        }
    });
}