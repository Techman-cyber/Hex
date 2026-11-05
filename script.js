const year = document.querySelector("#year");
year.textContent = new Date().getFullYear();

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menu?.addEventListener("click", () => nav.classList.toggle("open"));
nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

async function loadLatestRelease() {
  const version = document.querySelector("#release-version");
  const button = document.querySelector("#iso-download");
  const note = document.querySelector("#release-note");
  try {
    const response = await fetch("https://api.github.com/repos/Techman-cyber/Hex/releases/latest", {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) throw new Error("No published release found yet");
    const release = await response.json();
    const iso = (release.assets || []).find(asset => asset.name.toLowerCase().endsWith(".iso"));
    const sums = (release.assets || []).find(asset => asset.name.toLowerCase().includes("sha256"));
    version.textContent = (release.tag_name || "LATEST").toUpperCase();
    if (iso) {
      button.href = iso.browser_download_url;
      button.setAttribute("download", iso.name);
      button.innerHTML = 'Download ISO <span>↓</span>';
      note.textContent = `${iso.name} · ${(iso.size / (1024 ** 3)).toFixed(2)} GB${sums ? " · SHA256 checksum available" : ""}`;
    } else {
      note.textContent = "A release exists, but no ISO asset was found. Check the release assets.";
    }
  } catch (error) {
    version.textContent = "RELEASES";
    note.textContent = "No published latest release detected yet. Open GitHub Releases to find the current ISO.";
    button.href = "https://github.com/Techman-cyber/Hex/releases";
    button.innerHTML = 'View downloads <span>↗</span>';
  }
}
loadLatestRelease();

const sceneHost = document.querySelector("#scene");
if (sceneHost && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  import("three").then(THREE => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    sceneHost.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xa99aff, metalness: 0.72, roughness: 0.22,
      clearcoat: 0.8, clearcoatRoughness: 0.15,
      emissive: 0x24134c, emissiveIntensity: 0.24
    });
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x9f8aff, transparent: true, opacity: 0.6 });
    const shape = new THREE.Shape();
    const pts = [];
    for (let i=0;i<6;i++) {
      const a = Math.PI/3*i - Math.PI/6;
      pts.push(new THREE.Vector2(Math.cos(a)*1.45, Math.sin(a)*1.45));
    }
    shape.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => shape.lineTo(p.x,p.y));
    shape.closePath();
    const hole = new THREE.Path();
    for (let i=0;i<6;i++) {
      const a = Math.PI/3*i - Math.PI/6;
      const x=Math.cos(a)*1.02,y=Math.sin(a)*1.02;
      if(i===0) hole.moveTo(x,y); else hole.lineTo(x,y);
    }
    hole.closePath(); shape.holes.push(hole);
    const geometry = new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.07,bevelThickness:.07});
    const hex = new THREE.Mesh(geometry, material);
    hex.position.z=-.16;
    group.add(hex);

    // A minimal split H mark, custom geometry rather than a copied platform logo.
    const barMat = new THREE.MeshPhysicalMaterial({color:0xe7e1ff,metalness:.62,roughness:.24,clearcoat:.7});
    function block(w,h,d,x,y,z,mat=barMat) {
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
      mesh.position.set(x,y,z); group.add(mesh);
      return mesh;
    }
    // Terminal chevron and underscore inside the hex frame.
    const chevron = new THREE.Shape();
    chevron.moveTo(-.38,.32); chevron.lineTo(-.08,.05); chevron.lineTo(-.38,-.22);
    const chevronGeo = new THREE.ExtrudeGeometry(chevron,{depth:.10,bevelEnabled:true,bevelThickness:.025,bevelSize:.02,bevelSegments:2});
    const chevronMesh = new THREE.Mesh(chevronGeo,barMat); chevronMesh.position.z=.24; group.add(chevronMesh);
    block(.38,.09,.13,.28,-.19,.29);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.0,.008,8,160),new THREE.MeshBasicMaterial({color:0x73dce8,transparent:true,opacity:.38}));
    ring.rotation.set(.95,.15,.3); group.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.18,.006,8,160),new THREE.MeshBasicMaterial({color:0xa38bff,transparent:true,opacity:.22}));
    ring2.rotation.set(1.35,.35,-.2); group.add(ring2);

    const stars = new THREE.BufferGeometry();
    const positions=[];
    for(let i=0;i<500;i++){positions.push((Math.random()-.5)*11,(Math.random()-.5)*8,(Math.random()-.5)*5-2);}
    stars.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
    const points = new THREE.Points(stars,new THREE.PointsMaterial({color:0xaaa0d8,size:.012,transparent:true,opacity:.55}));
    scene.add(points);
    scene.add(new THREE.AmbientLight(0xaaaaff,1.4));
    const key=new THREE.PointLight(0x9b7cff,40,15);key.position.set(3,3,4);scene.add(key);
    const fill=new THREE.PointLight(0x5bdce8,25,12);fill.position.set(-3,-2,2);scene.add(fill);

    const resize=()=>{const w=sceneHost.clientWidth,h=sceneHost.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
    resize(); new ResizeObserver(resize).observe(sceneHost);
    let mx=0,my=0,tx=0,ty=0;
    sceneHost.addEventListener("pointermove",e=>{const r=sceneHost.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*.55;ty=((e.clientY-r.top)/r.height-.5)*.4;});
    const clock=new THREE.Clock();
    function animate(){requestAnimationFrame(animate);const t=clock.getElapsedTime();mx+=(tx-mx)*.035;my+=(ty-my)*.035;group.rotation.y=Math.sin(t*.23)*.22+mx;group.rotation.x=Math.cos(t*.19)*.12+my;group.rotation.z=Math.sin(t*.15)*.035;ring.rotation.z+=.0012;ring2.rotation.z-=.0007;points.rotation.y=t*.012;renderer.render(scene,camera);}
    animate();
  }).catch(() => { sceneHost.classList.add("scene-fallback"); });
}
