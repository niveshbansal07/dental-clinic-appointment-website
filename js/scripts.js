// Global state
let demoMode = false;

// DOM ready
window.addEventListener('DOMContentLoaded', () => {
  setYear();
  initNav();
  initDemoToggle();
  initScrollReveal();
  initCounters();
  initCarousel();
  initServiceToggles();
  initDoctorModal();
  initForms();
  initAppointmentForm();
});

// Helpers
function $(selector, scope = document) {
  return scope.querySelector(selector);
}
function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function setYear() {
  const y = new Date().getFullYear();
  $all('#year').forEach((el) => (el.textContent = y));
}

// Navigation
function initNav() {
  const nav = $('.main-nav');
  const toggle = $('.nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click (mobile)
  $all('.main-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Demo mode toggle
function initDemoToggle() {
  const toggles = $all('#demoModeToggle');
  if (!toggles.length) return;
  toggles.forEach((input) => {
    input.checked = demoMode;
    input.addEventListener('change', (e) => {
      demoMode = e.target.checked;
      document.body.classList.toggle('demo-mode', demoMode);
    });
  });
}

// Scroll reveal
function initScrollReveal() {
  const elements = $all('.reveal-on-scroll');
  if (!elements.length || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  elements.forEach((el) => observer.observe(el));
}

// Counters
function initCounters() {
  const counters = $all('[data-counter]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || '0', 10);
    const duration = 1400;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

// Testimonials carousel
function initCarousel() {
  const carousel = $('#testimonialsCarousel');
  if (!carousel) return;

  const items = $all('.testimonial-item', carousel);
  const dots = $all('.carousel-dot', carousel);
  const prevBtn = $('.prev', carousel);
  const nextBtn = $('.next', carousel);
  let index = 0;
  let timer;

  const setActive = (i) => {
    items.forEach((item, idx) => item.classList.toggle('is-active', idx === i));
    dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === i));
    index = i;
  };

  const next = () => setActive((index + 1) % items.length);
  const prev = () => setActive((index - 1 + items.length) % items.length);

  const startAuto = () => {
    stopAuto();
    timer = setInterval(next, 7000);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
  };

  nextBtn.addEventListener('click', () => {
    stopAuto();
    next();
    startAuto();
  });

  prevBtn.addEventListener('click', () => {
    stopAuto();
    prev();
    startAuto();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      setActive(i);
      startAuto();
    });
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  setActive(0);
  startAuto();
}

// Service read-more toggles
function initServiceToggles() {
  $all('.service-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.service-detail-card');
      if (!card) return;
      const more = $('.service-more', card);
      if (!more) return;
      const isHidden = more.hasAttribute('hidden');
      if (isHidden) {
        more.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = 'Show less';
      } else {
        more.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
        btn.textContent = 'Read more';
      }
    });
  });
}

