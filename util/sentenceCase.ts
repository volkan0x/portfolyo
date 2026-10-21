export type SentenceCaseState = {
	capitalizeNext: boolean;
};

const latinLetter = /[A-Za-z\u00C0-\u024F]/;
const lowercaseBrandNames = ["volkan0x.pro", "aristo.today", "volkan0x"];

function protectedTokenAt(value: string, index: number): string | null {
	if (index > 0 && /[A-Za-z0-9_-]/.test(value[index - 1])) return null;

	const remaining = value.slice(index);
	const brand = lowercaseBrandNames.find((name) =>
		remaining.toLowerCase().startsWith(name),
	);
	const token =
		brand ??
		/^(?:https?:\/\/|www\.)\S+/i.exec(remaining)?.[0] ??
		/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/i.exec(remaining)?.[0];

	if (!token) return null;
	const trailingPunctuation = token.match(/[.,!?;:]+$/)?.[0] ?? "";
	return token.slice(0, token.length - trailingPunctuation.length) || null;
}

export function sentenceCaseText(
	value: string,
	state: SentenceCaseState = { capitalizeNext: true },
): string {
	let result = "";
	let index = 0;

	while (index < value.length) {
		const protectedToken = protectedTokenAt(value, index);
		if (protectedToken) {
			result += lowercaseBrandNames.includes(protectedToken.toLowerCase())
				? protectedToken.toLowerCase()
				: protectedToken;
			index += protectedToken.length;
			state.capitalizeNext = false;
			continue;
		}

		const character = String.fromCodePoint(value.codePointAt(index)!);
		if (state.capitalizeNext && latinLetter.test(character)) {
			result += character.toUpperCase();
			state.capitalizeNext = false;
			index += character.length;
			continue;
		}

		result += character;
		if (/[.!?]/.test(character)) state.capitalizeNext = true;
		index += character.length;
	}

	return result;
}

export function sentenceCase(value: string): string {
	return sentenceCaseText(value);
}