// ==UserScript==
// @name				YouTube Ad Muter
// @version				1.0.0
// @description			User script to automatically mute YouTube ads
// @author				AndyPSam
// @namespace			https://github.com/AndyPSam/YT-Ad-Muter-UserScript
// @homepageURL			https://github.com/AndyPSam/YT-Ad-Muter-UserScript
// @grant				none
// @include				http*://*.youtube.com/watch*
// ==/UserScript==

const adMuteIntervalTime = 100;

const adOverlayClassList = "ytp-ad-player-overlay-skip-or-preview";
const muteClassList = "ytp-mute-button ytp-button";
const volumeClassList = "ytp-volume-panel";
const volumeMutedAttribute = "aria-valuetext";
const volumeMutedAttributeValue = "muted";

let adMuteIntervalId;
let adObserved = false;
let adMuted = false;

function startAdMuteInterval() {
	adMuteIntervalId = setInterval(() => {
		if (isAdVisible()) {
			if (!adObserved) {
				adObserved = true;

				if (!isVideoMuted()) {
					adMuted = true;

					// Mute video (ad)
					toggleVideoMute();
				}
			}
		} else {
			if (adObserved) {
				adObserved = false;

				if (adMuted) {
					adMuted = false;

					if (isVideoMuted()) {
						// Unmute video
						toggleVideoMute();
					}
				}
			}
		}
	}, adMuteIntervalTime);
}

function isAdVisible() {
	try {
		return document.getElementsByClassName(adOverlayClassList)[0].offsetParent === null ? false : true;
	} catch (e) {
		return false;
	}
}

function isVideoMuted() {
	return document.getElementsByClassName(volumeClassList)[0].getAttribute(volumeMutedAttribute).includes(volumeMutedAttributeValue);
}

function toggleVideoMute() {
	const muteElement = document.getElementsByClassName(muteClassList)[0];

	if (typeof muteElement.fireEvent === "function") {
		muteElement.fireEvent("onclick");
	} else if (typeof muteElement.dispatchEvent === "function") {
		const evObj = document.createEvent("Events");
		evObj.initEvent("click", true, false);
		muteElement.dispatchEvent(evObj);
	}
}

console.log("Starting ad mute script");
startAdMuteInterval();
