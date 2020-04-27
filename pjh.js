#!/usr/bin/env node

process.stdout.clearLine();
process.stdout.cursorTo(0);

let output = ``;

var colorize = (message, codes = [49]) =>
	(output += [
		...codes.map(code => `\x1b[` + code + `m`),
		message,
		`\x1b[0m`
	].join(``));

const tkColors = [32, 33, 34, 35, 36, 37, 93, 94, 95, 96, 97];
const tks = [];

const r = Object.entries(JSON.parse(process.argv[2]).scripts)
	.filter(([k, v]) => v.lastIndexOf(`#pjh-ignore`) < 0)
	.map(([k, v]) => [
		k.split(`:`).map(t => {
			const existingToken = tks.find(tk => t === tk.s);
			if (existingToken) {
				return {
					s: t,
					f: [existingToken.f]
				};
			} else {
				const newToken = {
					s: t,
					f: [tkColors[tks.length % (tkColors.length - 1)]]
				};

				tks.push(newToken);

				return newToken;
			}
		}),
		v.lastIndexOf(`#`) < 0
			? { f: [41, 39], s: `No documentation available` }
			: { f: [49], s: v.slice(v.lastIndexOf(`#pjh`) + 5) }
	])
	.sort(([k, v]) => 1);

const L =
	[...r].sort((a, b) => b[1].s.length - a[1].s.length)[0][1].s.length + 2;
colorize(`\n\n` + [...Array(L + 3).keys()].map(() => ` `).join(``));
colorize(`Available Scripts\n\n`, [1, 4, 91]);

for (let i = 0; i < r.length; i++) {
	const [v, k] = r[i];

	colorize([...Array(L - k.s.length).keys()].map(() => ` `).join(``));
	colorize(k.s, k.f);

	colorize(`   npm `, [91]);
	colorize(`run `, [92]);
	for (let j = 0; j < v.length; ++j) {
		colorize(v[j].s, v[j].f);
		if (j < v.length - 1) {
			colorize(`:`);
		}
	}

	colorize(i < r.length - 1 ? (r[i + 1][0].length !== 1 ? `` : `\n`) : ``);

	colorize(`\n`);
}

colorize(`\n`);

console.log(`%s`, output);
