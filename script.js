  
  function stylizeJSON(json) {
	 const jsonContainer = document.getElementById('json-container');

	 // Function to replace URLs and emails with links
	 function replaceMarkdownLinks(text, key) {
		if (key && key.toLowerCase().includes('url')) {
		   if (text.startsWith('/')) {
			  // Internal link
			  return `<a href="${text}" class="json-link" onclick="loadInternalContent(event, '${text}')">${text}</a>`;
		   } else {
			  // External link
			  return `<a href="${text}" class="json-link" target="_blank">${text}</a>`;
		   }
		} else if (key && key.toLowerCase().includes('email')) {
		   let url = text.startsWith('mailto:') ? text : `mailto:${text}`;
		   return `<a href="${url}" class="json-link">${text}</a>`;
		}
		return text;
	 }

	 // Recursive function to traverse the object and replace links
	 function traverseAndReplace(obj) {
		if (typeof obj === 'object') {
		   for (const key in obj) {
			  if (typeof obj[key] === 'string') {
				 obj[key] = replaceMarkdownLinks(obj[key], key);
			  } else if (typeof obj[key] === 'object') {
				 traverseAndReplace(obj[key]);
			  }
		   }
		}
	 }

	 traverseAndReplace(json);

	 // Convert JSON object to styled HTML
	 function jsonToHtml(obj) {
		if (typeof obj === 'object') {
		   let html = '<ul class="json-list">';
		   for (const key in obj) {
			  html += `<li class="json-item"><strong class="json-key">${key}<span class="colon">:</span></strong> `;
			  if (typeof obj[key] === 'object') {
				 html += jsonToHtml(obj[key]);
			  } else {
				 html += `<span class="json-value">${obj[key]}</span>`;
			  }
			  html += '</li>';
		   }
		   html += '</ul>';
		   return html;
		}
		return obj;
	 }

	 jsonContainer.innerHTML = jsonToHtml(json);
  }

  function loadInternalContent(event, url) {
	   event.preventDefault();
	   fetch(url)
		  .then(response => response.text())
		  .then(html => {
			 const contentContainer = document.getElementById('content-inner');
			 contentContainer.innerHTML = html;
			 document.getElementById('content-container').style.display = 'block';
		  })
		  .catch(error => {
			 console.error('Error loading internal content:', error);
			 showErrorBanner('Failed to load content. Please try again later.');
		  });
	}
	 
	  document.getElementById('close-btn').onclick = function() {
		 document.getElementById('content-container').style.display = 'none';
	  };

  function showErrorBanner(message) {
	 const banner = document.createElement('div');
	 banner.className = 'error-banner';
	 banner.textContent = message;

	 document.body.appendChild(banner);

	 // Trigger the drop-down animation
	 setTimeout(() => banner.classList.add('show'), 10);

	 // Retract the banner after 5 seconds
	 setTimeout(() => {
		banner.classList.remove('show');
		banner.addEventListener('transitionend', () => {
		   document.body.removeChild(banner);
		}, { once: true });
	 }, 5000);
  }