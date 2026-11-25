// The Hearth feedback form on shadowforge.dev pages. Any <form class="hearth-form"> works:
// the app comes from data-app on the form, or from a field named "app".
document.querySelectorAll('form.hearth-form').forEach(function (form) {
	var status = form.querySelector('.form-status');
	var btn = form.querySelector('button[type="submit"]');
	var label = btn.textContent;
	form.addEventListener('submit', async function (e) {
		e.preventDefault();
		btn.disabled = true;
		btn.textContent = 'Sending…';
		status.textContent = '';
		status.className = 'form-status';
		var body = {
			app: form.dataset.app || (form.app && form.app.value),
			category: form.category.value,
			message: form.message.value,
		};
		var email = form.contactEmail.value.trim();
		if (email) body.contactEmail = email;
		try {
			var res = await fetch('/api/feedback', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error('Failed');
			status.textContent = 'Sent. Thank you — it goes straight to the person who makes the app.';
			status.className = 'form-status success';
			form.reset();
		} catch (err) {
			status.textContent = 'That didn’t send. Please try again in a moment.';
			status.className = 'form-status error';
		} finally {
			btn.disabled = false;
			btn.textContent = label;
		}
	});
});
