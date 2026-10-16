/* paper / night for the CV.
 *
 * The reader's choice is kept under "nc-theme" — the same key the homepage
 * and /noahchou/ use — so a reader who picks night once keeps it as they
 * move between the pages of the site. This file never names a host, so the
 * same copy works on every mirror.
 *
 * This file does three things, in this order:
 *   1. applies the stored choice to <html> before the page paints, so a
 *      night reader never gets a white flash;
 *   2. drops the small moon / sun button into the sidebar, under the
 *      language switcher;
 *   3. flips and stores the theme when that button is clicked.
 *
 * With JavaScript off nothing happens at all: the page stays on the light
 * jemdoc look, which is the default in jemdoc.css.
 */
(function () {
	"use strict";

	var KEY = "nc-theme";
	var root = document.documentElement;

	/* the label under the button says what the click will do */
	var lang = root.getAttribute("lang") || root.getAttribute("xml:lang") || "en";
	var words = {
		"en": ["night", "day"],
		"zh-Hans": ["夜间", "日间"],
		"zh-Hant": ["夜間", "日間"]
	}[lang] || ["night", "day"];

	var ICONS =
		'<svg class="ic moon" viewBox="0 0 24 24" aria-hidden="true">' +
		'<path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z"/></svg>' +
		'<svg class="ic sun" viewBox="0 0 24 24" aria-hidden="true">' +
		'<circle cx="12" cy="12" r="4.2"/>' +
		'<path d="M12 2.6v2.4M12 19v2.4M2.6 12H5M19 12h2.4M5.6 5.6 7.3 7.3' +
		'M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/></svg>';

	function stored() {
		try {
			var v = localStorage.getItem(KEY);
			return (v === "dark" || v === "light") ? v : "";
		} catch (e) {
			return "";
		}
	}

	/* 1. paint early — this runs as a blocking script in <head>.
	      Light is the default; only a choice the reader has made is applied. */
	var theme = stored() || "light";
	if (theme === "dark") { root.setAttribute("data-theme", "dark"); }

	function isDark() { return root.getAttribute("data-theme") === "dark"; }

	function paint() {
		var btn = document.getElementById("theme");
		var word = isDark() ? words[1] : words[0];
		if (btn) {
			var label = btn.querySelector(".menu-theme-t");
			if (label) { label.textContent = word; }
			btn.title = word;
			btn.setAttribute("aria-label", word);
			btn.setAttribute("aria-pressed", isDark() ? "true" : "false");
		}
		var meta = document.querySelector('meta[name="theme-color"]');
		if (meta) { meta.setAttribute("content", isDark() ? "#002b36" : "#ffffff"); }
	}

	/* 2. the button */
	function build() {
		var menu = document.getElementById("layout-menu");
		if (!menu || document.getElementById("theme")) { return; }

		var btn = document.createElement("button");
		btn.type = "button";
		btn.id = "theme";
		btn.className = "menu-theme";
		btn.innerHTML = ICONS + '<span class="menu-theme-t"></span>';

		var lang_row = menu.querySelector(".menu-lang");
		if (lang_row && lang_row.parentNode === menu) {
			menu.insertBefore(btn, lang_row.nextSibling);
		} else {
			menu.insertBefore(btn, menu.firstChild);
		}

		/* 3. the flip */
		btn.addEventListener("click", function () {
			if (isDark()) { root.removeAttribute("data-theme"); }
			else { root.setAttribute("data-theme", "dark"); }
			try { localStorage.setItem(KEY, isDark() ? "dark" : "light"); } catch (e) {}
			paint();
		});

		paint();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", build);
	} else {
		build();
	}
})();
