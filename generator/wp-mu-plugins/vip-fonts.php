<?php
/**
 * VIP — load the brand fonts on generated pages.
 *
 * Reference copy. The live file is at
 * wp-content/novamira-sandbox/vip-fonts.php on viphomepainting.com.
 * Kept here so it survives a rebuild, migration, or restore. See README.md.
 *
 * publish-wp.js sends the body, styles, scripts and JSON-LD — NOT the source
 * file's <head>. The generated pages used to carry an @import for Fraunces and
 * Inter inside their <style> block, which travelled with the content and worked.
 * That @import was removed because @import is the slowest way to load a font:
 * the browser cannot discover it until the sheet downloads and parses, so the
 * request starts late and blocks first paint.
 *
 * The replacement <link> lives in the source file's head, so it reaches the
 * github.io build but never reaches WordPress. Without this file the pages name
 * Fraunces and Inter in CSS and load neither — they fall back silently to the
 * theme's Cormorant Garamond and a system sans, which looks close enough to
 * miss. Confirmed live before this was added: zero requests for either family.
 *
 * Enqueued properly here, so the link lands in <head> ahead of first paint,
 * with preconnect hints, on generated pages only.
 */

function vip_fonts_is_generated() {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	$id = get_queried_object_id();
	return $id && get_post_meta( $id, '_vip_generated', true ) === '1';
}

add_action( 'wp_enqueue_scripts', function () {
	if ( ! vip_fonts_is_generated() ) {
		return;
	}
	wp_enqueue_style(
		'vip-brand-fonts',
		'https://fonts.googleapis.com/css2'
			. '?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,500;1,9..144,600'
			. '&family=Inter:wght@300;400;500;600;700;800'
			. '&display=swap',
		array(),
		null
	);
}, 5 );

/* Opens the TLS handshake to both hosts before the stylesheet is requested. */
add_filter( 'wp_resource_hints', function ( $hints, $relation ) {
	if ( 'preconnect' !== $relation || ! vip_fonts_is_generated() ) {
		return $hints;
	}
	$hints[] = array( 'href' => 'https://fonts.googleapis.com' );
	$hints[] = array( 'href' => 'https://fonts.gstatic.com', 'crossorigin' => 'anonymous' );
	return $hints;
}, 10, 2 );
