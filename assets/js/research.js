// research.js - Ovi-inspired research page with auto-stats and separate sections

// Only run on publications page
if (window.location.pathname.includes('publication') || document.title.includes('Publications')) {
  
  // Load both research and service data
  Promise.all([
    fetch('/data/research.json').then(response => response.json()),
    fetch('/data/academic-service.json').then(response => response.json())
  ])
  .then(([publications, services]) => {
    
    // Generate research summary with auto-calculated stats
    generateResearchSummary(publications, services);
    
    // Generate different sections
    generateSection(publications, 'ongoing', 'ongoing-projects');
    generateSection(publications, 'submitted', 'submitted-papers');
    generateSection(publications, 'published', 'published-papers');
    
    // Generate academic service
    generateAcademicService(services);
    
    // Refresh AOS animations
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });
}

// Generate auto-calculated research summary
function generateResearchSummary(publications, services) {
  const summaryContainer = document.getElementById('research-summary');
  if (!summaryContainer) return;
  
  // Calculate stats
  const ongoing = publications.filter(p => p.status === 'ongoing').length;
  const submitted = publications.filter(p => p.status === 'submitted').length;
  const published = publications.filter(p => p.status === 'published').length;
  const total = publications.length;
  
  // Count by type (approximate based on venue)
  const conferences = publications.filter(p => 
    p.venue.toLowerCase().includes('conference') || 
    p.venue.toLowerCase().includes('workshop') ||
    p.venue.toLowerCase().includes('symposium')
  ).length;
  
  const journals = publications.filter(p => 
    p.venue.toLowerCase().includes('journal') ||
    p.venue.toLowerCase().includes('transactions')
  ).length;
  
  const reviewerCount = services.filter(s => s.role.toLowerCase().includes('reviewer')).length;
  
  summaryContainer.innerHTML = `
    <strong>Ongoing projects:</strong> ${ongoing} | 
    <strong>Submitted:</strong> ${submitted} | 
    <strong>Total publications:</strong> ${published} | 
    <strong>Conference papers:</strong> ${conferences} | 
    <strong>Journal articles:</strong> ${journals} | 
    <strong>Academic service:</strong> ${services.length} times
  `;
}

// Generate publications section
function generateSection(publications, status, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const filteredPubs = publications.filter(p => p.status === status);
  
  // Sort by date (newest first)
  filteredPubs.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = '';
  
  filteredPubs.forEach((pub, index) => {
    const publicationHtml = generatePublicationHTML(pub, index, status);
    container.innerHTML += publicationHtml;
  });
}

// Generate academic service section
function generateAcademicService(services) {
  const container = document.getElementById('academic-service');
  if (!container) return;
  
  // Sort by year (newest first)
  services.sort((a, b) => parseInt(b.year) - parseInt(a.year));
  
  container.innerHTML = '';
  
  services.forEach(service => {
    const serviceHtml = `
      <div class="service-item" data-aos="fade-up">
        <div class="service-year">${service.year}</div>
        <div class="service-content">
          <div class="service-role">${service.role}</div>
          <div class="service-venue">${service.venue}${service.location ? `, ${service.location}` : ''}</div>
        </div>
        <div class="service-type">${service.type}</div>
      </div>
    `;
    container.innerHTML += serviceHtml;
  });
}

// Generate HTML for a single publication
function generatePublicationHTML(pub, index, status) {
  const uniqueId = `${status}-${index}`;
  
  return `
    <div class="publication-item" data-aos="fade-up" data-aos-delay="${index * 50}">
      <div class="publication-year">${getYearFromDate(pub.date)}</div>
      <div class="publication-content">
        <div class="publication-title">${pub.title}</div>
        <div class="publication-authors">
          ${highlightAuthor(pub.authors)}
        </div>
        
        ${generateVenueInfo(pub.venue, status)}
        
        ${generatePublicationLinks(pub.links)}
        
        ${pub.abstract ? `
          <button class="abstract-toggle" onclick="toggleAbstract('${uniqueId}')">
            <span>Show Abstract</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="abstract-content" id="abstract-${uniqueId}">
            ${pub.abstract}
          </div>
        ` : ''}
        
        ${generateKeywords(pub.keywords)}
      </div>
      <div class="publication-type">${getPublicationType(pub.venue, status)}</div>
    </div>
  `;
}

