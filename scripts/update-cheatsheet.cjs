const fs = require('fs');
const path = require('path');

const rawPath = 'src/data/v6-raw.json';
const cheatsheetPath = 'src/data/v6-cheatsheet.json';

// Use absolute paths if needed, but assuming cwd is project root
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const cheatsheetData = JSON.parse(fs.readFileSync(cheatsheetPath, 'utf8'));

// Helper to remove markdown
function cleanDescription(text) {
	if (!text) return '';
	// Remove links [text](url) -> text
	let clean = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
	// Remove bold **text** -> text
	clean = clean.replace(/\*\*([^\*]+)\*\*/g, '$1');
	// Remove code `text` -> text
	clean = clean.replace(/`([^`]+)`/g, '$1');
	return clean;
}

// Helper to get short description
function getShortDescription(descArray) {
	if (!descArray || descArray.length === 0) return '';

	let text = descArray[0];

	// Clean it first
	text = cleanDescription(text);

	// Try to take the first sentence
	const periodIndex = text.indexOf('. ');
	if (periodIndex !== -1) {
		return text.substring(0, periodIndex + 1);
	}

	// If ends with period
	if (text.endsWith('.')) {
		return text;
	}

	// If very long and no period
	if (text.length > 200) {
		return text.substring(0, 197) + '...';
	}

	return text;
}

// Build lookup map from raw data
const lookup = {};

function addToLookup(category, item) {
	const name = item.name;
	if (!name) return;

	if (!lookup[name]) {
		lookup[name] = [];
	}

	const desc = getShortDescription(item.desc);

	lookup[name].push({
		rawCategory: category,
		desc: desc,
		originalItem: item,
	});
}

// Iterate all keys in raw data
const keys = [
	'keywords',
	'operators',
	'variables',
	'constants',
	'types',
	'annotations',
	'functions',
	'methods',
];
for (const key of keys) {
	if (rawData[key] && Array.isArray(rawData[key])) {
		rawData[key].forEach((item) => addToLookup(key, item));
	}
}

// Update cheatsheet data
let updatedCount = 0;
cheatsheetData.forEach((item) => {
	let name = item.name;
	let cleanName = name;

	// Normalize name: remove parens if present
	if (name.endsWith('()')) {
		cleanName = name.slice(0, -2);
	}

	// Try to look up by cleanName first
	let matches = lookup[cleanName];

	// If no match, try original name
	if (!matches && cleanName !== name) {
		matches = lookup[name];
	}

	if (matches && matches.length > 0) {
		let bestMatch = matches[0];

		// Disambiguation logic
		const categoryLower = (item.category || '').toLowerCase();

		if (matches.length > 1) {
			if (categoryLower.includes('type')) {
				const m = matches.find((x) => x.rawCategory === 'types');
				if (m) bestMatch = m;
			} else if (
				categoryLower.includes('math') ||
				categoryLower.includes('array') ||
				categoryLower.includes('string')
			) {
				const m = matches.find(
					(x) => x.rawCategory === 'functions' || x.rawCategory === 'methods'
				);
				if (m) bestMatch = m;
			} else if (categoryLower.includes('operator')) {
				const m = matches.find((x) => x.rawCategory === 'operators');
				if (m) bestMatch = m;
			} else if (categoryLower.includes('keyword')) {
				const m = matches.find((x) => x.rawCategory === 'keywords');
				if (m) bestMatch = m;
			} else if (categoryLower.includes('data') || categoryLower.includes('variable')) {
				const m = matches.find((x) => x.rawCategory === 'variables');
				if (m) bestMatch = m;
			} else if (categoryLower.includes('annotation')) {
				const m = matches.find((x) => x.rawCategory === 'annotations');
				if (m) bestMatch = m;
			} else if (categoryLower.includes('color')) {
				// Colors can be constants or functions
				// Prefer constants if name starts with color.
				const m = matches.find((x) => x.rawCategory === 'constants');
				if (m) bestMatch = m;
			}
		}

		if (bestMatch.desc && bestMatch.desc.trim().length > 0) {
			item.desc = bestMatch.desc;
			updatedCount++;
		}
	}
});

console.log(`Updated ${updatedCount} items.`);
fs.writeFileSync(cheatsheetPath, JSON.stringify(cheatsheetData, null, 2));
