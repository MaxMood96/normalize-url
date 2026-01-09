import test from 'ava';
import normalizeUrl from './index.js';

test('main', t => {
	t.is(normalizeUrl('sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('sindresorhus.com '), 'http://sindresorhus.com');
	t.is(normalizeUrl('sindresorhus.com.'), 'http://sindresorhus.com');
	t.is(normalizeUrl('SindreSorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('HTTP://sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('//sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com:80'), 'http://sindresorhus.com');
	t.is(normalizeUrl('https://sindresorhus.com:443'), 'https://sindresorhus.com');
	t.is(normalizeUrl('http://www.sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('www.com'), 'http://www.com');
	t.is(normalizeUrl('http://www.www.sindresorhus.com'), 'http://www.www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/foo/'), 'http://sindresorhus.com/foo');
	t.is(normalizeUrl('sindresorhus.com/?foo=bar baz'), 'http://sindresorhus.com/?foo=bar+baz');
	t.is(normalizeUrl('https://foo.com/https://bar.com'), 'https://foo.com/https://bar.com');
	t.is(normalizeUrl('https://foo.com/https://bar.com/foo//bar'), 'https://foo.com/https://bar.com/foo/bar');
	t.is(normalizeUrl('https://foo.com/http://bar.com'), 'https://foo.com/http://bar.com');
	t.is(normalizeUrl('https://foo.com/http://bar.com/foo//bar'), 'https://foo.com/http://bar.com/foo/bar');
	t.is(normalizeUrl('http://sindresorhus.com/%7Efoo/'), 'http://sindresorhus.com/~foo', 'decode URI octets');
	t.is(normalizeUrl('https://foo.com/%FAIL%/07/94/ca/55.jpg'), 'https://foo.com/%FAIL%/07/94/ca/55.jpg');
	t.is(normalizeUrl('http://sindresorhus.com/?'), 'http://sindresorhus.com');
	t.is(normalizeUrl('êxample.com'), 'http://xn--xample-hva.com');
	t.is(normalizeUrl('http://sindresorhus.com/?b=bar&a=foo'), 'http://sindresorhus.com/?a=foo&b=bar');
	t.is(normalizeUrl('http://sindresorhus.com/?foo=bar*|<>:"'), 'http://sindresorhus.com/?foo=bar*|%3C%3E:%22');
	t.is(normalizeUrl('http://sindresorhus.com:5000'), 'http://sindresorhus.com:5000');
	t.is(normalizeUrl('//sindresorhus.com/', {normalizeProtocol: false}), '//sindresorhus.com');
	t.is(normalizeUrl('//sindresorhus.com:80/', {normalizeProtocol: false}), '//sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/foo#bar'), 'http://sindresorhus.com/foo#bar');
	t.is(normalizeUrl('http://sindresorhus.com/foo#bar', {stripHash: true}), 'http://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/foo#bar:~:text=hello%20world', {stripHash: true}), 'http://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/foo/bar/../baz'), 'http://sindresorhus.com/foo/baz');
	t.is(normalizeUrl('http://sindresorhus.com/foo/bar/./baz'), 'http://sindresorhus.com/foo/bar/baz');
	// t.is(normalizeUrl('sindre://www.sorhus.com'), 'sindre://sorhus.com');
	// t.is(normalizeUrl('sindre://www.sorhus.com/'), 'sindre://sorhus.com');
	// t.is(normalizeUrl('sindre://www.sorhus.com/foo/bar'), 'sindre://sorhus.com/foo/bar');
	t.is(normalizeUrl('https://i.vimeocdn.com/filter/overlay?src0=https://i.vimeocdn.com/video/598160082_1280x720.jpg&src1=https://f.vimeocdn.com/images_v6/share/play_icon_overlay.png'), 'https://i.vimeocdn.com/filter/overlay?src0=https://i.vimeocdn.com/video/598160082_1280x720.jpg&src1=https://f.vimeocdn.com/images_v6/share/play_icon_overlay.png');
	t.is(normalizeUrl('sindresorhus.com:123'), 'http://sindresorhus.com:123');
});

test('defaultProtocol option', t => {
	t.is(normalizeUrl('sindresorhus.com', {defaultProtocol: 'https'}), 'https://sindresorhus.com');
	t.is(normalizeUrl('sindresorhus.com', {defaultProtocol: 'http'}), 'http://sindresorhus.com');

	// Legacy
	t.is(normalizeUrl('sindresorhus.com', {defaultProtocol: 'https:'}), 'https://sindresorhus.com');
	t.is(normalizeUrl('sindresorhus.com', {defaultProtocol: 'http:'}), 'http://sindresorhus.com');
});

test('stripAuthentication option', t => {
	t.is(normalizeUrl('http://user:password@www.sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('https://user:password@www.sindresorhus.com'), 'https://sindresorhus.com');
	t.is(normalizeUrl('https://user:password@www.sindresorhus.com/@user'), 'https://sindresorhus.com/@user');
	t.is(normalizeUrl('http://user:password@www.êxample.com'), 'http://xn--xample-hva.com');
	// t.is(normalizeUrl('sindre://user:password@www.sorhus.com'), 'sindre://sorhus.com');

	const options = {stripAuthentication: false};
	t.is(normalizeUrl('http://user:password@www.sindresorhus.com', options), 'http://user:password@sindresorhus.com');
	t.is(normalizeUrl('https://user:password@www.sindresorhus.com', options), 'https://user:password@sindresorhus.com');
	t.is(normalizeUrl('https://user:password@www.sindresorhus.com/@user', options), 'https://user:password@sindresorhus.com/@user');
	t.is(normalizeUrl('http://user:password@www.êxample.com', options), 'http://user:password@xn--xample-hva.com');
	// t.is(normalizeUrl('sindre://user:password@www.sorhus.com', options), 'sindre://user:password@sorhus.com');
});

test('stripProtocol option', t => {
	const options = {stripProtocol: true};
	t.is(normalizeUrl('http://www.sindresorhus.com', options), 'sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com', options), 'sindresorhus.com');
	t.is(normalizeUrl('https://www.sindresorhus.com', options), 'sindresorhus.com');
	t.is(normalizeUrl('//www.sindresorhus.com', options), 'sindresorhus.com');
});

test('stripTextFragment option', t => {
	t.is(normalizeUrl('http://sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/about#'), 'http://sindresorhus.com/about');
	t.is(normalizeUrl('http://sindresorhus.com/about#:~:text=hello'), 'http://sindresorhus.com/about');
	t.is(normalizeUrl('http://sindresorhus.com/about#main'), 'http://sindresorhus.com/about#main');
	t.is(normalizeUrl('http://sindresorhus.com/about#main:~:text=hello'), 'http://sindresorhus.com/about#main');
	t.is(normalizeUrl('http://sindresorhus.com/about#main:~:text=hello%20world'), 'http://sindresorhus.com/about#main');

	const options = {stripTextFragment: false};
	t.is(normalizeUrl('http://sindresorhus.com', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/about#:~:text=hello', options), 'http://sindresorhus.com/about#:~:text=hello');
	t.is(normalizeUrl('http://sindresorhus.com/about#main', options), 'http://sindresorhus.com/about#main');
	t.is(normalizeUrl('http://sindresorhus.com/about#main:~:text=hello', options), 'http://sindresorhus.com/about#main:~:text=hello');
	t.is(normalizeUrl('http://sindresorhus.com/about#main:~:text=hello%20world', options), 'http://sindresorhus.com/about#main:~:text=hello%20world');

	const options2 = {stripHash: true, stripTextFragment: false};
	t.is(normalizeUrl('http://sindresorhus.com', options2), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/about#:~:text=hello', options2), 'http://sindresorhus.com/about');
	t.is(normalizeUrl('http://sindresorhus.com/about#main', options2), 'http://sindresorhus.com/about');
	t.is(normalizeUrl('http://sindresorhus.com/about#main:~:text=hello', options2), 'http://sindresorhus.com/about');
	t.is(normalizeUrl('http://sindresorhus.com/about#main:~:text=hello%20world', options2), 'http://sindresorhus.com/about');
});

test('stripWWW option', t => {
	const options = {stripWWW: false};
	t.is(normalizeUrl('http://www.sindresorhus.com', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('http://www.êxample.com', options), 'http://www.xn--xample-hva.com');
	// t.is(normalizeUrl('sindre://www.sorhus.com', options), 'sindre://www.sorhus.com');

	const options2 = {stripWWW: true};
	t.is(normalizeUrl('http://www.vue.amsterdam', options2), 'http://vue.amsterdam');
	t.is(normalizeUrl('http://www.sorhus.xx--bck1b9a5dre4c', options2), 'http://sorhus.xx--bck1b9a5dre4c');

	const tooLongTLDURL = 'http://www.sorhus.' + ''.padEnd(64, 'a');
	t.is(normalizeUrl(tooLongTLDURL, options2), tooLongTLDURL);
	
	// Issue #109 - Should strip www from multi-level subdomains
	t.is(normalizeUrl('www.unix.stackexchange.com'), 'http://unix.stackexchange.com');
	t.is(normalizeUrl('https://www.unix.stackexchange.com'), 'https://unix.stackexchange.com');
	t.is(normalizeUrl('www.api.example.com'), 'http://api.example.com');
	
	// Issue #38 - Should NOT strip www when it would break the domain
	t.is(normalizeUrl('www.com'), 'http://www.com');
	t.is(normalizeUrl('https://www.com'), 'https://www.com');
	
	// Edge case: www.www.com should NOT be stripped (intentional behavior)
	t.is(normalizeUrl('www.www.com'), 'http://www.www.com');
	t.is(normalizeUrl('www.www.example.com'), 'http://www.www.example.com');
});

test('removeQueryParameters option', t => {
	const options = {
		stripWWW: false,
		removeQueryParameters: [/^utm_\w+/i, 'ref'],
	};
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar&utm_medium=test'), 'http://sindresorhus.com/?foo=bar');
	t.is(normalizeUrl('http://www.sindresorhus.com', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar', options), 'http://www.sindresorhus.com/?foo=bar');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar&utm_medium=test&ref=test_ref', options), 'http://www.sindresorhus.com/?foo=bar');
	t.is(normalizeUrl('https://example.com?foo=1&foo2=2&bar=3', {removeQueryParameters: [/^foo/gi]}), 'https://example.com/?bar=3');
	t.is(normalizeUrl('https://example.com?foo=1&foo2=2&bar=3', {removeQueryParameters: [/^foo/y]}), 'https://example.com/?bar=3');
	t.is(normalizeUrl('https://example.com?foo=1&foo2=2&bar=3', {removeQueryParameters: ['foo', /^foo2/y]}), 'https://example.com/?bar=3');
	const globalFilter = /^foo/g;
	globalFilter.lastIndex = 2;
	t.is(normalizeUrl('https://example.com?foo=1&bar=2', {removeQueryParameters: [globalFilter]}), 'https://example.com/?bar=2');
});

test('removeQueryParameters boolean `true` option', t => {
	const options = {
		stripWWW: false,
		removeQueryParameters: true,
	};

	t.is(normalizeUrl('http://www.sindresorhus.com', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar&utm_medium=test&ref=test_ref', options), 'http://www.sindresorhus.com');
});

test('removeQueryParameters boolean `false` option', t => {
	const options = {
		stripWWW: false,
		removeQueryParameters: false,
	};

	t.is(normalizeUrl('http://www.sindresorhus.com', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar', options), 'http://www.sindresorhus.com/?foo=bar');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar&utm_medium=test&ref=test_ref', options), 'http://www.sindresorhus.com/?foo=bar&ref=test_ref&utm_medium=test');
});

test('keepQueryParameters option', t => {
	const options = {
		stripWWW: false,
		removeQueryParameters: false,
		keepQueryParameters: [/^utm_\w+/i, 'ref'],
	};
	t.is(normalizeUrl('https://sindresorhus.com', options), 'https://sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar', options), 'http://www.sindresorhus.com');
	t.is(normalizeUrl('www.sindresorhus.com?foo=bar&utm_medium=test&ref=test_ref', options), 'http://www.sindresorhus.com/?ref=test_ref&utm_medium=test');

	t.is(normalizeUrl('https://example.com?foo=1&bar=2', {
		removeQueryParameters: ['foo'],
		keepQueryParameters: ['foo', 'bar']
	}), 'https://example.com/?bar=2&foo=1');

	t.is(normalizeUrl('https://example.com?foo=1&bar=2', {
		removeQueryParameters: true,
		keepQueryParameters: ['foo']
	}), 'https://example.com/?foo=1');

	t.is(normalizeUrl('https://example.com?foo=1&bar=2', {
		keepQueryParameters: []
	}), 'https://example.com');

	t.is(normalizeUrl('https://example.com?foo=1&foo2=2&bar=3', {
		keepQueryParameters: [/^foo/gi]
	}), 'https://example.com/?foo=1&foo2=2');

	t.is(normalizeUrl('https://example.com?foo=1&foo2=2&bar=3', {
		keepQueryParameters: [/^foo/y]
	}), 'https://example.com/?foo=1&foo2=2');

	t.is(normalizeUrl('https://example.com?foo=1&foo2=2&bar=3', {
		keepQueryParameters: ['foo2', /^foo/y]
	}), 'https://example.com/?foo=1&foo2=2');

	const globalKeep = /^foo/g;
	globalKeep.lastIndex = 10;
	t.is(normalizeUrl('https://example.com?foo=1&bar=2', {
		keepQueryParameters: [globalKeep]
	}), 'https://example.com/?foo=1');
});

test('forceHttp option', t => {
	const options = {forceHttp: true};
	t.is(normalizeUrl('https://sindresorhus.com'), 'https://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('https://www.sindresorhus.com', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('//sindresorhus.com', options), 'http://sindresorhus.com');
});

test('forceHttp option with forceHttps', t => {
	t.throws(() => {
		normalizeUrl('https://www.sindresorhus.com', {forceHttp: true, forceHttps: true});
	}, {
		message: 'The `forceHttp` and `forceHttps` options cannot be used together',
	});
});

test('forceHttps option', t => {
	const options = {forceHttps: true};
	t.is(normalizeUrl('https://sindresorhus.com'), 'https://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com', options), 'https://sindresorhus.com');
	t.is(normalizeUrl('https://www.sindresorhus.com', options), 'https://sindresorhus.com');
	t.is(normalizeUrl('//sindresorhus.com', options), 'https://sindresorhus.com');
});

test('removeTrailingSlash option', t => {
	const options = {removeTrailingSlash: false};
	t.is(normalizeUrl('http://sindresorhus.com'), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/'), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/redirect'), 'http://sindresorhus.com/redirect');
	t.is(normalizeUrl('http://sindresorhus.com/redirect/'), 'http://sindresorhus.com/redirect');
	t.is(normalizeUrl('http://sindresorhus.com/redirect/', options), 'http://sindresorhus.com/redirect/');
	t.is(normalizeUrl('http://sindresorhus.com/redirect/', options), 'http://sindresorhus.com/redirect/');
	t.is(normalizeUrl('http://sindresorhus.com/#/'), 'http://sindresorhus.com/#/');
	t.is(normalizeUrl('http://sindresorhus.com/#/', options), 'http://sindresorhus.com/#/');
	t.is(normalizeUrl('http://sindresorhus.com/?unicorns=true'), 'http://sindresorhus.com/?unicorns=true');
	t.is(normalizeUrl('http://sindresorhus.com/?unicorns=true', options), 'http://sindresorhus.com/?unicorns=true');
});

test('removeExplicitPort option', t => {
	const options = {removeExplicitPort: true};
	t.is(normalizeUrl('http://sindresorhus.com:123', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('https://sindresorhus.com:123', options), 'https://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com:443', options), 'http://sindresorhus.com');
	t.is(normalizeUrl('https://sindresorhus.com:80', options), 'https://sindresorhus.com');
});

test('removeSingleSlash option', t => {
	const options = {removeSingleSlash: false};
	t.is(normalizeUrl('https://sindresorhus.com', options), 'https://sindresorhus.com');
	t.is(normalizeUrl('https://sindresorhus.com/', options), 'https://sindresorhus.com/');
	t.is(normalizeUrl('https://sindresorhus.com/redirect', options), 'https://sindresorhus.com/redirect');
	t.is(normalizeUrl('https://sindresorhus.com/redirect/', options), 'https://sindresorhus.com/redirect');
	t.is(normalizeUrl('https://sindresorhus.com/#/', options), 'https://sindresorhus.com/#/');
	t.is(normalizeUrl('https://sindresorhus.com/?unicorns=true', options), 'https://sindresorhus.com/?unicorns=true');
});

test('removeSingleSlash option combined with removeTrailingSlash option', t => {
	const options = {removeTrailingSlash: false, removeSingleSlash: false};
	t.is(normalizeUrl('https://sindresorhus.com', options), 'https://sindresorhus.com');
	t.is(normalizeUrl('https://sindresorhus.com/', options), 'https://sindresorhus.com/');
	t.is(normalizeUrl('https://sindresorhus.com/redirect', options), 'https://sindresorhus.com/redirect');
	t.is(normalizeUrl('https://sindresorhus.com/redirect/', options), 'https://sindresorhus.com/redirect/');
	t.is(normalizeUrl('https://sindresorhus.com/#/', options), 'https://sindresorhus.com/#/');
	t.is(normalizeUrl('https://sindresorhus.com/?unicorns=true', options), 'https://sindresorhus.com/?unicorns=true');
});

test('removeDirectoryIndex option', t => {
	const options1 = {removeDirectoryIndex: ['index.html', 'index.php']};
	t.is(normalizeUrl('http://sindresorhus.com/index.html'), 'http://sindresorhus.com/index.html');
	t.is(normalizeUrl('http://sindresorhus.com/index.html', options1), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/index.htm', options1), 'http://sindresorhus.com/index.htm');
	t.is(normalizeUrl('http://sindresorhus.com/index.php', options1), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/path/index.html'), 'http://sindresorhus.com/path/index.html');
	t.is(normalizeUrl('http://sindresorhus.com/path/index.html', options1), 'http://sindresorhus.com/path');
	t.is(normalizeUrl('http://sindresorhus.com/path/index.htm', options1), 'http://sindresorhus.com/path/index.htm');
	t.is(normalizeUrl('http://sindresorhus.com/path/index.php', options1), 'http://sindresorhus.com/path');
	t.is(normalizeUrl('http://sindresorhus.com/foo/bar/index.html', options1), 'http://sindresorhus.com/foo/bar');

	const options2 = {removeDirectoryIndex: [/^index\.[a-z]+$/, 'remove.html']};
	t.is(normalizeUrl('http://sindresorhus.com/index.html'), 'http://sindresorhus.com/index.html');
	t.is(normalizeUrl('http://sindresorhus.com/index.html', options2), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/index/index.html', options2), 'http://sindresorhus.com/index');
	t.is(normalizeUrl('http://sindresorhus.com/remove.html', options2), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/default.htm', options2), 'http://sindresorhus.com/default.htm');
	t.is(normalizeUrl('http://sindresorhus.com/index.php', options2), 'http://sindresorhus.com');

	const globalIndex = /index\.html/g;
	globalIndex.lastIndex = 5;
	const options2b = {removeDirectoryIndex: [globalIndex, /index\.php/y]};
	t.is(normalizeUrl('http://sindresorhus.com/index.html', options2b), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/index.php', options2b), 'http://sindresorhus.com');

	const options3 = {removeDirectoryIndex: true};
	t.is(normalizeUrl('http://sindresorhus.com/index.html'), 'http://sindresorhus.com/index.html');
	t.is(normalizeUrl('http://sindresorhus.com/index.html', options3), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/index.htm', options3), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/index.php', options3), 'http://sindresorhus.com');

	// Should handle trailing slashes consistently
	const options4 = {removeDirectoryIndex: ['fr']};
	t.is(normalizeUrl('http://example.com/fr', options4), 'http://example.com');
	t.is(normalizeUrl('http://example.com/fr/', options4), 'http://example.com');
	t.is(normalizeUrl('http://example.com/path/fr', options4), 'http://example.com/path');
	t.is(normalizeUrl('http://example.com/path/fr/', options4), 'http://example.com/path');
});

test('removeTrailingSlash and removeDirectoryIndex options)', t => {
	const options1 = {
		removeTrailingSlash: true,
		removeDirectoryIndex: true,
	};
	t.is(normalizeUrl('http://sindresorhus.com/path/', options1), 'http://sindresorhus.com/path');
	t.is(normalizeUrl('http://sindresorhus.com/path/index.html', options1), 'http://sindresorhus.com/path');
	t.is(normalizeUrl('http://sindresorhus.com/#/path/', options1), 'http://sindresorhus.com/#/path/');
	t.is(normalizeUrl('http://sindresorhus.com/foo/#/bar/', options1), 'http://sindresorhus.com/foo#/bar/');

	const options2 = {
		removeTrailingSlash: false,
		removeDirectoryIndex: true,
	};
	t.is(normalizeUrl('http://sindresorhus.com/path/', options2), 'http://sindresorhus.com/path/');
	t.is(normalizeUrl('http://sindresorhus.com/path/index.html', options2), 'http://sindresorhus.com/path/');
	t.is(normalizeUrl('http://sindresorhus.com/#/path/', options2), 'http://sindresorhus.com/#/path/');
});

test('sortQueryParameters option', t => {
	const options1 = {
		sortQueryParameters: true,
	};
	t.is(normalizeUrl('http://sindresorhus.com/?a=Z&b=Y&c=X&d=W', options1), 'http://sindresorhus.com/?a=Z&b=Y&c=X&d=W');
	t.is(normalizeUrl('http://sindresorhus.com/?b=Y&c=X&a=Z&d=W', options1), 'http://sindresorhus.com/?a=Z&b=Y&c=X&d=W');
	t.is(normalizeUrl('http://sindresorhus.com/?a=Z&d=W&b=Y&c=X', options1), 'http://sindresorhus.com/?a=Z&b=Y&c=X&d=W');
	t.is(normalizeUrl('http://sindresorhus.com/', options1), 'http://sindresorhus.com');

	const options2 = {
		sortQueryParameters: false,
	};
	t.is(normalizeUrl('http://sindresorhus.com/?a=Z&b=Y&c=X&d=W', options2), 'http://sindresorhus.com/?a=Z&b=Y&c=X&d=W');
	t.is(normalizeUrl('http://sindresorhus.com/?b=Y&c=X&a=Z&d=W', options2), 'http://sindresorhus.com/?b=Y&c=X&a=Z&d=W');
	t.is(normalizeUrl('http://sindresorhus.com/?a=Z&d=W&b=Y&c=X', options2), 'http://sindresorhus.com/?a=Z&d=W&b=Y&c=X');
	t.is(normalizeUrl('http://sindresorhus.com/', options2), 'http://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/?a=/path', options1), normalizeUrl('http://sindresorhus.com/?a=/path', options2));
});

test('invalid urls', t => {
	t.throws(() => {
		normalizeUrl('http://');
	}, {
		message: /^Invalid URL/,
	});

	t.throws(() => {
		normalizeUrl('/');
	}, {
		message: /^Invalid URL/,
	});

	t.throws(() => {
		normalizeUrl('/relative/path/');
	}, {
		message: /^Invalid URL/,
	});
});

test('remove duplicate pathname slashes', t => {
	t.is(normalizeUrl('http://sindresorhus.com////foo/bar'), 'http://sindresorhus.com/foo/bar');
	t.is(normalizeUrl('http://sindresorhus.com////foo////bar'), 'http://sindresorhus.com/foo/bar');
	t.is(normalizeUrl('//sindresorhus.com//foo', {normalizeProtocol: false}), '//sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com:5000///foo'), 'http://sindresorhus.com:5000/foo');
	t.is(normalizeUrl('http://sindresorhus.com///foo'), 'http://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com:5000//foo'), 'http://sindresorhus.com:5000/foo');
	t.is(normalizeUrl('http://sindresorhus.com//foo'), 'http://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/s3://sindresorhus.com'), 'http://sindresorhus.com/s3://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/s3://sindresorhus.com//foo'), 'http://sindresorhus.com/s3://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com//foo/s3://sindresorhus.com'), 'http://sindresorhus.com/foo/s3://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/git://sindresorhus.com'), 'http://sindresorhus.com/git://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/git://sindresorhus.com//foo'), 'http://sindresorhus.com/git://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com//foo/git://sindresorhus.com//foo'), 'http://sindresorhus.com/foo/git://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/a://sindresorhus.com//foo'), 'http://sindresorhus.com/a:/sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/alongprotocolwithin50charlimitxxxxxxxxxxxxxxxxxxxx://sindresorhus.com//foo'), 'http://sindresorhus.com/alongprotocolwithin50charlimitxxxxxxxxxxxxxxxxxxxx://sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/alongprotocolexceeds50charlimitxxxxxxxxxxxxxxxxxxxxx://sindresorhus.com//foo'), 'http://sindresorhus.com/alongprotocolexceeds50charlimitxxxxxxxxxxxxxxxxxxxxx:/sindresorhus.com/foo');
	t.is(normalizeUrl('http://sindresorhus.com/a2-.+://sindresorhus.com'), 'http://sindresorhus.com/a2-.+://sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/a2-.+_://sindresorhus.com'), 'http://sindresorhus.com/a2-.+_:/sindresorhus.com');
	t.is(normalizeUrl('http://sindresorhus.com/2abc://sindresorhus.com'), 'http://sindresorhus.com/2abc:/sindresorhus.com');
});

test('data URL', t => {
	// Invalid URL.
	t.throws(() => {
		normalizeUrl('data:');
	}, {
		message: 'Invalid URL: data:',
	});

	// Strip default MIME type
	t.is(normalizeUrl('data:text/plain,foo'), 'data:,foo');

	// Strip default charset
	t.is(normalizeUrl('data:;charset=us-ascii,foo'), 'data:,foo');

	// Normalize away trailing semicolon.
	t.is(normalizeUrl('data:;charset=UTF-8;,foo'), 'data:;charset=utf-8,foo');

	// Empty MIME type.
	t.is(normalizeUrl('data:,'), 'data:,');

	// Empty MIME type with charset.
	t.is(normalizeUrl('data:;charset=utf-8,foo'), 'data:;charset=utf-8,foo');

	// Lowercase the MIME type.
	t.is(normalizeUrl('data:TEXT/HTML,foo'), 'data:text/html,foo');

	// Strip empty hash.
	t.is(normalizeUrl('data:,foo# '), 'data:,foo');

	// Key only mediaType attribute.
	t.is(normalizeUrl('data:;foo=;bar,'), 'data:;foo;bar,');

	// Lowercase the charset.
	t.is(normalizeUrl('data:;charset=UTF-8,foo'), 'data:;charset=utf-8,foo');

	// Remove spaces after the comma when it's base64.
	t.is(normalizeUrl('data:;base64, Zm9v #foo #bar'), 'data:;base64,Zm9v#foo #bar');

	// Keep spaces when it's not base64.
	t.is(normalizeUrl('data:, foo #bar'), 'data:, foo #bar');

	// Options.
	const options = {
		defaultProtocol: 'http',
		normalizeProtocol: true,
		forceHttp: true,
		stripHash: true,
		stripWWW: true,
		stripProtocol: true,
		removeQueryParameters: [/^utm_\w+/i, 'ref'],
		sortQueryParameters: true,
		removeTrailingSlash: true,
		removeDirectoryIndex: true,
	};
	t.is(normalizeUrl('data:,sindresorhus.com/', options), 'data:,sindresorhus.com/');
	t.is(normalizeUrl('data:,sindresorhus.com/index.html', options), 'data:,sindresorhus.com/index.html');
	t.is(normalizeUrl('data:,sindresorhus.com?foo=bar&a=a&utm_medium=test', options), 'data:,sindresorhus.com?foo=bar&a=a&utm_medium=test');
	t.is(normalizeUrl('data:,foo#bar', options), 'data:,foo');
	t.is(normalizeUrl('data:,www.sindresorhus.com', options), 'data:,www.sindresorhus.com');
});

test('prevents homograph attack', t => {
	// The input string uses Unicode to make it look like a valid `ebay.com` URL.
	t.is(normalizeUrl('https://ebаy.com'), 'https://xn--eby-7cd.com');
});

test('does not have exponential performance for data URLs', t => {
	for (let index = 0; index < 1000; index += 50) {
		const url = 'data:' + Array.from({length: index}).fill(',#').join('') + '\ra';
		const start = Date.now();

		try {
			normalizeUrl(url);
		} catch {}

		const difference = Date.now() - start;
		t.true(difference < 100, `Execution time: ${difference}`);
	}
});

test('ignore custom schemes', t => {
	t.is(normalizeUrl('tel:004346382763'), 'tel:004346382763');
	t.is(normalizeUrl('mailto:office@foo.com'), 'mailto:office@foo.com');
	t.is(normalizeUrl('sindre://www.sindresorhus.com'), 'sindre://www.sindresorhus.com');
	t.is(normalizeUrl('foo:bar'), 'foo:bar');
});

test('encoded backslashes do not get decoded', t => {
	t.is(normalizeUrl('https://foo.com/some%5Bthing%5Celse/that-is%40great@coding'), 'https://foo.com/some[thing%5Celse/that-is%40great@coding');
	t.is(normalizeUrl('https://foo.com/something%5Celse/great'), 'https://foo.com/something%5Celse/great');

	// Non-encoded backslashes should remain as-is.
	t.is(normalizeUrl('https://foo.com/something\\else/great'), 'https://foo.com/something/else/great');
});

test('removePath option', t => {
	// Boolean: Remove entire path
	t.is(normalizeUrl('https://example.com/path/to/page', {removePath: true}), 'https://example.com');
	t.is(normalizeUrl('https://example.com/path/to/page?query=1', {removePath: true}), 'https://example.com/?query=1');
	t.is(normalizeUrl('https://example.com/path/to/page#hash', {removePath: true}), 'https://example.com/#hash');
	t.is(normalizeUrl('https://example.com/', {removePath: true}), 'https://example.com');
	t.is(normalizeUrl('https://example.com', {removePath: true}), 'https://example.com');
	
	// With other options
	t.is(normalizeUrl('https://example.com/path/', {removePath: true, removeTrailingSlash: true}), 'https://example.com');
	t.is(normalizeUrl('https://www.example.com/path', {removePath: true, stripWWW: true}), 'https://example.com');
});

test('transformPath option', t => {
	// Function: Keep only first path component
	const keepFirst = pathComponents => pathComponents.slice(0, 1);
	t.is(normalizeUrl('https://example.com/api/v1/users', {transformPath: keepFirst}), 'https://example.com/api');
	t.is(normalizeUrl('https://example.com/path/to/page', {transformPath: keepFirst}), 'https://example.com/path');
	t.is(normalizeUrl('https://example.com/', {transformPath: keepFirst}), 'https://example.com');
	
	// Function: Remove specific component
	const removeAdmin = pathComponents => pathComponents.filter(c => c !== 'admin');
	t.is(normalizeUrl('https://example.com/admin/users', {transformPath: removeAdmin}), 'https://example.com/users');
	t.is(normalizeUrl('https://example.com/path/admin/page', {transformPath: removeAdmin}), 'https://example.com/path/page');
	
	// Function: Custom logic
	const customLogic = pathComponents => {
		if (pathComponents[0] === 'api') {
			return pathComponents.slice(0, 1); // Keep /api only
		}
		return []; // Remove everything else
	};
	t.is(normalizeUrl('https://example.com/api/v1/users', {transformPath: customLogic}), 'https://example.com/api');
	t.is(normalizeUrl('https://example.com/other/path', {transformPath: customLogic}), 'https://example.com');
	
	// Edge cases
	t.is(normalizeUrl('https://example.com/path', {transformPath: () => []}), 'https://example.com');
	t.is(normalizeUrl('https://example.com/path', {transformPath: () => null}), 'https://example.com');
	t.is(normalizeUrl('https://example.com/path', {transformPath: () => undefined}), 'https://example.com');
	
	// Combining with removePath (removePath should take precedence)
	t.is(normalizeUrl('https://example.com/path/to/page', {
		removePath: true,
		transformPath: pathComponents => pathComponents.slice(0, 2)
	}), 'https://example.com');
});

test('path-like query strings without equals signs are preserved', t => {
	// Issue #193 - Path-like query strings should not get '=' appended
	t.is(normalizeUrl('https://example.com/index.php?/Some/Route/To/Path/12345'), 'https://example.com/index.php?/Some/Route/To/Path/12345');
	t.is(normalizeUrl('https://example.com/script.php?/api/v1/users/123'), 'https://example.com/script.php?/api/v1/users/123');
	t.is(normalizeUrl('https://example.com/app.php?/admin/dashboard'), 'https://example.com/app.php?/admin/dashboard');
	// Note: trailing slash is removed by default removeTrailingSlash option
	t.is(normalizeUrl('https://example.com/index.php?/path/'), 'https://example.com/index.php?/path');
	// With removeTrailingSlash disabled, trailing slash is preserved
	t.is(normalizeUrl('https://example.com/index.php?/path/', {removeTrailingSlash: false}), 'https://example.com/index.php?/path/');
	
	// Mixed parameters: path-like without '=' and regular with '='
	t.is(normalizeUrl('https://example.com/index.php?b=2&/path/to/resource&a=1'), 'https://example.com/index.php?/path/to/resource&a=1&b=2');
	t.is(normalizeUrl('https://example.com/index.php?/path&param=value'), 'https://example.com/index.php?/path&param=value');
	
	// Regular parameters with empty values should keep '='
	t.is(normalizeUrl('https://example.com/index.php?key='), 'https://example.com/index.php?key=');
	t.is(normalizeUrl('https://example.com/index.php?key=&another='), 'https://example.com/index.php?another=&key=');
	
	// Parameters without values should not get '=' added
	t.is(normalizeUrl('https://example.com/index.php?key'), 'https://example.com/index.php?key');
	t.is(normalizeUrl('https://example.com/index.php?a&b&c'), 'https://example.com/index.php?a&b&c');
	
	// With sortQueryParameters disabled, original format is preserved
	t.is(normalizeUrl('https://example.com/index.php?/Some/Route/To/Path/12345', {sortQueryParameters: false}), 'https://example.com/index.php?/Some/Route/To/Path/12345');
	t.is(normalizeUrl('https://example.com/index.php?key', {sortQueryParameters: false}), 'https://example.com/index.php?key');
	
	// Safety: parameters with similar names should not interfere with each other
	t.is(normalizeUrl('https://example.com/index.php?/path&/longpath'), 'https://example.com/index.php?/longpath&/path');
	t.is(normalizeUrl('https://example.com/index.php?key&anotherkey'), 'https://example.com/index.php?anotherkey&key');
	t.is(normalizeUrl('https://example.com/index.php?/api&/api/v1/users'), 'https://example.com/index.php?/api&/api/v1/users');
});

test('emptyQueryValue option', t => {
	// Default 'preserve' behavior - keeps original format
	t.is(normalizeUrl('https://example.com?key'), 'https://example.com/?key');
	t.is(normalizeUrl('https://example.com?key='), 'https://example.com/?key=');
	t.is(normalizeUrl('https://example.com?a&b=&c=1'), 'https://example.com/?a&b=&c=1');

	// 'always' - always include equals sign
	const always = {emptyQueryValue: 'always'};
	t.is(normalizeUrl('https://example.com?key', always), 'https://example.com/?key=');
	t.is(normalizeUrl('https://example.com?key=', always), 'https://example.com/?key=');
	t.is(normalizeUrl('https://example.com?a&b=&c=1', always), 'https://example.com/?a=&b=&c=1');
	t.is(normalizeUrl('https://example.com?foo&bar&baz=value', always), 'https://example.com/?bar=&baz=value&foo=');

	// 'never' - never include equals sign for empty values
	const never = {emptyQueryValue: 'never'};
	t.is(normalizeUrl('https://example.com?key', never), 'https://example.com/?key');
	t.is(normalizeUrl('https://example.com?key=', never), 'https://example.com/?key');
	t.is(normalizeUrl('https://example.com?a&b=&c=1', never), 'https://example.com/?a&b&c=1');
	t.is(normalizeUrl('https://example.com?foo=&bar=&baz=value', never), 'https://example.com/?bar&baz=value&foo');

	// Works with sortQueryParameters disabled
	t.is(normalizeUrl('https://example.com?b&a=', {emptyQueryValue: 'always', sortQueryParameters: false}), 'https://example.com/?b=&a=');
	t.is(normalizeUrl('https://example.com?b=&a', {emptyQueryValue: 'never', sortQueryParameters: false}), 'https://example.com/?b&a');

	// 'never' should not strip = when value itself ends with =
	t.is(normalizeUrl('https://example.com?key==', {emptyQueryValue: 'never'}), 'https://example.com/?key==');
	t.is(normalizeUrl('https://example.com?key=value=', {emptyQueryValue: 'never'}), 'https://example.com/?key=value=');

	// 'preserve' should work correctly when removeQueryParameters modifies the URL
	t.is(normalizeUrl('https://example.com?key&utm_source=test'), 'https://example.com/?key');
	t.is(normalizeUrl('https://example.com?key&utm_source=test', {sortQueryParameters: false}), 'https://example.com/?key');

	// 'preserve' should work correctly with URL-encoded keys containing spaces
	t.is(normalizeUrl('https://example.com?foo%20bar'), 'https://example.com/?foo%20bar');
	t.is(normalizeUrl('https://example.com?foo%20bar='), 'https://example.com/?foo%20bar=');
	t.is(normalizeUrl('https://example.com?foo%20bar=', {emptyQueryValue: 'never'}), 'https://example.com/?foo%20bar');

	// 'preserve' with duplicate keys having mixed formats normalizes all to the same format
	t.is(normalizeUrl('https://example.com?a&a=', {sortQueryParameters: false}), 'https://example.com/?a&a');
	t.is(normalizeUrl('https://example.com?a=&a', {sortQueryParameters: false}), 'https://example.com/?a&a');

	// Keys with + (which means space in query strings)
	t.is(normalizeUrl('https://example.com?foo+bar'), 'https://example.com/?foo%20bar');
	t.is(normalizeUrl('https://example.com?foo+bar='), 'https://example.com/?foo%20bar=');
	t.is(normalizeUrl('https://example.com?foo+bar=', {emptyQueryValue: 'never'}), 'https://example.com/?foo%20bar');
	t.is(normalizeUrl('https://example.com?foo+bar=value'), 'https://example.com/?foo%20bar=value');
	t.is(normalizeUrl('https://example.com?foo+bar=value', {sortQueryParameters: false}), 'https://example.com/?foo%20bar=value');

	// Keys with encoded plus should stay literal
	t.is(normalizeUrl('https://example.com?foo%2Bbar=1'), 'https://example.com/?foo%2Bbar=1');
	t.is(normalizeUrl('https://example.com?foo%2Bbar='), 'https://example.com/?foo%2Bbar=');
	t.is(normalizeUrl('https://example.com?foo%2Bbar=', {emptyQueryValue: 'never'}), 'https://example.com/?foo%2Bbar');

	// Invalid percent-encoding in key should not throw
	t.is(normalizeUrl('https://example.com?%E0%A4'), 'https://example.com/?%EF%BF%BD');
	t.is(normalizeUrl('https://example.com?%E0%A4='), 'https://example.com/?%EF%BF%BD=');
	t.is(normalizeUrl('https://example.com?%E0%A4&%E0%A4='), 'https://example.com/?%EF%BF%BD&%EF%BF%BD');
	t.is(normalizeUrl('https://example.com?%E0%A4=&%EF%BF%BD='), 'https://example.com/?%EF%BF%BD=&%EF%BF%BD=');

	// Keys with + when sortQueryParameters is disabled
	t.is(normalizeUrl('https://example.com?foo+bar', {sortQueryParameters: false}), 'https://example.com/?foo%20bar');
	t.is(normalizeUrl('https://example.com?foo+bar=', {sortQueryParameters: false}), 'https://example.com/?foo%20bar=');
	t.is(normalizeUrl('https://example.com?foo+bar&baz+qux=', {sortQueryParameters: false}), 'https://example.com/?foo%20bar&baz%20qux=');

	// Unicode keys
	t.is(normalizeUrl('https://example.com?café'), 'https://example.com/?caf%C3%A9');
	t.is(normalizeUrl('https://example.com?café='), 'https://example.com/?caf%C3%A9=');
	t.is(normalizeUrl('https://example.com?café=', {emptyQueryValue: 'never'}), 'https://example.com/?caf%C3%A9');

	// Encoded delimiters in keys
	t.is(normalizeUrl('https://example.com?foo%26bar=', {emptyQueryValue: 'never'}), 'https://example.com/?foo%26bar');
	t.is(normalizeUrl('https://example.com?foo%3Dbar=', {emptyQueryValue: 'never'}), 'https://example.com/?foo%3Dbar');
	t.is(normalizeUrl('https://example.com?foo%26bar&utm_source=test'), 'https://example.com/?foo%26bar');
	t.is(normalizeUrl('https://example.com?foo%2526bar='), 'https://example.com/?foo%2526bar=');
	t.is(normalizeUrl('https://example.com?foo%2526bar=', {emptyQueryValue: 'never'}), 'https://example.com/?foo%2526bar');

	// Multiple keys with mixed formats
	t.is(normalizeUrl('https://example.com?a&b=&c=1'), 'https://example.com/?a&b=&c=1');
	t.is(normalizeUrl('https://example.com?foo%20bar&baz'), 'https://example.com/?baz&foo%20bar');

	// Duplicate keys with sorting enabled (default) - mixed formats normalize to same format
	t.is(normalizeUrl('https://example.com?a&a='), 'https://example.com/?a&a');
	t.is(normalizeUrl('https://example.com?a=&a'), 'https://example.com/?a&a');
	t.is(normalizeUrl('https://example.com?a&a&a='), 'https://example.com/?a&a&a');
	t.is(normalizeUrl('https://example.com?a=&a=&a'), 'https://example.com/?a&a&a');

	// Multiple = in values (only first = is the delimiter)
	t.is(normalizeUrl('https://example.com?key=a=b=c'), 'https://example.com/?key=a=b=c');
	t.is(normalizeUrl('https://example.com?data=abc=='), 'https://example.com/?data=abc==');

	// Encoded = (%3D) in values gets decoded (= is safe unencoded in values)
	t.is(normalizeUrl('https://example.com?key=val%3Due'), 'https://example.com/?key=val=ue');
	t.is(normalizeUrl('https://example.com?key=%3D'), 'https://example.com/?key==');
	t.is(normalizeUrl('https://example.com?key=val%3Due', {sortQueryParameters: false}), 'https://example.com/?key=val=ue');

	// All params removed leaves no query string
	t.is(normalizeUrl('https://example.com?utm_source=test&utm_medium=web'), 'https://example.com');
	t.is(normalizeUrl('https://example.com?key', {removeQueryParameters: true}), 'https://example.com');

	// Single param edge cases
	t.is(normalizeUrl('https://example.com?=value'), 'https://example.com/?=value');
	t.is(normalizeUrl('https://example.com?='), 'https://example.com/?=');
	t.is(normalizeUrl('https://example.com?=value', {emptyQueryValue: 'always'}), 'https://example.com/?=value');
	t.is(normalizeUrl('https://example.com?=value', {emptyQueryValue: 'never'}), 'https://example.com/?=value');
	t.is(normalizeUrl('https://example.com?=', {emptyQueryValue: 'always'}), 'https://example.com/?=');
	t.is(normalizeUrl('https://example.com?=', {emptyQueryValue: 'never'}), 'https://example.com/?=');
	t.is(normalizeUrl('https://example.com?=&a=', {emptyQueryValue: 'never'}), 'https://example.com/?=&a');
	t.is(normalizeUrl('https://example.com?=&=', {emptyQueryValue: 'always'}), 'https://example.com/?=&=');
	t.is(normalizeUrl('https://example.com?=&=', {emptyQueryValue: 'never'}), 'https://example.com/?=&=');
	t.is(normalizeUrl('https://example.com?=&a', {emptyQueryValue: 'always'}), 'https://example.com/?=&a=');
	t.is(normalizeUrl('https://example.com?&', {emptyQueryValue: 'always'}), 'https://example.com');
	t.is(normalizeUrl('https://example.com?&', {emptyQueryValue: 'never'}), 'https://example.com');

	// Empty segments are removed even when sorting is disabled
	t.is(normalizeUrl('https://example.com?foo&&bar', {sortQueryParameters: false}), 'https://example.com/?foo&bar');
	t.is(normalizeUrl('https://example.com?foo&&bar', {sortQueryParameters: false, emptyQueryValue: 'always'}), 'https://example.com/?foo=&bar=');
	t.is(normalizeUrl('https://example.com?foo&&bar', {sortQueryParameters: false, emptyQueryValue: 'never'}), 'https://example.com/?foo&bar');
	t.is(normalizeUrl('https://example.com?&&', {sortQueryParameters: false}), 'https://example.com');

	// Hash does not affect query normalization
	t.is(normalizeUrl('https://example.com?key#hash'), 'https://example.com/?key#hash');
	t.is(normalizeUrl('https://example.com?key=#hash'), 'https://example.com/?key=#hash');
});
