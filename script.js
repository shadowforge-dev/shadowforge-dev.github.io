function setRandomAsciiArt() {
	const titleHeader = document.getElementById('title-header');
	if (!titleHeader) return;

	fetch('ascii-arts.txt')
		.then(function(r) { return r.text(); })
		.then(function(text) {
			const arts = text.split('\n---\n').filter(function(a) { return a.trim(); });
			const art = arts[Math.floor(Math.random() * arts.length)];
			titleHeader.textContent = art.replace(/^\n+/, '').replace(/\n+$/, '');
		})
		.catch(function() {
			titleHeader.textContent = 'ShadowForge LLC';
		});
}

function stylizeJSON(json) {
	const jsonContainer = document.getElementById('json-container');

	// Function to replace URLs and emails with links
	function replaceMarkdownLinks(text, key) {
		if (key && key.toLowerCase().includes('url')) {
			if (text.startsWith('/')) {
				// Internal link (popup removed, so just standard link if needed)
				return `<a href="${text}" class="json-link">${text}</a>`;
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

	// Convert JSON object to styled HTML with real JSON syntax
	function jsonToHtml(obj, indent = 0) {
		const pad = '  '.repeat(indent);
		const innerPad = '  '.repeat(indent + 1);

		if (Array.isArray(obj)) {
			if (obj.length === 0) return '<span class="json-bracket">[]</span>';
			let html = '<span class="json-bracket">[</span>\n';
			obj.forEach((item, i) => {
				const comma = i < obj.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += `${innerPad}${jsonToHtml(item, indent + 1)}${comma}\n`;
			});
			html += `${pad}<span class="json-bracket">]</span>`;
			return html;
		} else if (typeof obj === 'object' && obj !== null) {
			const keys = Object.keys(obj);
			if (keys.length === 0) return '<span class="json-brace">{}</span>';
			let html = '<span class="json-brace">{</span>\n';
			keys.forEach((key, i) => {
				const comma = i < keys.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += `${innerPad}<span class="json-key">"${key}"</span><span class="json-colon">: </span>${jsonToHtml(obj[key], indent + 1)}${comma}\n`;
			});
			html += `${pad}<span class="json-brace">}</span>`;
			return html;
		} else if (typeof obj === 'string') {
			if (obj.includes('<a ')) {
				return `<span class="json-quote">"</span>${obj}<span class="json-quote">"</span>`;
			}
			return `<span class="json-value">"${obj}"</span>`;
		} else if (typeof obj === 'number') {
			return `<span class="json-number">${obj}</span>`;
		} else if (typeof obj === 'boolean') {
			return `<span class="json-boolean">${obj}</span>`;
		}
		return `<span class="json-null">null</span>`;
	}

	jsonContainer.innerHTML = jsonToHtml(json);
}

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

function initOldGold() {
	const widget = document.getElementById('oldgold-widget');
	const modal = document.getElementById('oldgold-modal');
	const closeBtn = document.getElementById('oldgold-close');
	const details = document.getElementById('oldgold-details');

	if (!widget || !modal) return;

	const oldGoldData = {
		app: {
			name: "OldGold",
			version: "1.1.0",
			platform: "Safari Extension",
			devices: ["iOS", "macOS"],
			description: "Enhances old.reddit.com"
		},
		features: [
			"Dark themes & color palettes",
			"Inline media expansion",
			"Infinite scrolling",
			"Content filtering",
			"Thumbnail hover previews",
			"Customizable post layout",
			"Ad & clutter removal"
		]
	};

	function renderDetails(obj, indent) {
		indent = indent || 0;
		const pad = '  '.repeat(indent);
		const innerPad = '  '.repeat(indent + 1);

		if (Array.isArray(obj)) {
			if (obj.length === 0) return '<span class="json-bracket">[]</span>';
			let html = '<span class="json-bracket">[</span>\n';
			obj.forEach(function(item, i) {
				const comma = i < obj.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += innerPad + renderDetails(item, indent + 1) + comma + '\n';
			});
			html += pad + '<span class="json-bracket">]</span>';
			return html;
		} else if (typeof obj === 'object' && obj !== null) {
			const keys = Object.keys(obj);
			if (keys.length === 0) return '<span class="json-brace">{}</span>';
			let html = '<span class="json-brace">{</span>\n';
			keys.forEach(function(key, i) {
				const comma = i < keys.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += innerPad + '<span class="json-key">"' + key + '"</span><span class="json-colon">: </span>' + renderDetails(obj[key], indent + 1) + comma + '\n';
			});
			html += pad + '<span class="json-brace">}</span>';
			return html;
		} else if (typeof obj === 'string') {
			if (obj.includes('@')) {
				return '<span class="json-quote">"</span><a href="mailto:' + obj + '" class="json-link">' + obj + '</a><span class="json-quote">"</span>';
			}
			return '<span class="json-value">"' + obj + '"</span>';
		} else if (typeof obj === 'number') {
			return '<span class="json-number">' + obj + '</span>';
		}
		return '<span class="json-null">null</span>';
	}

	details.innerHTML = renderDetails(oldGoldData);

	widget.style.cursor = 'pointer';
	widget.addEventListener('click', function() {
		window.location.href = 'https://oldgold.shadowforge.dev';
	});
}

function initQuiverBooks() {
	const widget = document.getElementById('quiverbooks-widget');
	const modal = document.getElementById('quiverbooks-modal');
	const closeBtn = document.getElementById('quiverbooks-close');
	const details = document.getElementById('quiverbooks-details');

	if (!widget || !modal) return;

	const quiverBooksData = {
		app: {
			name: "QuiverBooks",
			version: "0.6.11",
			platform: "iOS / macOS",
			description: "Your personal e-reader adventure"
		},
		features: [
			"EPUB, MOBI, AZW, PDF, CBZ",
			"13 themes, customizable typography",
			"Bookmarks, highlights, annotation export",
			"Daily quests, achievements, character sheet",
			"X-Ray Index (on-device)",
			"Collections & smart filters",
			"Zero tracking, zero data collection"
		]
	};

	function renderDetails(obj, indent) {
		indent = indent || 0;
		const pad = '  '.repeat(indent);
		const innerPad = '  '.repeat(indent + 1);

		if (Array.isArray(obj)) {
			if (obj.length === 0) return '<span class="json-bracket">[]</span>';
			let html = '<span class="json-bracket">[</span>\n';
			obj.forEach(function(item, i) {
				const comma = i < obj.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += innerPad + renderDetails(item, indent + 1) + comma + '\n';
			});
			html += pad + '<span class="json-bracket">]</span>';
			return html;
		} else if (typeof obj === 'object' && obj !== null) {
			const keys = Object.keys(obj);
			if (keys.length === 0) return '<span class="json-brace">{}</span>';
			let html = '<span class="json-brace">{</span>\n';
			keys.forEach(function(key, i) {
				const comma = i < keys.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += innerPad + '<span class="json-key">"' + key + '"</span><span class="json-colon">: </span>' + renderDetails(obj[key], indent + 1) + comma + '\n';
			});
			html += pad + '<span class="json-brace">}</span>';
			return html;
		} else if (typeof obj === 'string') {
			if (obj.includes('@')) {
				return '<span class="json-quote">"</span><a href="mailto:' + obj + '" class="json-link">' + obj + '</a><span class="json-quote">"</span>';
			}
			return '<span class="json-value">"' + obj + '"</span>';
		} else if (typeof obj === 'number') {
			return '<span class="json-number">' + obj + '</span>';
		}
		return '<span class="json-null">null</span>';
	}

	details.innerHTML = renderDetails(quiverBooksData);

	widget.style.cursor = 'pointer';
	widget.addEventListener('click', function() {
		window.location.href = 'https://quiverbooks.app';
	});
}

function initPsydex() {
	const widget = document.getElementById('psydex-widget');
	const modal = document.getElementById('psydex-modal');
	const closeBtn = document.getElementById('psydex-close');
	const details = document.getElementById('psydex-details');

	if (!widget || !modal) return;

	const psydexData = {
		app: {
			name: "Psydex",
			version: "0.6.11",
			platform: "iOS / iPadOS / macOS / visionOS",
			description: "Pokemon card database, prices & collection tracker"
		},
		features: [
			"128K+ cards across 11 languages",
			"TCGPlayer & Cardmarket prices",
			"Collection tracking with iCloud sync",
			"Pokedex lore, sprites & evolution chains",
			"Natural language search (on-device AI)",
			"Card scanner (Vision OCR)",
			"Siri & Spotlight integration"
		]
	};

	function renderDetails(obj, indent) {
		indent = indent || 0;
		const pad = '  '.repeat(indent);
		const innerPad = '  '.repeat(indent + 1);

		if (Array.isArray(obj)) {
			if (obj.length === 0) return '<span class="json-bracket">[]</span>';
			let html = '<span class="json-bracket">[</span>\n';
			obj.forEach(function(item, i) {
				const comma = i < obj.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += innerPad + renderDetails(item, indent + 1) + comma + '\n';
			});
			html += pad + '<span class="json-bracket">]</span>';
			return html;
		} else if (typeof obj === 'object' && obj !== null) {
			const keys = Object.keys(obj);
			if (keys.length === 0) return '<span class="json-brace">{}</span>';
			let html = '<span class="json-brace">{</span>\n';
			keys.forEach(function(key, i) {
				const comma = i < keys.length - 1 ? '<span class="json-comma">,</span>' : '';
				html += innerPad + '<span class="json-key">"' + key + '"</span><span class="json-colon">: </span>' + renderDetails(obj[key], indent + 1) + comma + '\n';
			});
			html += pad + '<span class="json-brace">}</span>';
			return html;
		} else if (typeof obj === 'string') {
			if (obj.includes('@')) {
				return '<span class="json-quote">"</span><a href="mailto:' + obj + '" class="json-link">' + obj + '</a><span class="json-quote">"</span>';
			}
			return '<span class="json-value">"' + obj + '"</span>';
		} else if (typeof obj === 'number') {
			return '<span class="json-number">' + obj + '</span>';
		}
		return '<span class="json-null">null</span>';
	}

	details.innerHTML = renderDetails(psydexData);

	widget.style.cursor = 'pointer';
	widget.addEventListener('click', function() {
		window.location.href = 'https://psydex.cards';
	});
}

// Export for tests
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { stylizeJSON, showErrorBanner, setRandomAsciiArt, initOldGold, initQuiverBooks, initPsydex };
}