// Generate venue information (appears below authors)
function generateVenueInfo(venue, status) {
  // Only show venue info for published papers, and skip generic venues
  if (status !== 'published' || 
      venue.toLowerCase().includes('ongoing') || 
      venue.toLowerCase().includes('preprint')) {
    return '';
  }
  
  return `<div class="publication-venue">${venue}</div>`;
}

// Generate publication links
function generatePublicationLinks(links) {
  if (!links || Object.keys(links).length === 0) return '';
  
  let linksHtml = '<div class="publication-links">';
  
  if (links.paper) {
    linksHtml += `<a href="${links.paper}" target="_blank" class="pub-link link-paper">Paper</a>`;
  }
  if (links.preprint) {
    linksHtml += `<a href="${links.preprint}" target="_blank" class="pub-link link-preprint">Preprint</a>`;
  }
  if (links.code) {
    linksHtml += `<a href="${links.code}" target="_blank" class="pub-link link-code">Code</a>`;
  }
  if (links.doi) {
    linksHtml += `<a href="${links.doi}" target="_blank" class="pub-link link-doi">DOI</a>`;
  }
  if (links.dataset) {
    linksHtml += `<a href="${links.dataset}" target="_blank" class="pub-link link-dataset">Dataset</a>`;
  }
  
  linksHtml += '</div>';
  return linksHtml;
}

// Generate keywords with color coding
function generateKeywords(keywords) {
  if (!keywords || keywords.length === 0) return '';
  
  let keywordsHtml = '<div class="keywords">';
  
  keywords.forEach((keyword, index) => {
    const colorClass = getKeywordColor(keyword);
    keywordsHtml += `<span class="keyword ${colorClass}">${keyword}</span>`;
  });
  
  keywordsHtml += '</div>';
  return keywordsHtml;
}

// Get consistent color for keywords
function getKeywordColor(keyword) {
  // Create a hash from the keyword for consistent coloring
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Map to one of our 30 color classes
  const colorIndex = Math.abs(hash) % 30 + 1;
  return `keyword-${colorIndex}`;
}

// Extract year from date string
function getYearFromDate(dateString) {
  if (dateString.includes('2025') || dateString.includes('2024') || dateString.includes('2023') || 
      dateString.includes('2022') || dateString.includes('2021')) {
    const match = dateString.match(/\b(20\d{2})\b/);
    return match ? match[1] : dateString;
  }
  return dateString;
}

// Highlight author name
function highlightAuthor(authors) {
  // Highlight the main author (assuming it's Taufiq)
  return authors.replace(
    /(Md Taufiqul Haque Khan Tusar)/g,
    '<span class="author-highlight">$1</span>'
  );
}

// Get publication type (simplified since venue info is now in content area)
function getPublicationType(venue, status) {
  const venueLC = venue.toLowerCase();
  
  if (status === 'ongoing') {
    return 'Ongoing';
  } else if (status === 'submitted') {
    return venueLC.includes('arxiv') || venueLC.includes('preprint') ? 'Preprint' : 'Submitted';
  }
  
  if (venueLC.includes('journal') || venueLC.includes('transactions')) {
    return 'Journal';
  } else if (venueLC.includes('conference') || venueLC.includes('workshop') || 
             venueLC.includes('symposium')) {
    return 'Conference';
  } else if (venueLC.includes('thesis')) {
    return 'Thesis';
  } else {
    return 'Other';
  }
}

// Remove the getAbbreviatedVenue function as it's no longer needed

// Toggle abstract function (global scope)
window.toggleAbstract = function(id) {
  const button = document.querySelector(`[onclick="toggleAbstract('${id}')"]`);
  const content = document.getElementById(`abstract-${id}`);
  const icon = button.querySelector('i');
  const text = button.querySelector('span');
  
  if (content.classList.contains('show')) {
    content.classList.remove('show');
    button.classList.remove('expanded');
    text.textContent = 'Show Abstract';
  } else {
    content.classList.add('show');
    button.classList.add('expanded');
    text.textContent = 'Hide Abstract';
  }
};