// Doctor modal
function initDoctorModal() {
  const modal = $('#doctorOverlay');
  if (!modal) return;
  const nameEl = $('#doctorName', modal);
  const roleEl = $('#doctorRole', modal);
  const bioEl = $('#doctorBio', modal);
  const imgEl = $('#doctorImage', modal);
  const listEl = $('#doctorHighlights', modal);
  const scheduleEl = $('#doctorSchedule', modal);
  const linkedInEl = $('#doctorLinkedIn', modal);

  const doctorData = {
    1: {
      name: 'Dr. Aditi Mehra',
      role: 'Chief Cosmetic Dentist, BDS, MDS (Prosthodontics)',
      image: 'https://images.unsplash.com/photo-1535916707207-35f97e715e1b?auto=format&fit=crop&w=600&q=80',
      highlights: [
        'Fellowship in advanced cosmetic dentistry',
        'Over 2,000 smile makeovers completed',
        'Special interest in minimally invasive restorations'
      ],
      schedule: 'Available Mon–Sat: 10:00 AM – 2:00 PM, 4:00 PM – 7:00 PM.',
      linkedIn: 'https://www.linkedin.com/'
    },
    2: {
      name: 'Dr. Rahul Sharma',
      role: 'Implantologist & Oral Surgeon, BDS, MDS',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
      highlights: [
        'Advanced training in full-arch implant rehabilitation',
        'Performs 200+ implant surgeries each year',
        'Trained in digital and guided implant surgery'
      ],
      schedule: 'Available Mon, Wed, Fri: 11:00 AM – 7:00 PM; Sat: 10:00 AM – 2:00 PM.',
      linkedIn: 'https://www.linkedin.com/'
    },
    3: {
      name: 'Dr. Neha Rao',
      role: 'Orthodontist, MDS',
      image: 'https://images.unsplash.com/photo-1535916707207-35f97e715e1b?auto=format&fit=crop&w=600&q=80',
      highlights: [
        'Certified provider for multiple clear aligner systems',
        'Experienced in complex bite correction cases',
        'Focuses on aesthetic, low-visibility orthodontics'
      ],
      schedule: 'Available Tue–Sat: 11:30 AM – 8:00 PM.',
      linkedIn: 'https://www.linkedin.com/'
    },
    4: {
      name: 'Dr. Kavya Nair',
      role: 'Pediatric Dentist, MDS',
      image: 'https://images.unsplash.com/photo-1620912189865-1e8cd0e3f8c1?auto=format&fit=crop&w=600&q=80',
      highlights: [
        'Child-friendly treatments with behaviour guidance',
        'Special interest in preventive and minimally invasive dentistry for kids',
        'Conducts school dental health camps in [City]'
      ],
      schedule: 'Available Mon–Sat: 9:30 AM – 1:30 PM, 3:30 PM – 6:30 PM.',
      linkedIn: 'https://www.linkedin.com/'
    }
  };

  const openModal = (id) => {
    const data = doctorData[id];
    if (!data) return;
    nameEl.textContent = data.name;
    roleEl.textContent = data.role;
    imgEl.src = data.image;
    imgEl.alt = `Portrait of ${data.name}`;
    bioEl.textContent = '';
    bioEl.textContent = `${data.name} is a trusted dentist in [City] known for patient-focused care and excellent clinical outcomes.`;
    listEl.innerHTML = '';
    data.highlights.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      listEl.appendChild(li);
    });
    scheduleEl.textContent = data.schedule;
    linkedInEl.href = data.linkedIn;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  };

  $all('.team-profile-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.team-card');
      const id = card?.getAttribute('data-doctor-id');
      if (id) openModal(id);
    });
  });

  const closeBtn = $('.overlay-close', modal);
  const backdrop = $('.overlay-backdrop', modal);

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target.dataset.overlayClose !== undefined) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// Generic forms (footer, quick widget)
function initForms() {
  // Quick appointment form
  const quickForm = $('#quickAppointmentForm');
  if (quickForm) {
    quickForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit(quickForm, {
        apiUrl: '/api/appointments',
        summaryFields: ['name', 'phone', 'service', 'preferredDate', 'preferredTime']
      });
    });
  }

  // Footer forms
  $all('.footer-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleFormSubmit(form, {
        apiUrl: '/api/contact',
        summaryFields: ['name', 'email']
      });
    });
  });

  // Close success overlay
  const overlay = $('#successOverlay');
  if (overlay) {
    const closeBtn = $('.overlay-close', overlay);
    const backdrop = $('.overlay-backdrop', overlay);
    closeBtn?.addEventListener('click', () => toggleOverlay(false));
    backdrop?.addEventListener('click', () => toggleOverlay(false));
  }
}

// Appointment form
function initAppointmentForm() {
  const form = $('#appointmentForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const valid = validateAppointmentForm(form);
    if (!valid) return;

    await handleFormSubmit(form, {
      apiUrl: '/api/appointments',
      summaryFields: ['name', 'email', 'phone', 'service', 'preferredDate', 'preferredTime', 'message']
    });
  });

  // Add-to-calendar button
  const calendarBtn = $('#addToCalendarBtn');
  if (calendarBtn) {
    calendarBtn.addEventListener('click', () => handleCalendarAdd(form));
  }
}

function validateAppointmentForm(form) {
  let isValid = true;

  const setError = (id, msg) => {
    const field = form.querySelector(`#${id}`);
    const err = form.querySelector(`[data-error-for="${id}"]`);
    if (!field || !err) return;
    if (msg) {
      field.classList.add('error');
      err.textContent = msg;
      isValid = false;
    } else {
      field.classList.remove('error');
      err.textContent = '';
    }
  };

  const name = form.fullName.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const service = form.service.value;
  const date = form.preferredDate.value;
  const time = form.preferredTime.value;
  const message = form.message.value.trim();
  const terms = form.acceptTerms.checked;
  const honeypot = form.website?.value.trim();

  if (!name) setError('fullName', 'Please enter your full name.');
  else setError('fullName', '');

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'Please enter a valid email address.');
  } else {
    setError('email', '');
  }

  if (!phone || !/^[0-9+\s-]{8,15}$/.test(phone)) {
    setError('phone', 'Please enter a valid phone number.');
  } else {
    setError('phone', '');
  }

  if (!service) setError('service', 'Please select a service.');
  else setError('service', '');

  if (!date) setError('preferredDate', 'Please select a preferred date.');
  else setError('preferredDate', '');

  if (!time) setError('preferredTime', 'Please select a preferred time.');
  else setError('preferredTime', '');

  if (!message) setError('message', 'Please describe your concern.');
  else setError('message', '');

  if (!terms) setError('acceptTerms', 'Please accept the privacy policy to continue.');
  else setError('acceptTerms', '');

  if (honeypot) {
    // Likely spam; fail quietly
    isValid = false;
  }

  return isValid;
}

