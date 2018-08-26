console.log('Content Scripts');
const closeButtonSelector =
	'.ima-container .close-padding.condensed.contains-svg';
const skipButtonSelector =
	'.videoAdUi .videoAdUiSkipButton.videoAdUiAction.videoAdUiFixedPaddingSkipButton';

function containsClass(node, selector) {
	return node.classList && node.classList.contains(selector);
}

function isAdTextPresent(value) {
	return value.includes('anuncio') || value.includes('ad');
}

let typeAd = '';
const callback = mutationsList => {
	for (const mutation of mutationsList) {
		if (mutation.type == 'childList' && mutation.addedNodes.length) {
			const skipAddBtn = Array.from(mutation.addedNodes).find(node => {
				if (containsClass(node, 'ima-container')) {
					typeAd = 'image-ad';
					return typeAd;
				}
				if (containsClass(node, 'videoAdUi')) {
					console.log(node.classList);
					typeAd = 'video-ad';
					return typeAd;
				}
				return;
			});

			if (skipAddBtn) {
				let el = null;
				if (typeAd === 'image-ad') {
					el = document.querySelector(closeButtonSelector);
				} else if (typeAd === 'video-ad') {
					el = document.querySelector(skipButtonSelector);
				}
				if (el) {
					console.log('Skip-Youtube Element:', el.innerHTML);
					console.log('Skip-Youtube Type:', typeAd);
					el.click();
					console.log('Skip-Youtube: Clicked');
				}
				return;
			}
		}

		if (mutation.type === 'characterData') {
			const { textContent } = mutation.target;
			if (isAdTextPresent(textContent)) {
				const id = setInterval(() => {
					const btn = document.querySelector(skipButtonSelector);
					console.log('CHD: BUTTON SKIP', btn);
					if (btn === null) {
						clearInterval(id);
					}
					if (btn) {
						btn.click();
						console.log('CHD: BUTTON CLICKED');
					}
				}, 1000);
			}
		}
	}
};

const observer = new MutationObserver(callback);

observer.observe(document.body, {
	characterData: true,
	childList: true,
	subtree: true,
});
