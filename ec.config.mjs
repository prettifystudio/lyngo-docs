// Code blocks, in the app's look. Kept in this file (not inline in the
// Starlight config): inline options were applied to the stylesheet but not to
// the page, and the two disagreed on the stylesheet's name.
import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
	themes: ['github-dark-default'],
	useStarlightDarkModeSwitch: false,
	styleOverrides: {
		borderRadius: '12px',
		borderColor: '#1c1c1c',
		borderWidth: '1px',
		codeBackground: '#0d0d0d',
		codeFontFamily: "'JetBrains Mono', ui-monospace, monospace",
		codeFontSize: '13px',
		codeLineHeight: '1.7',
		codePaddingBlock: '16px',
		codePaddingInline: '18px',
		uiFontFamily: "'JetBrains Mono', ui-monospace, monospace",
		uiFontSize: '11px',
		frames: {
			shadowColor: 'transparent',
			editorBackground: '#0d0d0d',
			editorActiveTabBackground: '#0a0a0a',
			editorActiveTabForeground: '#ededed',
			editorTabBarBackground: '#0d0d0d',
			editorTabBarBorderBottomColor: '#1c1c1c',
			terminalBackground: '#0d0d0d',
			terminalTitlebarBackground: '#0d0d0d',
			terminalTitlebarBorderBottomColor: '#1c1c1c',
			terminalTitlebarDotsForeground: '#1f1f1f',
			terminalTitlebarDotsOpacity: '1',
			terminalTitlebarForeground: '#666',
			inlineButtonBackground: '#141414',
			inlineButtonBorder: '#2a2a2a',
			inlineButtonForeground: '#999',
		},
	},
});