// Generic form submission handler
async function handleFormSubmit(form, options) {
  const { apiUrl, summaryFields } = options;
  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.classList.add('loading');

  const data = Object.fromEntries(new FormData(form).entries());
  const overlaySummary = $('#bookingSummary');
  if (overlaySummary) {
    overlaySummary.innerHTML = '';
  }

  const simulateSuccess = () => {
    if (overlaySummary && summaryFields && summaryFields.length) {
      const list = document.createElement('ul');
      list.style.margin = '0';
      list.style.paddingLeft = '1.2rem';

      summaryFields.forEach((key) => {
        if (data[key]) {
          const li = document.createElement('li');
          const label = key
            .replace('preferredDate', 'Preferred date')
            .replace('preferredTime', 'Preferred time')
            .replace('service', 'Service')
            .replace('phone', 'Phone')
            .replace('name', 'Name')
            .replace('email', 'Email')
            .replace('message', 'Message');
          li.textContent = `${label}: ${data[key]}`;
          list.appendChild(li);
        }
      });

      overlaySummary.appendChild(list);
    }
    toggleOverlay(true);
  };

  if (demoMode) {
    setTimeout(() => {
      if (btn) btn.classList.remove('loading');
      simulateSuccess();
    }, 500);
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error('Failed to submit form');
    }

    simulateSuccess();
  } catch (err) {
    alert('Something went wrong while submitting your request. Please try again or contact us directly by phone or WhatsApp.');
  } finally {
    if (btn) btn.classList.remove('loading');
  }
}

function toggleOverlay(show) {
  const overlay = $('#successOverlay');
  if (!overlay) return;
  overlay.classList.toggle('open', show);
  overlay.setAttribute('aria-hidden', String(!show));
}

// Calendar handling
function handleCalendarAdd(form) {
  // Use appointment form data if available; otherwise, quick form data
  const fullForm = form || $('#appointmentForm') || $('#quickAppointmentForm');
  if (!fullForm) {
    window.open('https://calendar.google.com/', '_blank', 'noopener');
    return;
  }
  const fd = new FormData(fullForm);
  const name = fd.get('name') || fd.get('fullName') || 'Dental appointment';
  const date = (fd.get('preferredDate') || '').toString();
  const time = (fd.get('preferredTime') || '').toString();
  const service = (fd.get('service') || '').toString() || 'Dental consultation';
  const description = (fd.get('message') || '').toString() || 'Dental appointment with SmileBright Dental Clinic.';

  const start = buildDateTime(date, time);
  const end = buildDateTime(date, addMinutesToTime(time || '10:00', 30));

  // Generate ICS and trigger download
  const icsContent = generateICS({
    summary: `Dental appointment - ${service}`,
    description,
    location: 'SmileBright Dental Clinic, 123 Smile Street, [City]',
    start,
    end
  });
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smilebright-appointment.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Open Google Calendar template in new tab
  const gcalUrl = buildGoogleCalendarUrl({
    summary: `Dental appointment - ${service}`,
    description,
    location: 'SmileBright Dental Clinic, 123 Smile Street, [City]',
    start,
    end
  });
  window.open(gcalUrl, '_blank', 'noopener');
}

function buildDateTime(dateStr, timeStr) {
  if (!dateStr) return '';
  const date = dateStr.replace(/-/g, '');
  const time = (timeStr || '10:00').replace(':', '') + '00';
  return `${date}T${time}`;
}

function addMinutesToTime(timeStr, minutesToAdd) {
  const [h, m] = timeStr.split(':').map((v) => parseInt(v || '0', 10));
  const total = h * 60 + m + minutesToAdd;
  const newH = String(Math.floor((total % (24 * 60)) / 60)).padStart(2, '0');
  const newM = String(total % 60).padStart(2, '0');
  return `${newH}:${newM}`;
}

function generateICS({ summary, description, location, start, end }) {
  const dtStamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0]
    .concat('Z');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SmileBright Dental Clinic//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@smilebrightdental.com`,
    `DTSTAMP:${dtStamp}`,
    start ? `DTSTART:${start}` : '',
    end ? `DTEND:${end}` : '',
    `SUMMARY:${escapeICS(summary)}`,
    `LOCATION:${escapeICS(location)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ]
    .filter(Boolean)
    .join('\r\n');
}

function escapeICS(text) {
  return String(text || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

function buildGoogleCalendarUrl({ summary, description, location, start, end }) {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = new URLSearchParams();
  params.set('text', summary);
  if (start && end) {
    params.set('dates', `${start}/${end}`);
  }
  params.set('details', description);
  params.set('location', location);
  return `${base}&${params.toString()}`;
}