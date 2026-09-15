 document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------------------------------------------------
  // THREE.JS 3D SCENE SETUP
  // -----------------------------------------------------------------------
  const canvas = document.getElementById("hero-3d-canvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3D Geometry - Dynamic Torus Knot Mesh
  const geometry = new THREE.TorusKnotGeometry(10, 3, 120, 16);
  
  // Material - Reflective Metallic Wireframe
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    wireframe: true,
    roughness: 0.2,
    metalness: 0.8,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xffffff, 1.5);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x444444, 2);
  pointLight2.position.set(-20, -20, -20);
  scene.add(pointLight2);

  // Mouse Interaction Logic
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // Parallax Tilt for Side Cards
  const leftCard = document.querySelector(".floating-card-wrapper.left");
  const rightCard = document.querySelector(".floating-card-wrapper.right");

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate 3D Mesh
    mesh.rotation.x = elapsedTime * 0.15;
    mesh.rotation.y = elapsedTime * 0.2;

    // Smooth Mouse Chase Effect
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    mesh.rotation.y += 0.5 * (targetX - mesh.rotation.y);
    mesh.rotation.x += 0.5 * (targetY - mesh.rotation.x);

    // Parallax adjustment for cards
    if (leftCard && rightCard) {
      leftCard.style.transform = `translateY(-50%) rotateY(${25 + mouseX * 0.01}deg) rotateX(${8 - mouseY * 0.01}deg)`;
      rightCard.style.transform = `translateY(-50%) rotateY(${-25 + mouseX * 0.01}deg) rotateX(${8 - mouseY * 0.01}deg)`;
    }

    renderer.render(scene, camera);
  }

  animate();

  // Window Resize Handling
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});


