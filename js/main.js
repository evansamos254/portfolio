// Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    if(document.querySelector('.typing-text')) {
        new Typed('.typing-text', {
            String: ['Cybersecurity Specialist', 'Web Developer', 'CS Student'],
            typeSpeed: 70,
            backSpeed: 70,
            backDelay: 1000,
            loop: true
        })
    }
})

// Contact Form Validation
const contactForm = document.querySelector('#contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#email').value;
        if(!email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        alert('Message Sent Succssfully!');
    });
}


const projects = [
    {
        title: "My Portfolio",
        description: "personal responsive portfolio built with HTML, CSS and JavaScript",
        image: "Images/project-1.png",
        live: "https://evansamo.netlify.app",
    },
    {
        title: "Coffee Shop Website",
        description: "Mordern coffee shop website with gallery $ testimonials.",
        image: "Images/project-2.png",
        live: "#",
    }
];



const container = document.getElementById("projectsContainer");

projects.forEach(project => {
  const card = document.createElement("div");
  card.classList.add("project-card");

  card.innerHTML = `
    <img src="${project.image}" alt="${project.title}">
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <div class="project-links">
      <a href="${project.live}" target="_blank">https://evansamo.netlify.app</a>
    </div>
  `;

  container.appendChild(card);
});



const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll(".project-card").forEach(card => {
  observer.observe(card);
});