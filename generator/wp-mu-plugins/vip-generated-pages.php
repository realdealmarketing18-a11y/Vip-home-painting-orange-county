<?php
/**
 * VIP — render generator-built pages exactly as authored.
 *
 * Reference copy. The live file is at
 * wp-content/novamira-sandbox/vip-generated-pages.php on viphomepainting.com.
 * Kept here so it survives a rebuild, migration, or restore. See README.md.
 *
 * These pages are complete HTML documents produced by generator/generate.js:
 * their own reset, design tokens, layout, nav and footer, inlined in one <style>
 * block. WordPress and the theme both interfere, and it is not subtle:
 *
 *  1. wpautop runs on the_content and inserts <p> and <br> INSIDE the <style>
 *     block. The browser stops parsing CSS at the first tag, so most of the
 *     stylesheet silently never applies — confirmed live: the .page and .topbar
 *     rules were absent from document.styleSheets entirely while still being
 *     present in the style element's text.
 *
 *  2. The theme sets body { font-family: var(--vip-fb) !important } and other
 *     globals. Elementor's Canvas template removes the theme's header and footer
 *     MARKUP but still enqueues its stylesheet, so the theme wins anyway.
 *
 * Both are disabled for pages flagged _vip_generated. Nothing else on the site
 * is affected — the home page, about, contact and anything built in Elementor
 * keep the theme exactly as it is.
 */

function vip_is_generated_page() {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	$id = get_queried_object_id();
	return $id && get_post_meta( $id, '_vip_generated', true ) === '1';
}

/**
 * 1. Keep WordPress's autoformatter away from the markup.
 *    Removed on the_content filter only, and only for these pages.
 */
add_action( 'wp', function () {
	if ( ! vip_is_generated_page() ) {
		return;
	}
	remove_filter( 'the_content', 'wpautop' );
	remove_filter( 'the_content', 'wptexturize' );
	remove_filter( 'the_content', 'shortcode_unautop' );
	remove_filter( 'the_content', 'convert_smilies', 20 );
} );

/**
 * 2. Drop the theme's stylesheet on these pages. The page brings its own.
 *    Late priority so it runs after the theme has enqueued.
 */
add_action( 'wp_enqueue_scripts', function () {
	if ( ! vip_is_generated_page() ) {
		return;
	}

	global $wp_styles;
	if ( ! $wp_styles instanceof WP_Styles ) {
		return;
	}

	$theme_dir = get_template_directory_uri();
	$child_dir = get_stylesheet_directory_uri();

	foreach ( $wp_styles->queue as $handle ) {
		$src = isset( $wp_styles->registered[ $handle ] ) ? $wp_styles->registered[ $handle ]->src : '';
		if ( ! $src ) {
			continue;
		}
		// only the active theme's own CSS; leave Elementor and plugins alone
		if ( strpos( $src, $theme_dir ) === 0 || strpos( $src, $child_dir ) === 0 ) {
			wp_dequeue_style( $handle );
		}
	}
}, 9999 );