// Initialize 3D Particle Scene for About Section
document.addEventListener("DOMContentLoaded", () => {
  const aboutCanvas = document.getElementById("about-3d-canvas");
  if (!aboutCanvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    aboutCanvas.clientWidth / aboutCanvas.clientHeight,
    1,
    1000
  );
  camera.position.set(0, 50, 150);

  const renderer = new THREE.WebGLRenderer({
    canvas: aboutCanvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle Wave Grid
  const numParticles = 1600;
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);

  let i = 0, j = 0;
  for (let ix = 0; ix < 40; ix++) {
    for (let iy = 0; iy < 40; iy++) {
      positions[i] = ix * 12 - 240; // x
      positions[i + 1] = 0;          // y
      positions[i + 2] = iy * 12 - 240; // z
      scales[j] = 1;
      i += 3;
      j++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    transparent: true,
    opacity: 0.35
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let count = 0;

  function animateAbout() {
    requestAnimationFrame(animateAbout);

    const positionAttribute = geometry.attributes.position;
    const array = positionAttribute.array;

    let particleIdx = 0;
    for (let ix = 0; ix < 40; ix++) {
      for (let iy = 0; iy < 40; iy++) {
        // Create 3D wave motion
        array[particleIdx + 1] =
          Math.sin((ix + count) * 0.3) * 15 +
          Math.sin((iy + count) * 0.5) * 15;
        particleIdx += 3;
      }
    }

    positionAttribute.needsUpdate = true;
    count += 0.04;

    renderer.render(scene, camera);
  }

  animateAbout();

  window.addEventListener("resize", () => {
    if (!aboutCanvas) return;
    camera.aspect = aboutCanvas.clientWidth / aboutCanvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const cardBoxes = document.querySelectorAll(".card-canvas-box");

  cardBoxes.forEach((box) => {
    const shapeType = box.getAttribute("data-shape");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(box.clientWidth, box.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    box.appendChild(renderer.domElement);

    // Create unique geometry based on data attribute
    let geometry;
    if (shapeType === "torus") {
      geometry = new THREE.TorusGeometry(1.5, 0.5, 16, 50);
    } else if (shapeType === "cube") {
      geometry = new THREE.BoxGeometry(2, 2, 2);
    } else {
      geometry = new THREE.IcosahedronGeometry(1.8, 1);
    }

    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Speed up rotation on card hover
    let rotationSpeed = 0.008;
    box.closest(".service-card").addEventListener("mouseenter", () => {
      rotationSpeed = 0.03;
      material.opacity = 0.9;
    });

    box.closest(".service-card").addEventListener("mouseleave", () => {
      rotationSpeed = 0.008;
      material.opacity = 0.4;
    });

    function animateCard3D() {
      requestAnimationFrame(animateCard3D);
      mesh.rotation.x += rotationSpeed;
      mesh.rotation.y += rotationSpeed * 1.2;
      renderer.render(scene, camera);
    }

    animateCard3D();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. GSAP SCROLL ENTRANCE ANIMATION
  if (typeof gsap !== "undefined") {
    // Header reveal animation
    gsap.from(".portfolio-header", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power3.out"
    });

    // Cards stagger reveal animation
    gsap.from(".reel-card", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.12, // Har card 0.12s ke gap par aayega
      ease: "power3.out"
    });
  }

  // 2. VIDEO AUTO-PLAY & INTERACTIVE 3D TILT
  const reelCards = document.querySelectorAll(".reel-card");

  reelCards.forEach((card) => {
    const video = card.querySelector("video");

    // Play video on hover
    card.addEventListener("mouseenter", () => {
      if (video) {
        video.play().catch((err) => {
          console.log("Autoplay prevented:", err);
        });
      }
    });

    // Pause & reset video on leave
    card.addEventListener("mouseleave", () => {
      if (video) {
        video.pause();
      }
      // Reset card tilt position
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    // 3D Tilt Calculation based on Mouse Position
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse X position inside card
      const y = e.clientY - rect.top;  // Mouse Y position inside card

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (Max tilt: 8 degrees)
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      // Apply 3D transform
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const docCards = document.querySelectorAll(".doc-card");

  docCards.forEach((card) => {
    const video = card.querySelector("video");

    card.addEventListener("mouseenter", () => {
      if (video) video.play().catch(() => {});
    });

    card.addEventListener("mouseleave", () => {
      if (video) video.pause();
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });

    // 3D Tilt Effect
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });
  });
});
 

document.addEventListener("DOMContentLoaded", function () {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeElements.forEach((el) => observer.observe(el));
});


(function initVeloraCanvas() {
    const canvas = document.getElementById('velora-canvas');
    if(!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Interactive Core (Matrix Cubes)
    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      emissive: 0x002244,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0
    });

    for(let x = -1; x <= 1; x++) {
      for(let y = -1; y <= 1; y++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x * 0.8, y * 0.8, 0);
        group.add(mesh);
      }
    }

    const light = new THREE.PointLight(0xff007f, 4, 10);
    light.position.set(2, 2, 3);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    function animate() {
      requestAnimationFrame(animate);
      group.rotation.x += 0.005;
      group.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  })();

  // const projects = [
  //   {
  //     title: "Incredimate Studio - Website",
  //     category: "Development",
  //     type: "Custom Coded",
  //     link: "https://www.incredimate.com/",
  //     img: "www.incredimate.com_ (4).png" // Teri image
  //   },
  //   {
  //     title: "Portfolio-Editor",
  //     category: "Development",
  //     type: "Custom Coded",
  //     link: "https://vishal-g95k.vercel.app/",
  //     img: "vishal-g95k.vercel.app_ (1).png" // Teri image
  //   },

  //   {
  //     title: "HNM Realtors Website",
  //     category: "Design & Development",
  //     type: "Figma",
  //     link: "https://hnmrealtors.com/",
  //     img: "hnmrealtors.com_ (2).png"
  //   },
  //   {
  //     title: "Youcreatives Podcast Website",
  //     category: "Development",
  //     type: "WordPress",
  //     link: "https://youcreatives.se/",
  //     img: "youcreatives.se_ (1).png"
  //   },
  //   // {
  //   //   title: "Youcreatives Podcast Website",
  //   //   category: "Development",
  //   //   type: "WordPress",
  //   //   link: "https://welsh-justin.vercel.app/",
  //   //   img: "welsh-justin.vercel.app_.png"
  //   // },
  //   {
  //     title: "Robinson Car Wreckers Website",
  //     category: "Figma Design",
  //     type: "Figma",
  //     link: "https://www.figma.com/design/ckjbNOyvDq2aGpbbYJ1y0Z/Robinson---Car-Wreckers-Website?node-id=0-1&p=f&t=hhhlyfbnUAhK4ZOz-0",
  //     img: "www.figma.com_design_ckjbNOyvDq2aGpbbYJ1y0Z_Robinson---Car-Wreckers-Website_node-id=0-1&p=f&t=hhhlyfbnUAhK4ZOz-0.png"
  //   },
  //   {
  //     title: "GK247 Current Affairs Website",
  //     category: "Design & Development",
  //     type: "WordPress",
  //     link: "https://thegk247.com/",
  //     img: "www.thegk247.com_.png"
  //   },
  //   {
  //     title: "Rhythms Aesthetic Society",
  //     category: "Design & Development",
  //     type: "Shopify",
  //     link: "https://rhythms.org.sg/",
  //     img: "rhythms.org.sg_.png"
  //   },
  //   {
  //     title: "Silver Spring",
  //     category: "Development",
  //     type: "Shopify",
  //     link: "https://www.silverspring.in/",
  //     img: "www.silverspring.in_.png"
  //   }
  // ];

  // const grid = document.getElementById('portfolioGrid');

  // function displayProjects(items) {
  //   grid.innerHTML = items.map(p => `
  //     <div class="project-card">
  //       <div class="card-img-holder">
  //          <img class="screen-image" src="${p.img || 'https://via.placeholder.com/600x1200'}" alt="${p.title}">
  //       </div>
  //       <div class="card-body">
  //         <span class="card-category">${p.category}</span>
  //         <h3 class="card-title">${p.title}</h3>
  //         <a href="${p.link || '#'}" target="_blank" class="card-link">View Project <i class="fa-solid fa-arrow-right"></i></a>
  //       </div>
  //     </div>
  //   `).join('');
  // }

  // Filter Functionality
  // const filterBtns = document.querySelectorAll('.tag-btn');
  // filterBtns.forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     filterBtns.forEach(b => b.classList.remove('active'));
  //     btn.classList.add('active');
      
  //     const filter = btn.dataset.filter;
  //     if(filter === 'all') {
  //       displayProjects(projects);
  //     } else {
  //       const filtered = projects.filter(p => p.type === filter || p.category.includes(filter));
  //       displayProjects(filtered.length ? filtered : projects);
  //     }
  //   });
  // });

  // Initial Load
  // displayProjects(projects);

  document.addEventListener("DOMContentLoaded", () => {
  // 1. Create a single master observer
  const observerOptions = {
    root: null,
    threshold: 0.12
  };

  const masterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const parentGrid = card.parentElement;
        if (!parentGrid) return;

        const allCards = Array.from(parentGrid.children);
        const index = allCards.indexOf(card);

        // Check card type & grid layout
        const isReel = card.classList.contains("reel-card");
        const isWebProject = card.classList.contains("project-card");
        const isDoc = card.classList.contains("doc-card");

        const columnsCount = isReel ? 3 : 2;
        const isSlow = isWebProject; // Apply slower animation to web showcase
        const col = index % columnsCount;

        if (columnsCount === 3) {
          if (col === 0) card.classList.add(isSlow ? "animate-left-slow" : "animate-left");
          else if (col === 1) card.classList.add(isSlow ? "animate-top-slow" : "animate-top");
          else if (col === 2) card.classList.add(isSlow ? "animate-right-slow" : "animate-right");
        } else {
          if (col === 0) card.classList.add(isSlow ? "animate-left-slow" : "animate-left");
          else if (col === 1) card.classList.add(isSlow ? "animate-right-slow" : "animate-right");
        }

        obs.unobserve(card);
      }
    });
  }, observerOptions);

  // Helper function to observe cards
  function observeCards() {
    const cards = document.querySelectorAll(".reel-card, .doc-card, .project-card");
    cards.forEach((card) => {
      // Avoid re-observing cards that have already animated
      if (
        !card.classList.contains("animate-left") &&
        !card.classList.contains("animate-right") &&
        !card.classList.contains("animate-top") &&
        !card.classList.contains("animate-left-slow") &&
        !card.classList.contains("animate-right-slow") &&
        !card.classList.contains("animate-top-slow")
      ) {
        masterObserver.observe(card);
      }
    });
  }

  // 2. Initial run for static cards
  observeCards();

  // 3. Watch for dynamically rendered cards in portfolioGrid
  const grid = document.getElementById("portfolioGrid");
  if (grid) {
    const mutationObserver = new MutationObserver(() => {
      observeCards();
    });

    mutationObserver.observe(grid, { childList: true, subtree: true });
  }
});


document.addEventListener("DOMContentLoaded", () => {
  // Service Cards ke liye Observer
  const serviceCards = document.querySelectorAll(".service-card"); // Agar class alag h to yaha change kr skte ho

  const serviceObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const parentGrid = card.parentElement;
        const allCards = Array.from(parentGrid.children);
        const index = allCards.indexOf(card);

        const col = index % 3;

        // 3 Cards Layout Animation
        if (col === 0) card.classList.add("animate-left-cinematic");
        else if (col === 1) card.classList.add("animate-top-cinematic");
        else if (col === 2) card.classList.add("animate-right-cinematic");

        obs.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  serviceCards.forEach((card) => serviceObserver.observe(card));
});