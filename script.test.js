/**
 * @jest-environment jsdom
 */

const { stylizeJSON, loadInternalContent, showErrorBanner } = require('./script.js');

describe('stylizeJSON', () => {
	let jsonContainer;

	beforeEach(() => {
		// Set up our document body for each test
		document.body.innerHTML = `
	  <div id="json-container"></div>
	  <div id="content-container" style="display: none;">
		<div id="content-inner"></div>
	  </div>
	  <button id="close-btn"></button>
	`;

		jsonContainer = document.getElementById('json-container');
	});

	// Your test cases for stylizeJSON here
	it('should replace URLs with links', () => {
		const json = { url: 'https://example.com' };
		stylizeJSON(json);

		expect(jsonContainer.innerHTML).toContain('<a href="https://example.com" class="json-link" target="_blank">https://example.com</a>');
	});

	it('should replace emails with mailto links', () => {
		const json = { email: 'user@example.com' };
		stylizeJSON(json);

		expect(jsonContainer.innerHTML).toContain('<a href="mailto:user@example.com" class="json-link">user@example.com</a>');
	});

	it('should handle nested objects', () => {
		const json = { user: { profile: { url: 'https://profile.com' } } };
		stylizeJSON(json);

		expect(jsonContainer.innerHTML).toContain('<a href="https://profile.com" class="json-link" target="_blank">https://profile.com</a>');
	});
});

describe('showErrorBanner', () => {
	jest.useFakeTimers(); // Use fake timers to control setTimeout

	it('should display and remove an error banner', () => {
		showErrorBanner('Test error message');

		const banner = document.querySelector('.error-banner');
		expect(banner).toBeTruthy();
		expect(banner.textContent).toBe('Test error message');

		// Simulate the banner showing
		jest.advanceTimersByTime(10);
		expect(banner.classList.contains('show')).toBe(true);

		// Simulate waiting for 5 seconds for the banner to hide
		jest.advanceTimersByTime(5000);
		expect(banner.classList.contains('show')).toBe(false);

		// Simulate the transition end and banner removal
		banner.dispatchEvent(new Event('transitionend'));
		expect(document.querySelector('.error-banner')).toBeNull();
	});
});